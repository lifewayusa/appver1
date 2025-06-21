// Script otimizado para buscar imagens das 200 maiores cidades dos EUA
// Funcionalidades: Rotação inteligente de provedores, delays mínimos, fallback automático

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

// Configuração otimizada das APIs - DELAYS REAIS BASEADOS NOS LIMITES
const APIS = {
  pexels: {
    key: process.env.PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': process.env.PEXELS_API_KEY },
    rateLimit: 200, // 200 requests/hora
    delay: 18000, // 18 segundos (3600s/200 = 18s)
    lastUsed: 0,
    requestCount: 0
  },
  unsplash: {
    key: process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    rateLimit: 50, // 50 requests/hora
    delay: 72000, // 72 segundos (3600s/50 = 72s)
    lastUsed: 0,
    requestCount: 0
  },
  pixabay: {
    key: process.env.PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api/',
    rateLimit: 100, // 100 requests/hora
    delay: 36000, // 36 segundos (3600s/100 = 36s)
    lastUsed: 0,
    requestCount: 0
  }
};

// Rotação de provedores - começar sempre pelo mais rápido
const PROVIDER_ORDER = ['pexels', 'pixabay', 'unsplash'];

// Estado global da rotação
let providerState = {
  currentIndex: 0,
  lastSuccessfulProvider: null,
  totalRequests: 0
};

// Estatísticas detalhadas
let stats = {
  startTime: new Date(),
  totalCities: 0,
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  byProvider: {
    pexels: { attempts: 0, success: 0, errors: 0 },
    unsplash: { attempts: 0, success: 0, errors: 0 },
    pixabay: { attempts: 0, success: 0, errors: 0 }
  },
  timeWaiting: 0,
  timeProcessing: 0,
  downloadedFiles: [],
  failedCities: []
};

// Função para obter próximo provedor na rotação
function getNextProvider() {
  const provider = PROVIDER_ORDER[providerState.currentIndex];
  providerState.currentIndex = (providerState.currentIndex + 1) % PROVIDER_ORDER.length;
  return provider;
}

// Função para aguardar apenas o tempo necessário
async function smartWait(providerName) {
  const api = APIS[providerName];
  const now = Date.now();
  const timeSinceLastUse = now - api.lastUsed;
  
  if (timeSinceLastUse < api.delay) {
    const waitTime = api.delay - timeSinceLastUse;
    console.log(`⏳ Aguardando ${Math.round(waitTime/1000)}s para ${providerName.toUpperCase()}...`);
    
    const waitStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, waitTime));
    stats.timeWaiting += Date.now() - waitStart;
  }
  
  api.lastUsed = Date.now();
  api.requestCount++;
  providerState.totalRequests++;
}

// Função para buscar imagem de um provedor específico
async function fetchFromProvider(providerName, searchTerm) {
  const api = APIS[providerName];
  
  if (!api.key) {
    throw new Error('API key não configurada');
  }
  
  let url;
  switch (providerName) {
    case 'pexels':
      url = `${api.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'unsplash':
      url = `${api.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'pixabay':
      url = `${api.baseUrl}?key=${api.key}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&per_page=3&category=places`;
      break;
  }
  
  const response = await fetch(url, {
    headers: api.headers,
    timeout: 15000
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Extrair URL da imagem baseado no provedor
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

// Função para processar uma cidade com rotação inteligente
async function processCityOptimized(city) {
  const startTime = Date.now();
  
  // Criar termo de busca otimizado
  const searchTerm = `${city.name} ${city.state} skyline cityscape downtown`;
  
  console.log(`\n🎯 Processando: ${city.name}, ${city.state} (Pop: ${city.population?.toLocaleString() || 'N/A'})`);
  console.log(`🔍 Busca: "${searchTerm}"`);
  
  // Tentar com cada provedor em rotação
  for (let attempt = 0; attempt < PROVIDER_ORDER.length; attempt++) {
    const providerName = getNextProvider();
    
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/3: ${providerName.toUpperCase()}`);
      
      // Aguardar apenas se necessário
      await smartWait(providerName);
      
      // Buscar imagem
      const imageUrl = await fetchFromProvider(providerName, searchTerm);
      console.log(`🖼️  Imagem encontrada: ${imageUrl.substring(0, 50)}...`);
      
      // Baixar e salvar
      const success = await downloadAndSave(imageUrl, city, providerName);
      
      if (success) {
        stats.byProvider[providerName].success++;
        stats.successful++;
        providerState.lastSuccessfulProvider = providerName;
        
        const processingTime = Date.now() - startTime;
        stats.timeProcessing += processingTime;
        
        console.log(`✅ SUCESSO com ${providerName.toUpperCase()} (${Math.round(processingTime/1000)}s)`);
        return true;
      }
      
    } catch (error) {
      console.log(`❌ ${providerName.toUpperCase()}: ${error.message}`);
      stats.byProvider[providerName].errors++;
    }
    
    stats.byProvider[providerName].attempts++;
  }
  
  // Todos os provedores falharam
  stats.failed++;
  stats.failedCities.push(city);
  console.log(`💥 FALHA TOTAL para ${city.name}, ${city.state}`);
  return false;
}

// Função para baixar e salvar imagem
async function downloadAndSave(imageUrl, city, providerName) {
  try {
    const imageDir = path.join(process.cwd(), 'public', 'images', 'cities');
    await fs.mkdir(imageDir, { recursive: true });
    
    const filename = `${city.name.toLowerCase().replace(/[^\w]/g, '-')}-${city.state.toLowerCase().replace(/[^\w]/g, '-')}.jpg`;
    const filepath = path.join(imageDir, filename);
    
    // Verificar se já existe
    try {
      await fs.access(filepath);
      console.log(`⏭️  Arquivo já existe: ${filename}`);
      stats.skipped++;
      return true;
    } catch {
      // Não existe, continuar com download
    }
    
    // Baixar imagem
    const response = await fetch(imageUrl, { timeout: 30000 });
    if (!response.ok) {
      throw new Error(`Download falhou: ${response.status}`);
    }
    
    const buffer = await response.buffer();
    await fs.writeFile(filepath, buffer);
    
    // Atualizar banco de dados
    const relativePath = `/images/cities/${filename}`;
    const { error } = await supabase
      .from('cities')
      .update({ 
        imagem: relativePath,
        image_provider: providerName,
        updated_at: new Date().toISOString()
      })
      .eq('id', city.id);
    
    if (error) {
      console.error(`❌ Erro ao atualizar BD: ${error.message}`);
      return false;
    }
    
    stats.downloadedFiles.push({
      name: filename,
      size: buffer.length,
      provider: providerName,
      city: `${city.name}, ${city.state}`
    });
    
    console.log(`💾 Salvo: ${filename} (${Math.round(buffer.length/1024)}KB)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao baixar/salvar: ${error.message}`);
    return false;
  }
}

// Função para imprimir progresso
function printProgress(current, total, cityName = '') {
  const percentage = Math.round((current / total) * 100);
  const barLength = 30;
  const filled = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
  
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const rate = current / elapsed || 0;
  const eta = current > 0 ? Math.round((total - current) / rate) : 0;
  
  process.stdout.write(`\r🏙️  [${bar}] ${percentage}% (${current}/${total}) | ⏱️  ${elapsed}s | ETA: ${eta}s | ${cityName.substring(0, 20)}`);
}

// Função para imprimir estatísticas finais
function printFinalStats() {
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const waitTime = Math.round(stats.timeWaiting / 1000);
  const processTime = Math.round(stats.timeProcessing / 1000);
  
  console.log('\n\n📊 ===== ESTATÍSTICAS FINAIS =====');
  console.log(`⏰ Tempo total: ${Math.floor(elapsed/60)}m ${elapsed%60}s`);
  console.log(`⌛ Tempo aguardando: ${Math.floor(waitTime/60)}m ${waitTime%60}s (${Math.round((waitTime/elapsed)*100)}%)`);
  console.log(`⚡ Tempo processando: ${Math.floor(processTime/60)}m ${processTime%60}s (${Math.round((processTime/elapsed)*100)}%)`);
  console.log(`🏙️  Total de cidades: ${stats.totalCities}`);
  console.log(`✅ Processadas: ${stats.processed}`);
  console.log(`🎯 Sucessos: ${stats.successful} (${Math.round((stats.successful/stats.processed)*100)}%)`);
  console.log(`❌ Falhas: ${stats.failed}`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Performance por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    const successRate = data.attempts > 0 ? Math.round((data.success/data.attempts)*100) : 0;
    const requestCount = APIS[provider].requestCount;
    console.log(`  ${provider.toUpperCase()}: ${data.success}/${data.attempts} (${successRate}%) | Requests: ${requestCount}`);
  });
  
  if (stats.successful > 0) {
    const avgTimePerSuccess = processTime / stats.successful;
    console.log(`\n⚡ Tempo médio por sucesso: ${Math.round(avgTimePerSuccess)}s`);
  }
  
  if (stats.downloadedFiles.length > 0) {
    const totalSize = stats.downloadedFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`💾 Total baixado: ${Math.round(totalSize/1024/1024)}MB`);
  }
  
  console.log('\n🔄 Estado da Rotação:');
  console.log(`  Próximo provedor: ${PROVIDER_ORDER[providerState.currentIndex]}`);
  console.log(`  Total de requests: ${providerState.totalRequests}`);
  
  console.log('\n=================================\n');
}

// Função principal
async function main() {
  try {
    console.log('🚀 ===== SCRIPT OTIMIZADO: TOP 200 CIDADES =====');
    console.log('🎯 Priorizando as 200 maiores cidades por população');
    console.log('⚡ Rotação inteligente de provedores com delays mínimos\n');
    
    // Debug: verificar variáveis de ambiente
    console.log('🔑 Verificando variáveis de ambiente...');
    console.log(`   Supabase URL: ${supabaseUrl ? '✅' : '❌'}`);
    console.log(`   Supabase Key: ${supabaseServiceKey ? '✅' : '❌'}`);
    console.log(`   Pexels Key: ${process.env.PEXELS_API_KEY ? '✅' : '❌'}`);
    console.log(`   Unsplash Key: ${process.env.UNSPLASH_ACCESS_KEY ? '✅' : '❌'}`);
    console.log(`   Pixabay Key: ${process.env.PIXABAY_API_KEY ? '✅' : '❌'}`);
    
    // Verificar conexão Supabase
    console.log('\n🔌 Verificando conexão com Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('cities')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Erro Supabase: ${testError.message}`);
    }
    console.log('✅ Supabase conectado');
    
    // Buscar TOP 200 cidades sem imagem, ordenadas por população
    console.log('🔍 Buscando TOP 200 cidades sem imagem...');
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, population')
      .is('imagem', null)
      .order('population', { ascending: false })
      .limit(200);
    
    if (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`);
    }
    
    if (!cities || cities.length === 0) {
      console.log('🎉 Todas as top 200 cidades já possuem imagens!');
      return;
    }
    
    console.log(`📋 ${cities.length} cidades encontradas para processar`);
    console.log(`🏆 Primeira cidade: ${cities[0].name}, ${cities[0].state} (${cities[0].population?.toLocaleString()} hab)`);
    console.log(`🥉 Última cidade: ${cities[cities.length-1].name}, ${cities[cities.length-1].state} (${cities[cities.length-1].population?.toLocaleString()} hab)\n`);
    
    stats.totalCities = cities.length;
    
    // Processar cada cidade
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      
      printProgress(i, cities.length, `${city.name}, ${city.state}`);
      
      try {
        await processCityOptimized(city);
        stats.processed++;
      } catch (error) {
        console.error(`\n💥 Erro fatal para ${city.name}: ${error.message}`);
        stats.failed++;
        stats.failedCities.push(city);
      }
      
      // Estatísticas a cada 25 cidades
      if ((i + 1) % 25 === 0) {
        console.log('\n');
        printFinalStats();
      }
    }
    
    console.log('\n');
    printFinalStats();
    console.log('🎉 Processamento das TOP 200 cidades concluído!');
    
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message);
    printFinalStats();
    process.exit(1);
  }
}

// Interceptar CTRL+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Processo interrompido pelo usuário');
  printFinalStats();
  process.exit(0);
});

// Executar
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processCityOptimized, APIS, PROVIDER_ORDER };
