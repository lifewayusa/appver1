// Script para buscar imagens das 200 maiores cidades dos EUA
// Com rotação de provedores, controle de execução e estatísticas completas

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
    headers: { 'Authorization': process.env.PEXELS_API_KEY },
    delay: 20000, // 20 segundos entre requests
    lastUsed: 0
  },
  unsplash: {
    name: 'Unsplash',
    key: process.env.UNSPLASH_ACCESS_KEY,
    url: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    delay: 75000, // 75 segundos entre requests
    lastUsed: 0
  },
  pixabay: {
    name: 'Pixabay',
    key: process.env.PIXABAY_API_KEY,
    url: 'https://pixabay.com/api/',
    delay: 40000, // 40 segundos entre requests
    lastUsed: 0
  }
};

// Ordem de rotação dos provedores (do mais rápido para o mais lento)
const PROVIDER_ORDER = ['pexels', 'pixabay', 'unsplash'];

// Estado global de controle
let executionState = {
  isRunning: false,
  isPaused: false,
  currentCityIndex: 0,
  currentProvider: 0,
  startTime: null,
  pauseTime: null,
  totalPauseTime: 0
};

// Estatísticas detalhadas
let stats = {
  totalCities: 0,
  processed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  byProvider: {
    pexels: { attempts: 0, success: 0, errors: 0 },
    pixabay: { attempts: 0, success: 0, errors: 0 },
    unsplash: { attempts: 0, success: 0, errors: 0 }
  },
  timeWaiting: 0,
  timeProcessing: 0,
  downloadedFiles: [],
  failedCities: [],
  errors: []
};

// Função para salvar estado de execução
async function saveExecutionState() {
  const stateFile = path.join(__dirname, 'execution-state.json');
  const state = {
    executionState,
    stats,
    timestamp: new Date().toISOString()
  };
  
  try {
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
    console.log('💾 Estado salvo');
  } catch (error) {
    console.error('⚠️  Erro ao salvar estado:', error.message);
  }
}

// Função para carregar estado de execução
async function loadExecutionState() {
  const stateFile = path.join(__dirname, 'execution-state.json');
  
  try {
    const data = await fs.readFile(stateFile, 'utf8');
    const state = JSON.parse(data);
    
    Object.assign(executionState, state.executionState);
    Object.assign(stats, state.stats);
    
    console.log(`🔄 Estado carregado: ${state.timestamp}`);
    console.log(`📊 Progresso: ${executionState.currentCityIndex}/${stats.totalCities}`);
    return true;
  } catch (error) {
    console.log('🆕 Iniciando nova execução');
    return false;
  }
}

// Função para aguardar com controle de pausa
async function smartWait(providerName, duration) {
  const provider = PROVIDERS[providerName];
  const now = Date.now();
  const timeSinceLastUse = now - provider.lastUsed;
  
  let waitTime = 0;
  if (timeSinceLastUse < provider.delay) {
    waitTime = provider.delay - timeSinceLastUse;
  }
  
  if (waitTime > 0) {
    console.log(`⏳ Aguardando ${Math.round(waitTime/1000)}s para ${provider.name}...`);
    
    const waitStart = Date.now();
    
    // Aguardar com verificação de pausa a cada segundo
    while (waitTime > 0 && !executionState.isPaused) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      waitTime -= 1000;
      
      // Atualizar progresso de espera
      if (waitTime > 0) {
        process.stdout.write(`\r⏳ Aguardando ${Math.round(waitTime/1000)}s para ${provider.name}...`);
      }
    }
    
    stats.timeWaiting += Date.now() - waitStart;
    console.log(''); // Nova linha
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
  switch (providerName) {
    case 'pexels':
      url = `${provider.url}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'unsplash':
      url = `${provider.url}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape`;
      break;
    case 'pixabay':
      url = `${provider.url}?key=${provider.key}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&per_page=3&category=places`;
      break;
  }
  
  const response = await fetch(url, {
    headers: provider.headers || {},
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
      filename,
      size: buffer.length,
      provider: providerName,
      city: `${city.name}, ${city.state}`
    });
    
    console.log(`✅ Salvo: ${filename} (${Math.round(buffer.length/1024)}KB)`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao baixar/salvar: ${error.message}`);
    return false;
  }
}

// Função para processar uma cidade
async function processCity(city) {
  if (executionState.isPaused) {
    console.log('⏸️  Execução pausada');
    return false;
  }
  
  const startTime = Date.now();
  const searchTerm = `${city.name} ${city.state} skyline cityscape`;
  
  console.log(`\n🎯 [${executionState.currentCityIndex + 1}/${stats.totalCities}] ${city.name}, ${city.state}`);
  console.log(`🔍 Busca: "${searchTerm}"`);
  console.log(`👥 População: ${city.population?.toLocaleString() || 'N/A'}`);
  
  // Tentar com cada provedor em rotação
  for (let attempt = 0; attempt < PROVIDER_ORDER.length; attempt++) {
    if (executionState.isPaused) break;
    
    const providerName = PROVIDER_ORDER[executionState.currentProvider];
    executionState.currentProvider = (executionState.currentProvider + 1) % PROVIDER_ORDER.length;
    
    try {
      console.log(`🔄 Tentativa ${attempt + 1}/3: ${PROVIDERS[providerName].name}`);
      
      // Aguardar se necessário
      await smartWait(providerName);
      
      if (executionState.isPaused) break;
      
      // Buscar imagem
      const imageUrl = await fetchFromProvider(providerName, searchTerm);
      console.log(`🖼️  Imagem encontrada`);
      
      // Baixar e salvar
      const success = await downloadAndSave(imageUrl, city, providerName);
      
      if (success) {
        stats.byProvider[providerName].success++;
        stats.successful++;
        
        const processingTime = Date.now() - startTime;
        stats.timeProcessing += processingTime;
        
        console.log(`✅ SUCESSO com ${PROVIDERS[providerName].name} (${Math.round(processingTime/1000)}s)`);
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
    
    stats.byProvider[providerName].attempts++;
  }
  
  // Todos falharam
  stats.failed++;
  stats.failedCities.push(city);
  console.log(`💥 FALHA TOTAL para ${city.name}, ${city.state}`);
  return false;
}

// Função para imprimir estatísticas
function printStats() {
  const elapsed = executionState.startTime ? 
    Math.round((Date.now() - executionState.startTime - executionState.totalPauseTime) / 1000) : 0;
  
  const waitTime = Math.round(stats.timeWaiting / 1000);
  const processTime = Math.round(stats.timeProcessing / 1000);
  
  console.log('\n📊 ===== ESTATÍSTICAS ATUAIS =====');
  console.log(`⏰ Tempo decorrido: ${Math.floor(elapsed/60)}m ${elapsed%60}s`);
  console.log(`⌛ Tempo aguardando: ${Math.floor(waitTime/60)}m ${waitTime%60}s`);
  console.log(`⚡ Tempo processando: ${Math.floor(processTime/60)}m ${processTime%60}s`);
  console.log(`🏙️  Progresso: ${executionState.currentCityIndex}/${stats.totalCities} (${Math.round((executionState.currentCityIndex/stats.totalCities)*100)}%)`);
  console.log(`✅ Sucessos: ${stats.successful}`);
  console.log(`❌ Falhas: ${stats.failed}`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    const successRate = data.attempts > 0 ? Math.round((data.success/data.attempts)*100) : 0;
    console.log(`  ${PROVIDERS[provider].name}: ${data.success}/${data.attempts} (${successRate}%)`);
  });
  
  if (stats.downloadedFiles.length > 0) {
    const totalSize = stats.downloadedFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`💾 Arquivos baixados: ${stats.downloadedFiles.length} (${Math.round(totalSize/1024/1024)}MB)`);
  }
  
  console.log('\n=================================\n');
}

// Função principal
async function main() {
  try {
    console.log('🚀 ===== SCRIPT TOP 200 CIDADES =====');
    console.log('📋 Funcionalidades:');
    console.log('   • Busca nas 200 maiores cidades por população');
    console.log('   • Rotação automática entre provedores');
    console.log('   • Controle de execução (pause/resume)');
    console.log('   • Estatísticas em tempo real');
    console.log('   • Estado persistente');
    console.log('   • Nome de arquivo: ID_nomedacidade\n');
    
    // Verificar se deve carregar estado anterior
    const stateLoaded = await loadExecutionState();
    
    if (!stateLoaded || executionState.currentCityIndex === 0) {
      // Buscar cidades do banco
      console.log('🔍 Buscando TOP 200 cidades...');
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
        console.log('🎉 Todas as TOP 200 cidades já possuem imagens!');
        return;
      }
      
      stats.totalCities = cities.length;
      global.cities = cities; // Armazenar globalmente
      
      console.log(`📋 ${cities.length} cidades encontradas`);
      console.log(`🏆 Maior: ${cities[0].name}, ${cities[0].state} (${cities[0].population?.toLocaleString()})`);
      console.log(`🥉 Menor: ${cities[cities.length-1].name}, ${cities[cities.length-1].state} (${cities[cities.length-1].population?.toLocaleString()})`);
    }
    
    // Configurar controles de execução
    executionState.isRunning = true;
    if (!executionState.startTime) {
      executionState.startTime = Date.now();
    }
    
    console.log('\n🎮 CONTROLES DE EXECUÇÃO:');
    console.log('   • Ctrl+C: Pausar execução');
    console.log('   • Digite "resume" para continuar');
    console.log('   • Digite "stats" para ver estatísticas');
    console.log('   • Digite "stop" para parar\n');
    
    // Processar cidades
    const cities = global.cities;
    for (let i = executionState.currentCityIndex; i < cities.length; i++) {
      if (!executionState.isRunning) break;
      
      executionState.currentCityIndex = i;
      
      await processCity(cities[i]);
      stats.processed++;
      
      // Salvar estado a cada 5 cidades
      if ((i + 1) % 5 === 0) {
        await saveExecutionState();
        printStats();
      }
      
      // Verificar se foi pausado
      while (executionState.isPaused && executionState.isRunning) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    executionState.isRunning = false;
    await saveExecutionState();
    
    console.log('\n🎉 EXECUÇÃO CONCLUÍDA!');
    printStats();
    
  } catch (error) {
    console.error('\n💥 Erro fatal:', error.message);
    executionState.isRunning = false;
    await saveExecutionState();
    printStats();
    process.exit(1);
  }
}

// Controles de execução
process.on('SIGINT', async () => {
  if (executionState.isRunning) {
    console.log('\n\n⏸️  EXECUÇÃO PAUSADA');
    executionState.isPaused = true;
    executionState.pauseTime = Date.now();
    await saveExecutionState();
    printStats();
    
    console.log('💡 Digite "resume" para continuar ou "stop" para parar');
  } else {
    process.exit(0);
  }
});

// Interface de comandos
if (require.main === module) {
  console.log('▶️  Execute com: node scripts/fetch-top-200-cities-final.js');
  console.log('📊 Para ver apenas estatísticas: node scripts/fetch-top-200-cities-final.js stats');
  
  const command = process.argv[2];
  
  if (command === 'stats') {
    loadExecutionState().then(() => {
      printStats();
    });
  } else {
    main().catch(console.error);
  }
}

module.exports = { main, printStats, loadExecutionState, saveExecutionState };
