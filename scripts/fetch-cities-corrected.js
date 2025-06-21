// Script corrigido para buscar imagens das 200 maiores cidades dos EUA
// Com correções na autorização Pexels e lógica de estado

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Configuração dos provedores de imagem
const PROVIDERS = {
  pexels: {
    name: 'Pexels',
    key: process.env.PEXELS_API_KEY,
    url: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': process.env.PEXELS_API_KEY }, // Formato correto para Pexels
    delay: 5000, // 5 segundos entre requests (mais rápido para teste)
    lastUsed: 0
  },
  unsplash: {
    name: 'Unsplash',
    key: process.env.UNSPLASH_ACCESS_KEY,
    url: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    delay: 10000, // 10 segundos entre requests
    lastUsed: 0
  },
  pixabay: {
    name: 'Pixabay',
    key: process.env.PIXABAY_API_KEY,
    url: 'https://pixabay.com/api/',
    delay: 7000, // 7 segundos entre requests
    lastUsed: 0
  }
};

// Ordem de rotação dos provedores
const PROVIDER_ORDER = ['pexels', 'unsplash', 'pixabay'];

// Estado global
let stats = {
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  byProvider: {
    pexels: { attempts: 0, success: 0, errors: 0 },
    pixabay: { attempts: 0, success: 0, errors: 0 },
    unsplash: { attempts: 0, success: 0, errors: 0 }
  },
  errors: []
};

// Função para aguardar
async function smartWait(providerName) {
  const provider = PROVIDERS[providerName];
  const now = Date.now();
  const timeSinceLastUse = now - provider.lastUsed;
  
  if (timeSinceLastUse < provider.delay) {
    const waitTime = provider.delay - timeSinceLastUse;
    console.log(`⏳ Aguardando ${Math.round(waitTime/1000)}s para ${provider.name}...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  provider.lastUsed = Date.now();
}

// Função para buscar imagem de um provedor
async function fetchFromProvider(providerName, searchTerm) {
  const provider = PROVIDERS[providerName];
  
  if (!provider.key) {
    throw new Error('API key não configurada');
  }
  
  let url;
  let headers = {};
  
  switch (providerName) {
    case 'pexels':
      url = `${provider.url}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      headers = provider.headers;
      break;
    case 'unsplash':
      url = `${provider.url}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      headers = provider.headers;
      break;
    case 'pixabay':
      url = `${provider.url}?key=${provider.key}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&per_page=3&category=places`;
      break;
  }
  
  console.log(`🌐 Chamando ${provider.name} API...`);
  
  const response = await fetch(url, {
    headers,
    timeout: 15000
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Extrair URL da imagem
  let imageUrl = null;
  switch (providerName) {
    case 'pexels':
      if (data.photos && data.photos.length > 0) {
        imageUrl = data.photos[0].src.large || data.photos[0].src.medium;
      }
      break;
    case 'unsplash':
      if (data.results && data.results.length > 0) {
        imageUrl = data.results[0].urls.regular || data.results[0].urls.full;
      }
      break;
    case 'pixabay':
      if (data.hits && data.hits.length > 0) {
        imageUrl = data.hits[0].largeImageURL || data.hits[0].webformatURL;
      }
      break;
  }
  
  if (!imageUrl) {
    throw new Error('Nenhuma imagem encontrada');
  }
  
  return imageUrl;
}

// Função para baixar e salvar imagem
async function downloadAndSave(imageUrl, city, providerName) {
  try {
    const imageDir = path.join(process.cwd(), 'public', 'images', 'cities');
    await fs.mkdir(imageDir, { recursive: true });
    
    // Nome do arquivo: ID_nomedacidade
    const filename = `${city.id}_${city.name.toLowerCase().replace(/[^\w]/g, '')}.jpg`;
    const filepath = path.join(imageDir, filename);
    
    // Verificar se já existe
    try {
      await fs.access(filepath);
      console.log(`⏭️  Arquivo já existe: ${filename}`);
      stats.skipped++;
      return true;
    } catch {
      // Não existe, continuar
    }
    
    // Baixar imagem
    console.log(`📥 Baixando imagem...`);
    const response = await fetch(imageUrl, { timeout: 30000 });
    
    if (!response.ok) {
      throw new Error(`Download falhou: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filepath, buffer);
    
    // Atualizar banco de dados
    const relativePath = `/images/cities/${filename}`;
    const { error } = await supabase
      .from('cities')
      .update({ 
        imagem: relativePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', city.id);
    
    if (error) {
      console.error(`❌ Erro ao atualizar BD: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Salvo: ${filename} (${Math.round(buffer.length/1024)}KB)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao baixar/salvar: ${error.message}`);
    return false;
  }
}

// Função para processar uma cidade
async function processCity(city, index, total) {
  const searchTerm = `${city.name} ${city.state} skyline cityscape`;
  
  console.log(`\n🎯 [${index + 1}/${total}] ${city.name}, ${city.state}`);
  console.log(`🔍 Busca: "${searchTerm}"`);
  console.log(`👥 População: ${city.population?.toLocaleString() || 'N/A'}`);
  
  // Tentar com cada provedor
  for (const providerName of PROVIDER_ORDER) {
    try {
      console.log(`🔄 Tentando ${PROVIDERS[providerName].name}...`);
      
      stats.byProvider[providerName].attempts++;
      
      // Aguardar se necessário
      await smartWait(providerName);
      
      // Buscar imagem
      const imageUrl = await fetchFromProvider(providerName, searchTerm);
      console.log(`🖼️  Imagem encontrada`);
      
      // Baixar e salvar
      const success = await downloadAndSave(imageUrl, city, providerName);
      
      if (success) {
        stats.byProvider[providerName].success++;
        stats.successful++;
        console.log(`✅ SUCESSO com ${PROVIDERS[providerName].name}`);
        return true;
      }
      
    } catch (error) {
      console.log(`❌ ${PROVIDERS[providerName].name}: ${error.message}`);
      stats.byProvider[providerName].errors++;
      stats.errors.push({
        city: `${city.name}, ${city.state}`,
        provider: providerName,
        error: error.message
      });
    }
  }
  
  // Todos falharam
  stats.failed++;
  console.log(`💥 FALHA TOTAL para ${city.name}, ${city.state}`);
  return false;
}

// Função para imprimir estatísticas
function printStats() {
  console.log('\n📊 ===== ESTATÍSTICAS =====');
  console.log(`✅ Sucessos: ${stats.successful}`);
  console.log(`❌ Falhas: ${stats.failed}`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    const successRate = data.attempts > 0 ? Math.round((data.success/data.attempts)*100) : 0;
    console.log(`  ${PROVIDERS[provider].name}: ${data.success}/${data.attempts} (${successRate}%)`);
  });
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Últimos erros (${Math.min(5, stats.errors.length)}):`);
    stats.errors.slice(-5).forEach(error => {
      console.log(`  ${error.city} (${error.provider}): ${error.error}`);
    });
  }
  
  console.log('=========================\n');
}

// Função principal
async function main() {
  try {
    console.log('🚀 ===== SCRIPT CORRIGIDO TOP 200 CIDADES =====');
    
    // Buscar as 200 maiores cidades (com ou sem imagem) para obter os IDs
    const { data: top200, error: errorTop200 } = await supabase
      .from('cities')
      .select('id')
      .order('population', { ascending: false })
      .limit(200);
    if (errorTop200) {
      throw new Error(`Erro ao buscar top 200 cidades: ${errorTop200.message}`);
    }
    const top200Ids = (top200 || []).map(c => c.id);

    // Buscar as próximas 800 maiores cidades sem imagem, excluindo as top 200
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, population')
      .is('imagem', null)
      .not('id', 'in', `(${top200Ids.join(',')})`)
      .order('population', { ascending: false })
      .limit(800);
    if (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`);
    }
    if (!cities || cities.length === 0) {
      console.log('🎉 Todas as 1000 maiores cidades já possuem imagens!');
      return;
    }
    console.log(`📋 ${cities.length} cidades encontradas para completar o TOP 1000`);
    console.log(`🏆 Maior: ${cities[0].name}, ${cities[0].state} (${cities[0].population?.toLocaleString()})`);
    console.log(`🥉 Menor: ${cities[cities.length-1].name}, ${cities[cities.length-1].state} (${cities[cities.length-1].population?.toLocaleString()})`);
    
    // Processar todas as cidades
    for (let i = 0; i < cities.length; i++) {
      await processCity(cities[i], i, cities.length);
      stats.processed++;
      
      // Imprimir estatísticas a cada cidade
      printStats();
      
      // Pausa pequena entre cidades
      if (i < cities.length - 1) {
        console.log('⏳ Pausa de 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n🎉 PROCESSAMENTO CONCLUÍDO!');
    printStats();
    
    if (stats.successful > 0) {
      console.log('\n✅ APIs funcionando! Todas as cidades processadas.');
    } else {
      console.log('\n❌ Ainda há problemas com as APIs. Verificar erros acima.');
    }
    
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message);
    printStats();
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
