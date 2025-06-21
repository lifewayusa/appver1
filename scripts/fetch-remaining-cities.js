const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

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

// Configuração das APIs com rotação inteligente
const APIS = {
  pexels: {
    key: process.env.PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': `Bearer ${process.env.PEXELS_API_KEY}` },
    delay: 18000, // 18 segundos
    quota: 200, // por hora
    priority: 1
  },
  pixabay: {
    key: process.env.PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api/',
    delay: 36000, // 36 segundos
    quota: 100, // por hora
    priority: 2
  },
  unsplash: {
    key: process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    delay: 72000, // 72 segundos
    quota: 50, // por hora
    priority: 3
  }
};

// Estado do rate limiting
let apiState = {
  pexels: { lastUsed: 0, hourlyCount: 0 },
  pixabay: { lastUsed: 0, hourlyCount: 0 },
  unsplash: { lastUsed: 0, hourlyCount: 0 }
};

// Estatísticas globais
let stats = {
  startTime: new Date(),
  totalCities: 0,
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  byProvider: {
    pexels: { attempts: 0, success: 0, failed: 0 },
    pixabay: { attempts: 0, success: 0, failed: 0 },
    unsplash: { attempts: 0, success: 0, failed: 0 }
  }
};

// Função para verificar se API pode ser usada
function canUseAPI(provider) {
  const now = Date.now();
  const api = apiState[provider];
  
  // Reset contador a cada hora
  if (now - api.lastUsed > 3600000) { // 1 hora
    api.hourlyCount = 0;
  }
  
  return api.hourlyCount < APIS[provider].quota;
}

// Função para escolher melhor API disponível
function selectBestAPI() {
  const availableAPIs = Object.keys(APIS)
    .filter(provider => APIS[provider].key && canUseAPI(provider))
    .sort((a, b) => APIS[a].priority - APIS[b].priority);
  
  return availableAPIs[0] || null;
}

// Função para delay respeitando rate limits
async function respectRateLimit(provider) {
  const api = apiState[provider];
  const now = Date.now();
  const timeSinceLastUse = now - api.lastUsed;
  const requiredDelay = APIS[provider].delay;
  
  if (timeSinceLastUse < requiredDelay) {
    const waitTime = requiredDelay - timeSinceLastUse;
    console.log(`⏱️  Aguardando ${Math.round(waitTime/1000)}s (${provider} rate limit)...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  api.lastUsed = Date.now();
  api.hourlyCount++;
}

// Funções de busca para cada API (mesmas do script anterior)
async function searchPexels(cityName, stateName) {
  const query = `${cityName} ${stateName} cityscape`;
  const url = `${APIS.pexels.baseUrl}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  
  try {
    const response = await fetch(url, { headers: APIS.pexels.headers });
    if (!response.ok) throw new Error(`Pexels API error: ${response.status}`);
    
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return {
        url: data.photos[0].src.large,
        provider: 'pexels',
        alt: data.photos[0].alt || `${cityName}, ${stateName}`,
        id: data.photos[0].id
      };
    }
    return null;
  } catch (error) {
    console.error(`❌ Erro Pexels para ${cityName}:`, error.message);
    return null;
  }
}

async function searchPixabay(cityName, stateName) {
  const query = `${cityName} ${stateName} city`;
  const url = `${APIS.pixabay.baseUrl}?key=${APIS.pixabay.key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&category=places&per_page=3`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Pixabay API error: ${response.status}`);
    
    const data = await response.json();
    if (data.hits && data.hits.length > 0) {
      return {
        url: data.hits[0].largeImageURL,
        provider: 'pixabay',
        alt: data.hits[0].tags || `${cityName}, ${stateName}`,
        id: data.hits[0].id
      };
    }
    return null;
  } catch (error) {
    console.error(`❌ Erro Pixabay para ${cityName}:`, error.message);
    return null;
  }
}

async function searchUnsplash(cityName, stateName) {
  const query = `${cityName} ${stateName} cityscape`;
  const url = `${APIS.unsplash.baseUrl}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  
  try {
    const response = await fetch(url, { headers: APIS.unsplash.headers });
    if (!response.ok) throw new Error(`Unsplash API error: ${response.status}`);
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        url: data.results[0].urls.regular,
        provider: 'unsplash',
        alt: data.results[0].alt_description || `${cityName}, ${stateName}`,
        id: data.results[0].id
      };
    }
    return null;
  } catch (error) {
    console.error(`❌ Erro Unsplash para ${cityName}:`, error.message);
    return null;
  }
}

// Função para baixar imagem
async function downloadImage(imageData, cityId) {
  return new Promise((resolve, reject) => {
    const fileName = `${cityId}_${imageData.provider}.jpg`;
    const filePath = path.join(process.cwd(), 'public', 'images', 'cities', fileName);
    
    const file = require('fs').createWriteStream(filePath);
    
    https.get(imageData.url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({
          path: `/images/cities/${fileName}`,
          size: response.headers['content-length'],
          provider: imageData.provider
        });
      });
      file.on('error', (err) => {
        require('fs').unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Função principal para processar uma cidade
async function processCity(city, index, total) {
  const cityLabel = `[${index + 1}/${total}] ${city.name}, ${city.state}`;
  console.log(`\n🏙️  Processando: ${cityLabel}`);
  
  stats.processed++;
  
  // Verificar se já tem imagem
  if (city.imagem && city.imagem.includes('/images/cities/')) {
    console.log(`✅ ${cityLabel}: Já possui imagem`);
    stats.skipped++;
    return true;
  }
  
  // Selecionar melhor API disponível
  const provider = selectBestAPI();
  
  if (!provider) {
    console.log(`⚠️  ${cityLabel}: Todas as APIs esgotaram quota, aguardando...`);
    // Aguardar 1 hora para reset das quotas
    await new Promise(resolve => setTimeout(resolve, 3600000));
    return await processCity(city, index, total); // Tentar novamente
  }
  
  stats.byProvider[provider].attempts++;
  
  try {
    await respectRateLimit(provider);
    
    console.log(`🔍 Buscando via ${provider.toUpperCase()} (quota: ${apiState[provider].hourlyCount}/${APIS[provider].quota})...`);
    
    let imageData = null;
    switch (provider) {
      case 'pexels':
        imageData = await searchPexels(city.name, city.state);
        break;
      case 'pixabay':
        imageData = await searchPixabay(city.name, city.state);
        break;
      case 'unsplash':
        imageData = await searchUnsplash(city.name, city.state);
        break;
    }
    
    if (!imageData) {
      console.log(`❌ ${cityLabel}: Nenhuma imagem encontrada via ${provider}`);
      stats.byProvider[provider].failed++;
      stats.failed++;
      return false;
    }
    
    console.log(`📥 Baixando imagem...`);
    const downloadResult = await downloadImage(imageData, city.id);
    
    // Atualizar banco de dados
    const { error: updateError } = await supabase
      .from('cities')
      .update({ imagem: downloadResult.path })
      .eq('id', city.id);
    
    if (updateError) {
      console.error(`❌ ${cityLabel}: Erro ao atualizar banco:`, updateError);
      stats.failed++;
      return false;
    }
    
    console.log(`✅ ${cityLabel}: Sucesso! (${provider})`);
    stats.byProvider[provider].success++;
    stats.successful++;
    return true;
    
  } catch (error) {
    console.error(`❌ ${cityLabel}: Erro:`, error.message);
    stats.byProvider[provider].failed++;
    stats.failed++;
    return false;
  }
}

// Função para imprimir estatísticas finais
function printFinalStats() {
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  
  console.log('\n\n📊 ===== RELATÓRIO FINAL - CIDADES RESTANTES =====');
  console.log(`⏰ Tempo total: ${hours}h ${minutes}m ${seconds}s`);
  console.log(`🏙️  Total de cidades: ${stats.totalCities}`);
  console.log(`✅ Processadas: ${stats.processed}`);
  console.log(`🎯 Sucessos: ${stats.successful} (${Math.round((stats.successful/stats.processed)*100)}%)`);
  console.log(`❌ Falhas: ${stats.failed} (${Math.round((stats.failed/stats.processed)*100)}%)`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Performance por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    if (data.attempts > 0) {
      const successRate = Math.round((data.success/data.attempts)*100);
      console.log(`  ${provider.toUpperCase()}: ${data.success}/${data.attempts} (${successRate}%)`);
    }
  });
  
  const rate = stats.processed / (elapsed / 3600);
  console.log(`\n⚡ Taxa de processamento: ${rate.toFixed(2)} cidades/hora`);
  console.log('================================================\n');
}

// Função principal
async function main() {
  console.log('🚀 Iniciando captura de imagens - CIDADES RESTANTES...');
  console.log('======================================================');
  console.log('📋 Usando rotação inteligente entre todas as APIs');
  console.log('⏱️  Estimativa: ~48-72 horas (depende das quotas)');
  console.log('');
  
  // Verificar APIs configuradas
  const configuredAPIs = Object.keys(APIS).filter(provider => APIS[provider].key);
  console.log(`🔑 APIs configuradas: ${configuredAPIs.map(api => api.toUpperCase()).join(', ')}`);
  
  if (configuredAPIs.length === 0) {
    console.error('❌ Nenhuma API configurada no .env.local');
    process.exit(1);
  }
  
  try {
    // Buscar cidades que não são as 200 maiores e não têm imagem
    console.log('📡 Buscando cidades restantes (excluindo top 200)...');
    
    // Primeiro, pegar IDs das 200 maiores
    const { data: top200, error: topError } = await supabase
      .from('cities')
      .select('id')
      .not('population', 'is', null)
      .order('population', { ascending: false })
      .limit(200);
    
    if (topError) {
      console.error('❌ Erro ao buscar top 200:', topError);
      return;
    }
    
    const top200Ids = top200.map(city => city.id);
    
    // Buscar cidades restantes sem imagem
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('id, name, state, imagem')
      .not('id', 'in', `(${top200Ids.map(id => `'${id}'`).join(',')})`)
      .or('imagem.is.null,imagem.eq.')
      .order('name');
    
    if (fetchError) {
      console.error('❌ Erro ao buscar cidades:', fetchError);
      return;
    }
    
    stats.totalCities = cities.length;
    console.log(`📊 Encontradas ${cities.length} cidades restantes sem imagem`);
    console.log('🎯 Iniciando processamento com rotação de APIs...\n');
    
    // Processar cada cidade
    for (let i = 0; i < cities.length; i++) {
      await processCity(cities[i], i, cities.length);
      
      // Log de progresso a cada 50 cidades
      if ((i + 1) % 50 === 0) {
        const percentage = Math.round(((i + 1) / cities.length) * 100);
        console.log(`\n📊 Progresso: ${percentage}% (${i + 1}/${cities.length})`);
        console.log(`📈 Sucessos: ${stats.successful}/${stats.processed}`);
        
        // Mostrar status das APIs
        console.log('🔑 Status das APIs:');
        Object.entries(apiState).forEach(([provider, state]) => {
          if (APIS[provider].key) {
            console.log(`  ${provider.toUpperCase()}: ${state.hourlyCount}/${APIS[provider].quota} (${canUseAPI(provider) ? '✅' : '❌'})`);
          }
        });
      }
    }
    
    printFinalStats();
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
    printFinalStats();
    process.exit(1);
  }
}

console.log('✅ Configurações verificadas. Iniciando em 5 segundos...');
setTimeout(main, 5000);
