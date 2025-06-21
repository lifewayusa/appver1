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

// Configuração das APIs - LIMITES REAIS DOS PROVEDORES
const APIS = {
  pexels: {
    key: process.env.PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1/search',
    headers: { 'Authorization': `Bearer ${process.env.PEXELS_API_KEY}` },
    rateLimit: 200, // 200 requests por hora (GRÁTIS)
    delay: 1000, // 1 segundo entre requests (3600s/200 = 18s, mas usando 1s para ser conservador)
    requestsPerMinute: 50 // Limite por minuto
  },
  unsplash: {
    key: process.env.UNSPLASH_ACCESS_KEY,
    baseUrl: 'https://api.unsplash.com/search/photos',
    headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    rateLimit: 50, // 50 requests por hora (DEMO)
    delay: 2000, // 2 segundos entre requests
    requestsPerMinute: 25 // Limite por minuto
  },
  pixabay: {
    key: process.env.PIXABAY_API_KEY,
    baseUrl: 'https://pixabay.com/api/',
    rateLimit: 100, // 100 requests por hora (GRÁTIS)
    delay: 1500, // 1.5 segundos entre requests
    requestsPerMinute: 35 // Limite por minuto
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
  byProvider: {
    pexels: { attempts: 0, success: 0, failed: 0 },
    unsplash: { attempts: 0, success: 0, failed: 0 },
    pixabay: { attempts: 0, success: 0, failed: 0 }
  },
  errors: [],
  downloadedFiles: [],
  failedCities: []
};

// Função para imprimir barra de progresso
function printProgress(current, total, provider = '') {
  const percentage = Math.round((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const rate = current / elapsed || 0;
  const eta = current > 0 ? Math.round((total - current) / rate) : 0;
  
  process.stdout.write(`\r🏙️  [${bar}] ${percentage}% (${current}/${total}) | ⏱️  ${elapsed}s | ETA: ${eta}s | ${provider}`);
}

// Função para imprimir estatísticas detalhadas
function printDetailedStats() {
  const elapsed = Math.round((new Date() - stats.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  
  console.log('\n\n📊 ===== ESTATÍSTICAS DETALHADAS =====');
  console.log(`⏰ Tempo total: ${minutes}m ${seconds}s`);
  console.log(`🏙️  Total de cidades: ${stats.totalCities}`);
  console.log(`✅ Processadas: ${stats.processed}`);
  console.log(`🎯 Sucessos: ${stats.successful} (${Math.round((stats.successful/stats.processed)*100)}%)`);
  console.log(`❌ Falhas: ${stats.failed} (${Math.round((stats.failed/stats.processed)*100)}%)`);
  console.log(`⏭️  Puladas: ${stats.skipped}`);
  
  console.log('\n📈 Performance por Provedor:');
  Object.entries(stats.byProvider).forEach(([provider, data]) => {
    const successRate = data.attempts > 0 ? Math.round((data.success/data.attempts)*100) : 0;
    console.log(`  ${provider.toUpperCase()}: ${data.success}/${data.attempts} (${successRate}%)`);
  });
  
  if (stats.downloadedFiles.length > 0) {
    console.log(`\n💾 Arquivos baixados: ${stats.downloadedFiles.length}`);
    const avgSize = stats.downloadedFiles.reduce((sum, file) => sum + file.size, 0) / stats.downloadedFiles.length;
    console.log(`📏 Tamanho médio: ${Math.round(avgSize/1024)}KB`);
  }
  
  if (stats.failedCities.length > 0) {
    console.log(`\n❌ Cidades que falharam (${stats.failedCities.length}):`);
    stats.failedCities.slice(0, 10).forEach(city => {
      console.log(`  • ${city.name}, ${city.state} (ID: ${city.id})`);
    });
    if (stats.failedCities.length > 10) {
      console.log(`  ... e mais ${stats.failedCities.length - 10} cidades`);
    }
  }
  
  console.log('\n=================================\n');
}

// Função para criar termo de busca otimizado
function createSearchTerm(cityName, stateName) {
  // Limpar nomes de caracteres especiais
  const cleanCity = cityName.replace(/[^\w\s]/g, '').trim();
  const cleanState = stateName.replace(/[^\w\s]/g, '').trim();
  
  // Estratégias múltiplas para garantir relevância
  const strategies = [
    `"City of ${cleanCity}" ${cleanState} skyline`,
    `${cleanCity} ${cleanState} downtown aerial`,
    `${cleanCity} ${cleanState} cityscape`,
    `${cleanCity} ${cleanState} urban landscape`,
    `${cleanCity} ${cleanState} city view`
  ];
  
  return strategies[0]; // Usar a primeira estratégia mais específica
}

// Função para validar se a imagem é relevante (básico)
function isRelevantImage(imageData, cityName) {
  const description = (imageData.alt || imageData.description || '').toLowerCase();
  const tags = (imageData.tags || []).join(' ').toLowerCase();
  const searchText = `${description} ${tags}`;
  
  // Palavras que indicam relevância para cidade
  const relevantKeywords = ['city', 'urban', 'skyline', 'downtown', 'building', 'architecture', 'street'];
  const irrelevantKeywords = ['person', 'people', 'face', 'portrait', 'animal', 'cat', 'dog', 'food'];
  
  const hasRelevant = relevantKeywords.some(keyword => searchText.includes(keyword));
  const hasIrrelevant = irrelevantKeywords.some(keyword => searchText.includes(keyword));
  
  return hasRelevant && !hasIrrelevant;
}

// Função para buscar imagem no Pexels
async function searchPexels(searchTerm) {
  if (!APIS.pexels.key) return null;
  
  stats.byProvider.pexels.attempts++;
  
  try {
    const url = `${APIS.pexels.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=5&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: APIS.pexels.headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Procurar a melhor imagem (maior resolução)
      const bestPhoto = data.photos
        .filter(photo => photo.width >= 1920 && photo.height >= 1080)
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      
      if (bestPhoto) {
        stats.byProvider.pexels.success++;
        return {
          url: bestPhoto.src.large2x || bestPhoto.src.large,
          provider: 'pexels',
          width: bestPhoto.width,
          height: bestPhoto.height,
          alt: bestPhoto.alt || ''
        };
      }
    }
    
    return null;
  } catch (error) {
    stats.byProvider.pexels.failed++;
    stats.errors.push(`Pexels: ${error.message}`);
    return null;
  }
}

// Função para buscar imagem no Unsplash
async function searchUnsplash(searchTerm) {
  if (!APIS.unsplash.key) return null;
  
  stats.byProvider.unsplash.attempts++;
  
  try {
    const url = `${APIS.unsplash.baseUrl}?query=${encodeURIComponent(searchTerm)}&per_page=5&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: APIS.unsplash.headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Procurar a melhor imagem
      const bestPhoto = data.results
        .filter(photo => photo.width >= 1920 && photo.height >= 1080)
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
      
      if (bestPhoto) {
        stats.byProvider.unsplash.success++;
        return {
          url: bestPhoto.urls.full,
          provider: 'unsplash',
          width: bestPhoto.width,
          height: bestPhoto.height,
          alt: bestPhoto.alt_description || ''
        };
      }
    }
    
    return null;
  } catch (error) {
    stats.byProvider.unsplash.failed++;
    stats.errors.push(`Unsplash: ${error.message}`);
    return null;
  }
}

// Função para buscar imagem no Pixabay
async function searchPixabay(searchTerm) {
  if (!APIS.pixabay.key) return null;
  
  stats.byProvider.pixabay.attempts++;
  
  try {
    const url = `${APIS.pixabay.baseUrl}?key=${APIS.pixabay.key}&q=${encodeURIComponent(searchTerm)}&image_type=photo&orientation=horizontal&category=places&min_width=1920&min_height=1080&per_page=5`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Procurar a melhor imagem
      const bestPhoto = data.hits
        .sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight))[0];
      
      if (bestPhoto) {
        stats.byProvider.pixabay.success++;
        return {
          url: bestPhoto.fullHDURL || bestPhoto.webformatURL,
          provider: 'pixabay',
          width: bestPhoto.imageWidth,
          height: bestPhoto.imageHeight,
          alt: bestPhoto.tags || ''
        };
      }
    }
    
    return null;
  } catch (error) {
    stats.byProvider.pixabay.failed++;
    stats.errors.push(`Pixabay: ${error.message}`);
    return null;
  }
}

// Função para baixar e salvar imagem
async function downloadImage(imageData, filename) {
  return new Promise((resolve) => {
    const filePath = path.join(__dirname, '..', 'public', 'images', 'cities', filename);
    
    https.get(imageData.url, (response) => {
      if (response.statusCode !== 200) {
        resolve({ success: false, error: `HTTP ${response.statusCode}` });
        return;
      }
      
      const chunks = [];
      let totalSize = 0;
      
      response.on('data', (chunk) => {
        chunks.push(chunk);
        totalSize += chunk.length;
      });
      
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await fs.writeFile(filePath, buffer);
          
          resolve({ 
            success: true, 
            size: Math.round(totalSize / 1024), // KB
            filename,
            path: filePath
          });
          
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      });
      
      response.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
      
    }).on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
  });
}

// Função para verificar se arquivo já existe
async function fileExists(filename) {
  try {
    const filePath = path.join(__dirname, '..', 'public', 'images', 'cities', filename);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Função para buscar imagem em todos os provedores
async function fetchCityImage(city) {
  const filename = `${city.id}_${city.name.toLowerCase().replace(/[^\w]/g, '')}.jpg`;
  
  // Verificar se já existe
  if (await fileExists(filename)) {
    console.log(`⏭️  Pulando ${city.name} - arquivo já existe`);
    stats.skipped++;
    return true;
  }
  
  const searchTerm = createSearchTerm(city.name, city.state);
  console.log(`🔍 Buscando: ${city.name}, ${city.state} (${searchTerm})`);
  
  // Tentar Pexels primeiro
  let imageData = await searchPexels(searchTerm);
  if (imageData) {
    console.log(`✅ Encontrado no Pexels: ${imageData.width}x${imageData.height}`);
  } else {
    // Aguardar antes de tentar Unsplash
    console.log('⏳ Aguardando para tentar Unsplash...');
    await new Promise(resolve => setTimeout(resolve, APIS.unsplash.delay));
    
    imageData = await searchUnsplash(searchTerm);
    if (imageData) {
      console.log(`✅ Encontrado no Unsplash: ${imageData.width}x${imageData.height}`);
    } else {
      // Aguardar antes de tentar Pixabay
      console.log('⏳ Aguardando para tentar Pixabay...');
      await new Promise(resolve => setTimeout(resolve, APIS.pixabay.delay));
      
      imageData = await searchPixabay(searchTerm);
      if (imageData) {
        console.log(`✅ Encontrado no Pixabay: ${imageData.width}x${imageData.height}`);
      }
    }
  }
  
  if (!imageData) {
    console.log(`❌ Nenhuma imagem encontrada para ${city.name}`);
    stats.failedCities.push(city);
    stats.failed++;
    return false;
  }
  
  // Baixar imagem
  try {
    console.log(`💾 Baixando imagem para ${filename}...`);
    const downloadResult = await downloadImage(imageData, filename);
    
    // Atualizar Supabase com o caminho da imagem
    const imagePath = `/images/cities/${filename}`;
    const { error } = await supabase
      .from('cities')
      .update({ imagem: imagePath })
      .eq('id', city.id);
    
    if (error) {
      console.log(`⚠️  Erro ao atualizar BD: ${error.message}`);
    } else {
      console.log(`✅ ${city.name} - ${downloadResult.provider} - ${Math.round(downloadResult.size/1024)}KB`);
    }
    
    stats.successful++;
    
    // Aguardar entre downloads para respeitar rate limits
    await new Promise(resolve => setTimeout(resolve, APIS.pexels.delay));
    
    return true;
  } catch (error) {
    console.log(`❌ Erro ao baixar ${filename}: ${error.message}`);
    stats.errors.push(`Download ${filename}: ${error.message}`);
    stats.failedCities.push(city);
    stats.failed++;
    return false;
  }
}

// Função para buscar todas as cidades sem imagem (com paginação)
async function getAllCitiesWithoutImages() {
  console.log('📊 Buscando TODAS as cidades sem imagem no banco de dados...');
  
  let allCities = [];
  let page = 0;
  const pageSize = 1000; // Máximo permitido pelo Supabase
  let hasMore = true;
  
  while (hasMore) {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, main_destiny')
      .is('imagem', null)
      .order('main_destiny', { ascending: false }) // Priorizar destinos principais primeiro
      .order('name')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) {
      throw error;
    }
    
    if (cities && cities.length > 0) {
      allCities = allCities.concat(cities);
      const mainDestinyCount = cities.filter(c => c.main_destiny).length;
      console.log(`📄 Página ${page + 1}: ${cities.length} cidades (${mainDestinyCount} destinos principais)`);
    }
    
    hasMore = cities && cities.length === pageSize;
    page++;
    
    // Proteção contra loop infinito (máximo 100 páginas = 100.000 cidades)
    if (page > 100) {
      console.log('⚠️  Limite máximo de páginas atingido (100), parando busca');
      break;
    }
  }
  
  const mainDestinyTotal = allCities.filter(c => c.main_destiny).length;
  console.log(`📊 Total de cidades sem imagem: ${allCities.length}`);
  console.log(`🎯 Destinos principais sem imagem: ${mainDestinyTotal}`);
  console.log(`📍 Outras cidades sem imagem: ${allCities.length - mainDestinyTotal}\n`);
  
  return allCities;
}

// Função principal otimizada para processamento em paralelo
async function main() {
  console.log('🚀 Iniciando captura de imagens de cidades...\n');
  
  // Criar diretório se não existir
  const citiesDir = path.join(__dirname, '..', 'public', 'images', 'cities');
  try {
    await fs.mkdir(citiesDir, { recursive: true });
  } catch (error) {
    console.error('❌ Erro ao criar diretório:', error.message);
    process.exit(1);
  }
  
  // Buscar todas as cidades sem imagem (com paginação)
  try {
    const cities = await getAllCitiesWithoutImages();
    
    stats.totalCities = cities.length;
    
    if (!cities || cities.length === 0) {
      console.log('✅ Todas as cidades já possuem imagens!');
      return;
    }

    console.log(`📊 Processando ${cities.length} cidades em lotes paralelos...\n`);
    
    // Processar em lotes de 3 cidades por vez (uma para cada API)
    const batchSize = 3;
    const batches = [];
    
    for (let i = 0; i < cities.length; i += batchSize) {
      batches.push(cities.slice(i, i + batchSize));
    }
    
    console.log(`🔄 Total de lotes: ${batches.length}\n`);
    
    // Processar cada lote
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchPromises = [];
      
      // Para cada cidade no lote, atribuir uma API diferente
      batch.forEach((city, cityIndex) => {
        const apiProviders = ['pexels', 'pixabay', 'unsplash'];
        const assignedAPI = apiProviders[cityIndex % apiProviders.length];
        
        batchPromises.push(processCityWithAPI(city, assignedAPI, batchIndex + 1, batches.length));
      });
      
      // Executar o lote em paralelo
      await Promise.all(batchPromises);
      
      // Rate limiting entre lotes (mais conservador)
      if (batchIndex < batches.length - 1) {
        console.log(`⏳ Aguardando 3 segundos antes do próximo lote...\n`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Imprimir progresso a cada 10 lotes
      if ((batchIndex + 1) % 10 === 0) {
        const progress = ((batchIndex + 1) / batches.length * 100).toFixed(1);
        console.log(`📈 Progresso geral: ${progress}% (${(batchIndex + 1) * batchSize}/${cities.length} cidades processadas)`);
        printDetailedStats();
      }
    }
    
    // Estatísticas finais
    console.log('\n🎉 Processamento concluído!');
    printDetailedStats();
    
  } catch (error) {
    console.error('❌ Erro na função principal:', error);
    printDetailedStats();
    process.exit(1);
  }
}

// Função para processar uma cidade com uma API específica
async function processCityWithAPI(city, apiProvider, batchNum, totalBatches) {
  const cityLabel = `${city.name}, ${city.state}`;
  
  try {
    stats.processed++;
    
    console.log(`🏙️  [Lote ${batchNum}/${totalBatches}] Processando ${cityLabel} via ${apiProvider.toUpperCase()}...`);
    
    // Criar termo de busca
    const searchTerm = createSearchTerm(city.name, city.state);
    
    // Buscar imagem na API designada
    let imageData = null;
    
    switch (apiProvider) {
      case 'pexels':
        await new Promise(resolve => setTimeout(resolve, APIS.pexels.delay));
        imageData = await searchPexels(searchTerm);
        break;
      case 'unsplash':
        await new Promise(resolve => setTimeout(resolve, APIS.unsplash.delay));
        imageData = await searchUnsplash(searchTerm);
        break;
      case 'pixabay':
        await new Promise(resolve => setTimeout(resolve, APIS.pixabay.delay));
        imageData = await searchPixabay(searchTerm);
        break;
    }
    
    if (!imageData) {
      console.log(`❌ ${cityLabel}: Nenhuma imagem encontrada via ${apiProvider.toUpperCase()}`);
      stats.failed++;
      stats.failedCities.push(city);
      return false;
    }
    
    // Fazer download da imagem
    const filename = `${city.id}.jpg`;
    const downloadResult = await downloadImage(imageData, filename);
    
    if (!downloadResult.success) {
      console.log(`❌ ${cityLabel}: Erro no download - ${downloadResult.error}`);
      stats.failed++;
      stats.failedCities.push(city);
      return false;
    }
    
    // Atualizar banco de dados
    const imagePath = `/images/cities/${filename}`;
    const { error: updateError } = await supabase
      .from('cities')
      .update({ imagem: imagePath })
      .eq('id', city.id);
    
    if (updateError) {
      console.log(`❌ ${cityLabel}: Erro ao atualizar banco - ${updateError.message}`);
      stats.failed++;
      stats.failedCities.push(city);
      return false;
    }
    
    console.log(`✅ ${cityLabel}: Sucesso! (${downloadResult.size}KB via ${imageData.provider})`);
    stats.successful++;
    stats.downloadedFiles.push({
      city: cityLabel,
      filename,
      provider: imageData.provider,
      size: downloadResult.size
    });
    
    return true;
    
  } catch (error) {
    console.log(`❌ ${cityLabel}: Erro inesperado - ${error.message}`);
    stats.failed++;
    stats.failedCities.push(city);
    return false;
  }
}

// Executar script
main().catch(console.error);
