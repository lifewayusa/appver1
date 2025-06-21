const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Garantir que fetch está disponível (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Este script requer Node.js 18+ ou a instalação do node-fetch');
  process.exit(1);
}

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

// Configuração das APIs com delays otimizados e tracking de uso
const APIS = {
  pexels: {
    key: process.env.PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': process.env.PEXELS_API_KEY },
    rateLimit: 200, // 200 requests por hora
    delay: 20000, // 20 segundos (conservador: 3600s/180 = 20s)
    lastUsed: 0
  },
  unsplash: {
    key: process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    rateLimit: 50, // 50 requests por hora
    delay: 75000, // 75 segundos (conservador: 3600s/48 = 75s)
    lastUsed: 0
  },
  pixabay: {
    key: process.env.PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api/',
    rateLimit: 100, // 100 requests por hora
    delay: 40000, // 40 segundos (conservador: 3600s/90 = 40s)
    lastUsed: 0
  }
};

// Ordem de rotação dos provedores
const PROVIDER_ORDER = ['pexels', 'unsplash', 'pixabay'];

// Estado global para rotação inteligente
let providerRotation = {
  currentIndex: 0,
  lastSuccessfulProvider: null,
  requestCounts: {
    pexels: 0,
    unsplash: 0,
    pixabay: 0
  }
};

// Estatísticas globais otimizadas
let stats = {
  startTime: new Date(),
  totalCities: 0,
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  byProvider: {
    pexels: { attempts: 0, success: 0, failed: 0 },
    unsplash: { attempts: 0, success: 0, failed: 0 },
    pixabay: { attempts: 0, success: 0, failed: 0 }
  },
  errors: [],
  downloadedFiles: [],
  failedCities: [],
  timeSpentWaiting: 0,
  actualProcessingTime: 0
};

// Função para salvar estado da rotação
async function saveRotationState() {
  const stateFile = path.join(__dirname, 'provider-rotation-state.json');
  try {
    await fs.writeFile(stateFile, JSON.stringify(providerRotation, null, 2));
  } catch (error) {
    console.error('⚠️  Erro ao salvar estado da rotação:', error.message);
  }
}

// Função para carregar estado da rotação
async function loadRotationState() {
  const stateFile = path.join(__dirname, 'provider-rotation-state.json');
  try {
    const data = await fs.readFile(stateFile, 'utf8');
    const savedState = JSON.parse(data);
    providerRotation = { ...providerRotation, ...savedState };
    console.log(`🔄 Estado da rotação carregado: começando com ${PROVIDER_ORDER[providerRotation.currentIndex]}`);
  } catch (error) {
    console.log('🆕 Iniciando nova sessão de rotação de provedores');
  }
}

// Função para obter próximo provedor na rotação
function getNextProvider() {
  const provider = PROVIDER_ORDER[providerRotation.currentIndex];
  
  // Avançar para o próximo provedor na sequência
  providerRotation.currentIndex = (providerRotation.currentIndex + 1) % PROVIDER_ORDER.length;
  
  return provider;
}

// Função inteligente para aguardar apenas se necessário
async function smartDelay(providerName) {
  const api = APIS[providerName];
  const now = Date.now();
  const timeSinceLastUse = now - api.lastUsed;
  
  if (timeSinceLastUse < api.delay) {
    const waitTime = api.delay - timeSinceLastUse;
    console.log(`⏳ Aguardando ${Math.round(waitTime/1000)}s para ${providerName}...`);
    
    const waitStart = Date.now();
    await new Promise(resolve => setTimeout(resolve, waitTime));
    stats.timeSpentWaiting += Date.now() - waitStart;
  }
  
  api.lastUsed = Date.now();
}

// Função otimizada para buscar imagem de uma cidade
async function fetchCityImageOptimized(city) {
  const processStart = Date.now();
  
  // Criar termo de busca otimizado
  const searchTerm = createSearchTerm(city.name, city.state);
  
  console.log(`\n🎯 Processando: ${city.name}, ${city.state} (ID: ${city.id})`);
  console.log(`🔍 Termo de busca: "${searchTerm}"`);
  
  // Tentar com cada provedor seguindo a rotação
  for (let attempt = 0; attempt < PROVIDER_ORDER.length; attempt++) {
    const providerName = getNextProvider();
    const api = APIS[providerName];
    
    if (!api.key) {
      console.log(`⚠️  ${providerName.toUpperCase()}: API key não configurada`);
      continue;
    }
    
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/3: ${providerName.toUpperCase()}`);
      
      // Aplicar delay inteligente apenas se necessário
      await smartDelay(providerName);
      
      // Fazer a requisição
      const imageUrl = await fetchFromProvider(providerName, api, searchTerm, city);
      
      if (imageUrl) {
        // Sucesso! Baixar e salvar a imagem
        const success = await downloadAndSaveImage(imageUrl, city, providerName);
        
        if (success) {
          stats.byProvider[providerName].success++;
          stats.successful++;
          providerRotation.lastSuccessfulProvider = providerName;
          providerRotation.requestCounts[providerName]++;
          
          const processingTime = Date.now() - processStart;
          stats.actualProcessingTime += processingTime;
          
          console.log(`✅ SUCESSO com ${providerName.toUpperCase()} (${Math.round(processingTime/1000)}s)`);
          await saveRotationState();
          return true;
        }
      }
    } catch (error) {
      console.log(`❌ ${providerName.toUpperCase()}: ${error.message}`);
      stats.byProvider[providerName].failed++;
    }
    
    stats.byProvider[providerName].attempts++;
  }
  
  // Se chegou aqui, todos os provedores falharam
  stats.failed++;
  stats.failedCities.push(city);
  console.log(`💥 FALHA TOTAL para ${city.name}, ${city.state}`);
  
  return false;
}

// Função para buscar de um provedor específico
async function fetchFromProvider(providerName, api, searchTerm, city) {
  let url;
  
  switch (providerName) {
    case 'pexels':
      url = `${api.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'unsplash':
      url = `${api.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'pixabay':
      url = `${api.baseUrl}?key=${api.key}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&category=places&per_page=3`;
      break;
  }
  
  const response = await fetch(url, {
    headers: api.headers,
    timeout: 10000
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Processar resposta baseado no provedor
  let imageUrl = null;
  
  switch (providerName) {
    case 'pexels':
      if (data.photos && data.photos.length > 0) {
        const photo = data.photos[0];
        imageUrl = photo.src.large || photo.src.medium || photo.src.original;
      }
      break;
    case 'unsplash':
      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        imageUrl = photo.urls.regular || photo.urls.full;
      }
      break;
    case 'pixabay':
      if (data.hits && data.hits.length > 0) {
        const photo = data.hits[0];
        imageUrl = photo.largeImageURL || photo.webformatURL;
      }
      break;
  }
  
  if (!imageUrl) {
    throw new Error('Nenhuma imagem encontrada');
  }
  
  console.log(`🖼️  Imagem encontrada: ${imageUrl.substring(0, 60)}...`);
  return imageUrl;
}

// Função para criar termo de busca otimizado
function createSearchTerm(cityName, stateName) {
  const cleanCity = cityName.replace(/[^\w\s]/g, '').trim();
  const cleanState = stateName.replace(/[^\w\s]/g, '').trim();
  
  // Usar termo mais específico para melhor relevância
  return `${cleanCity} ${cleanState} skyline cityscape`;
}

// Função para baixar e salvar imagem
async function downloadAndSaveImage(imageUrl, city, providerName) {
  try {
    const imageDir = path.join(process.cwd(), 'public', 'images', 'cities');
    await fs.mkdir(imageDir, { recursive: true });
    
    const filename = `${city.name.toLowerCase().replace(/[^\w]/g, '-')}-${city.state.toLowerCase().replace(/[^\w]/g, '-')}.jpg`;
    const filepath = path.join(imageDir, filename);
    
    // Verificar se arquivo já existe
    try {
      await fs.access(filepath);
      console.log(`⏭️  Arquivo já existe: ${filename}`);
      stats.skipped++;
      return true;
    } catch {
      // Arquivo não existe, continuar com download
    }
    
    // Baixar imagem
    const response = await fetch(imageUrl);
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

// Função para imprimir progresso otimizado
function printProgress(current, total, currentCity = '') {
  const percentage = Math.round((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const rate = current / elapsed || 0;
  const eta = current > 0 ? Math.round((total - current) / rate) : 0;
  
  const avgTimePerCity = current > 0 ? elapsed / current : 0;
  
  process.stdout.write(`\r🏙️  [${bar}] ${percentage}% (${current}/${total}) | ⏱️  ${elapsed}s | ETA: ${eta}s | Média: ${Math.round(avgTimePerCity)}s/cidade | ${currentCity}`);
}

// Função para imprimir estatísticas otimizadas
function printOptimizedStats() {
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  const waitingTime = Math.round(stats.timeSpentWaiting / 1000);
  const processingTime = Math.round(stats.actualProcessingTime / 1000);
  const efficiency = elapsed > 0 ? Math.round((processingTime / elapsed) * 100) : 0;
  
  console.log('\n\n📊 ===== ESTATÍSTICAS OTIMIZADAS =====');
  console.log(`⏰ Tempo total: ${minutes}m ${seconds}s`);
  console.log(`⌛ Tempo esperando: ${waitingTime}s (${Math.round((waitingTime/elapsed)*100)}%)`);
  console.log(`⚡ Tempo processando: ${processingTime}s (${efficiency}%)`);
  console.log(`🏙️  Total de cidades: ${stats.totalCities}`);
  console.log(`✅ Processadas: ${stats.processed}`);
  console.log(`🎯 Sucessos: ${stats.successful} (${Math.round((stats.successful/stats.processed)*100)}%)`);
  console.log(`❌ Falhas: ${stats.failed} (${Math.round((stats.failed/stats.processed)*100)}%)`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Performance por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    const successRate = data.attempts > 0 ? Math.round((data.success/data.attempts)*100) : 0;
    const requestCount = providerRotation.requestCounts[provider];
    console.log(`  ${provider.toUpperCase()}: ${data.success}/${data.attempts} (${successRate}%) | Requests: ${requestCount}`);
  });
  
  if (stats.successful > 0) {
    const avgTimePerSuccess = processingTime / stats.successful;
    console.log(`\n⚡ Tempo médio por sucesso: ${Math.round(avgTimePerSuccess)}s`);
  }
  
  if (stats.downloadedFiles.length > 0) {
    const totalSize = stats.downloadedFiles.reduce((sum, file) => sum + file.size, 0);
    const avgSize = totalSize / stats.downloadedFiles.length;
    console.log(`💾 Arquivos baixados: ${stats.downloadedFiles.length}`);
    console.log(`📏 Tamanho total: ${Math.round(totalSize/1024/1024)}MB | Médio: ${Math.round(avgSize/1024)}KB`);
  }
  
  console.log('\n🔄 Estado da Rotação:');
  console.log(`  Próximo provedor: ${PROVIDER_ORDER[providerRotation.currentIndex]}`);
  console.log(`  Último sucesso: ${providerRotation.lastSuccessfulProvider || 'nenhum'}`);
  
  console.log('\n=================================\n');
}

// Função principal otimizada
async function main() {
  try {
    console.log('🚀 ===== SCRIPT OTIMIZADO DE BUSCA DE IMAGENS =====');
    console.log('🎯 Funcionalidades:');
    console.log('   • Rotação inteligente de provedores');
    console.log('   • Delays apenas quando necessário');
    console.log('   • Estado persistente da rotação');
    console.log('   • Fallback automático entre APIs');
    console.log('   • Estatísticas detalhadas de performance\n');
    
    // Verificar conexão com Supabase
    console.log('🔌 Verificando conexão com Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('cities')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Erro de conexão Supabase: ${testError.message}`);
    }
    
    console.log('✅ Conexão com Supabase OK');
    
    // Carregar estado da rotação
    await loadRotationState();
    
    // Buscar cidades sem imagem
    console.log('🔍 Buscando cidades sem imagem...');
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state')
      .is('imagem', null)
      .order('population', { ascending: false }) // Começar pelas maiores
      .limit(100); // Processar em lotes de 100
    
    if (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`);
    }
    
    if (!cities || cities.length === 0) {
      console.log('🎉 Todas as cidades já possuem imagens!');
      return;
    }
    
    console.log(`📋 ${cities.length} cidades encontradas para processar`);
    stats.totalCities = cities.length;
    
    // Processar cada cidade com rotação otimizada
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      
      printProgress(i, cities.length, `${city.name}, ${city.state}`);
      
      try {
        await fetchCityImageOptimized(city);
        stats.processed++;
      } catch (error) {
        console.error(`\n💥 Erro fatal para ${city.name}: ${error.message}`);
        stats.failed++;
        stats.failedCities.push(city);
      }
      
      // Imprimir estatísticas a cada 10 cidades
      if ((i + 1) % 10 === 0) {
        console.log('\n');
        printOptimizedStats();
      }
    }
    
    console.log('\n');
    printOptimizedStats();
    
    // Salvar estado final
    await saveRotationState();
    
    console.log('🎉 Script concluído com sucesso!');
    
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message);
    process.exit(1);
  }
}

// Interceptar CTRL+C para salvar estado
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Interrompido pelo usuário...');
  await saveRotationState();
  printOptimizedStats();
  console.log('💾 Estado salvo. Execute novamente para continuar de onde parou.');
  process.exit(0);
});

// Executar script
if (require.main === module) {
  main();
}

module.exports = { fetchCityImageOptimized, printOptimizedStats, APIS, PROVIDER_ORDER };
