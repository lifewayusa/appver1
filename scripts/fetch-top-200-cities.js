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

// Configuração das APIs seguindo EXATAMENTE os guidelines
const APIS = {
  pexels: {
    key: process.env.PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': `Bearer ${process.env.PEXELS_API_KEY}` },
    rateLimit: 200, // requests por hora
    delay: 18000, // 18 segundos (200/hora = 3.33/min)
    priority: 1
  },
  pixabay: {
    key: process.env.PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api/',
    rateLimit: 100, // requests por hora  
    delay: 36000, // 36 segundos (100/hora = 1.67/min)
    priority: 2
  },
  unsplash: {
    key: process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    rateLimit: 50, // requests por hora
    delay: 72000, // 72 segundos (50/hora = 0.83/min)
    priority: 3
  }
};

// Estatísticas globais
let stats = {
  startTime: new Date(),
  totalCities: 0,
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  currentProvider: 'pexels',
  byProvider: {
    pexels: { attempts: 0, success: 0, failed: 0 },
    pixabay: { attempts: 0, success: 0, failed: 0 },
    unsplash: { attempts: 0, success: 0, failed: 0 }
  }
};

// Função para delay respeitando rate limits
async function respectRateLimit(provider) {
  const delay = APIS[provider].delay;
  console.log(`⏱️  Aguardando ${delay/1000}s (${provider} rate limit)...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Função para buscar imagem via Pexels
async function searchPexels(cityName, stateName) {
  const query = `${cityName} ${stateName} cityscape`;
  const url = `${APIS.pexels.baseUrl}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  
  try {
    const response = await fetch(url, { headers: APIS.pexels.headers });
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
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

// Função para buscar imagem via Pixabay
async function searchPixabay(cityName, stateName) {
  const query = `${cityName} ${stateName} city`;
  const url = `${APIS.pixabay.baseUrl}?key=${APIS.pixabay.key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&category=places&per_page=3`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }
    
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

// Função para buscar imagem via Unsplash
async function searchUnsplash(cityName, stateName) {
  const query = `${cityName} ${stateName} cityscape`;
  const url = `${APIS.unsplash.baseUrl}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  
  try {
    const response = await fetch(url, { headers: APIS.unsplash.headers });
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
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
    }).on('error', (err) => {
      reject(err);
    });
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
  
  // Usar apenas Pexels para as 200 maiores (mais rápido e confiável)
  const provider = 'pexels';
  stats.byProvider[provider].attempts++;
  
  try {
    await respectRateLimit(provider);
    
    console.log(`🔍 Buscando imagem via ${provider.toUpperCase()}...`);
    let imageData = null;
    
    if (provider === 'pexels') {
      imageData = await searchPexels(city.name, city.state);
    }
    
    if (!imageData) {
      console.log(`❌ ${cityLabel}: Nenhuma imagem encontrada`);
      stats.byProvider[provider].failed++;
      stats.failed++;
      return false;
    }
    
    console.log(`📥 Baixando imagem de ${provider}...`);
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
    
    console.log(`✅ ${cityLabel}: Sucesso! (${downloadResult.provider})`);
    stats.byProvider[provider].success++;
    stats.successful++;
    return true;
    
  } catch (error) {
    console.error(`❌ ${cityLabel}: Erro no processamento:`, error.message);
    stats.byProvider[provider].failed++;
    stats.failed++;
    return false;
  }
}

// Função para imprimir estatísticas finais
function printFinalStats() {
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  console.log('\n\n📊 ===== RELATÓRIO FINAL - 200 MAIORES CIDADES =====');
  console.log(`⏰ Tempo total: ${minutes}m ${seconds}s`);
  console.log(`🏙️  Total de cidades: ${stats.totalCities}`);
  console.log(`✅ Processadas: ${stats.processed}`);
  console.log(`🎯 Sucessos: ${stats.successful} (${Math.round((stats.successful/stats.processed)*100)}%)`);
  console.log(`❌ Falhas: ${stats.failed} (${Math.round((stats.failed/stats.processed)*100)}%)`);
  console.log(`⏭️  Puladas (já tinham imagem): ${stats.skipped}`);
  
  console.log('\n📈 Performance por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    if (data.attempts > 0) {
      const successRate = Math.round((data.success/data.attempts)*100);
      console.log(`  ${provider.toUpperCase()}: ${data.success}/${data.attempts} (${successRate}%)`);
    }
  });
  
  const rate = stats.processed / (elapsed / 60);
  console.log(`\n⚡ Taxa de processamento: ${rate.toFixed(2)} cidades/minuto`);
  console.log('=================================================\n');
}

// Função principal
async function main() {
  console.log('🚀 Iniciando captura de imagens - 200 MAIORES CIDADES...');
  console.log('=========================================================');
  console.log('📋 Usando apenas Pexels API (mais rápido e confiável)');
  console.log('⏱️  Estimativa: ~60 minutos (18s por cidade)');
  console.log('');
  
  try {
    // Buscar as 200 maiores cidades (por população)
    console.log('📡 Buscando 200 maiores cidades...');
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('id, name, state, imagem, population')
      .not('population', 'is', null)
      .order('population', { ascending: false })
      .limit(200);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar cidades:', fetchError);
      return;
    }
    
    stats.totalCities = cities.length;
    console.log(`📊 Encontradas ${cities.length} cidades maiores por população`);
    console.log('🎯 Iniciando processamento sequencial...\n');
    
    // Processar cada cidade sequencialmente
    for (let i = 0; i < cities.length; i++) {
      await processCity(cities[i], i, cities.length);
      
      // Log de progresso a cada 10 cidades
      if ((i + 1) % 10 === 0) {
        const percentage = Math.round(((i + 1) / cities.length) * 100);
        console.log(`\n📊 Progresso: ${percentage}% (${i + 1}/${cities.length})`);
        console.log(`📈 Sucessos até agora: ${stats.successful}/${stats.processed}`);
      }
    }
    
    printFinalStats();
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
    printFinalStats();
    process.exit(1);
  }
}

// Verificar se APIs estão configuradas
if (!APIS.pexels.key) {
  console.error('❌ PEXELS_API_KEY não configurada no .env.local');
  process.exit(1);
}

console.log('✅ Configurações verificadas. Iniciando em 3 segundos...');
setTimeout(main, 3000);
