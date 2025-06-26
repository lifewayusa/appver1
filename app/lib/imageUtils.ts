// Utilitário para gerar URLs de imagem para artigos do blog
// Baseado no título do artigo, busca imagens relevantes

// import { loadImageUsageData, saveImageUsageData } from './imageUsagePersistence';

// Função para extrair palavras-chave do título
export function extractImageKeywords(title: string): string[] {
  const stopWords = [
    'a', 'o', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'por', 'que', 'como', 'se', 'na', 'no',
    'guia', 'dicas', 'complete', 'como', 'por que', 'quando', 'onde', 'melhor', 'melhores', 'top'
  ];
  
  const words = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  const priorityWords = ['eua', 'usa', 'america', 'estados unidos', 'visto', 'imigracao', 'green card', 'citizenship'];
  const relevant = words.filter(word => priorityWords.some(priority => word.includes(priority)));
  
  return relevant.length > 0 ? relevant.slice(0, 3) : words.slice(0, 3);
}

// Controle de timing para evitar sobrecarga das APIs
let lastRequestTime = 0;
const MIN_DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requisições

// Função para aguardar o delay mínimo entre requisições
async function waitForNextRequest(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_DELAY_BETWEEN_REQUESTS) {
    const waitTime = MIN_DELAY_BETWEEN_REQUESTS - timeSinceLastRequest;
    console.log(`⏰ Aguardando ${waitTime}ms antes da próxima requisição...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

// Função para buscar imagem em múltiplos provedores
export async function searchImageForArticle(title: string): Promise<string | null> {
  const keywords = extractImageKeywords(title);
  console.log(`🔍 Buscando imagem para: "${title}"`);
  console.log(`🏷️ Palavras-chave: ${keywords.join(', ')}`);
  
  // Lista expandida de termos relacionados para diferentes tipos de conteúdo
  const contentCategories = {
    visa: ['visa', 'immigration', 'passport', 'embassy', 'documents', 'application'],
    work: ['business', 'office', 'career', 'professional', 'workplace', 'team'],
    education: ['university', 'college', 'study', 'education', 'graduation', 'students'],
    family: ['family', 'children', 'home', 'together', 'community', 'relationships'],
    travel: ['travel', 'airplane', 'airport', 'journey', 'luggage', 'destination'],
    finance: ['money', 'investment', 'bank', 'finance', 'economy', 'business'],
    technology: ['technology', 'computer', 'innovation', 'digital', 'tech', 'startup'],
    city: ['city', 'skyline', 'urban', 'downtown', 'architecture', 'buildings']
  };

  // Detectar categoria do conteúdo baseado no título
  let selectedCategories: string[] = [];
  const titleLower = title.toLowerCase();
  
  Object.entries(contentCategories).forEach(([category, terms]) => {
    if (terms.some(term => titleLower.includes(term))) {
      selectedCategories.push(category);
    }
  });

  // Se não detectou categoria específica, usar categorias gerais
  if (selectedCategories.length === 0) {
    selectedCategories = ['city', 'travel', 'business'];
  }

  // Tentar buscar com diferentes combinações
  const searchQueries = [
    // Combinações específicas com USA
    ...keywords.map(k => `${k} USA america`),
    ...keywords.map(k => `${k} united states`),
    ...keywords.map(k => `${k} american`),
    
    // Categorias relacionadas + USA
    ...selectedCategories.map(cat => `${contentCategories[cat][0]} USA`),
    ...selectedCategories.map(cat => `${contentCategories[cat][1]} america`),
    
    // Palavras-chave isoladas
    ...keywords.slice(0, 2),
    
    // Termos gerais como último recurso
    'american dream',
    'united states flag',
    'new york city',
    'washington dc',
    'american business'
  ];

  // Tentar Unsplash primeiro
  if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
    for (const query of searchQueries) {
      try {
        // Aplicar delay entre requisições
        await waitForNextRequest();
        
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          // Filtrar imagens que foram usadas recentemente
          const availableResults = filterRecentlyUsedImages(data.results, 'unsplash');
          
          if (availableResults.length > 0) {
            // Escolher uma imagem aleatória dos resultados disponíveis
            const randomIndex = Math.floor(Math.random() * availableResults.length);
            const selectedImage = availableResults[randomIndex].urls.regular;
            
            console.log(`✅ Imagem encontrada no Unsplash para query: "${query}" (${availableResults.length}/${data.results.length} disponíveis)`);
            
            // Marcar como usada
            markImageAsUsed(selectedImage);
            return selectedImage;
          } else {
            console.log(`⏸️ Todas as imagens do Unsplash para "${query}" foram usadas recentemente`);
          }
        }
      } catch (error) {
        console.error('❌ Erro no Unsplash:', error);
      }
    }
  }
  
  // Tentar Pexels
  if (process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
    for (const query of searchQueries.slice(0, 5)) { // Limitar queries no Pexels
      try {
        // Aplicar delay entre requisições
        await waitForNextRequest();
        
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
          {
            headers: {
              'Authorization': process.env.NEXT_PUBLIC_PEXELS_API_KEY
            }
          }
        );
        
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          // Filtrar imagens que foram usadas recentemente
          const availableResults = filterRecentlyUsedImages(data.photos, 'pexels');
          
          if (availableResults.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableResults.length);
            const selectedImage = availableResults[randomIndex].src.large;
            
            console.log(`✅ Imagem encontrada no Pexels para query: "${query}" (${availableResults.length}/${data.photos.length} disponíveis)`);
            
            // Marcar como usada
            markImageAsUsed(selectedImage);
            return selectedImage;
          } else {
            console.log(`⏸️ Todas as imagens do Pexels para "${query}" foram usadas recentemente`);
          }
        }
      } catch (error) {
        console.error('❌ Erro no Pexels:', error);
      }
    }
  }

  return null;
}

// Cache simples em memória
const imageCache = new Map<string, string>();

// Sistema de controle de uso de imagens para evitar repetições
interface ImageUsage {
  url: string;
  lastUsed: Date;
  usageCount: number;
}

// Sistema em memória para controle de uso de imagens
let imageUsageTracker: Map<string, ImageUsage> = new Map();
let isInitialized = false;

function initializeImageUsageTracker(): void {
  if (!isInitialized) {
    // Inicializar com Map vazia em memória
    imageUsageTracker = new Map();
    console.log('🔄 Sistema de controle de uso inicializado (modo memória)');
    isInitialized = true;
  }
}

// Função para salvar dados automaticamente após mudanças
function saveUsageData(): void {
  try {
    // saveImageUsageData(imageUsageTracker); // Temporariamente desabilitado
    console.log('💾 Dados de uso atualizados (modo memória)');
  } catch (error) {
    console.error('❌ Erro ao salvar dados de uso:', error);
  }
}

const COOLDOWN_DAYS = 90;

// Função para verificar se uma imagem pode ser usada (não foi usada nos últimos 90 dias)
function canUseImage(imageUrl: string): boolean {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  const usage = imageUsageTracker.get(imageUrl);
  if (!usage) {
    return true; // Nunca foi usada, pode usar
  }
  
  const daysSinceLastUse = (Date.now() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceLastUse >= COOLDOWN_DAYS;
}

// Função para marcar uma imagem como usada
function markImageAsUsed(imageUrl: string): void {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  const existing = imageUsageTracker.get(imageUrl);
  imageUsageTracker.set(imageUrl, {
    url: imageUrl,
    lastUsed: new Date(),
    usageCount: existing ? existing.usageCount + 1 : 1
  });
  
  console.log(`📝 Imagem marcada como usada: ${imageUrl.substring(0, 50)}... (uso #${imageUsageTracker.get(imageUrl)?.usageCount})`);
  
  // Salvar dados automaticamente
  saveUsageData();
}

// Função para filtrar resultados da API removendo imagens já usadas recentemente
function filterRecentlyUsedImages(imageResults: any[], sourceType: 'unsplash' | 'pexels'): any[] {
  return imageResults.filter(result => {
    const imageUrl = sourceType === 'unsplash' ? result.urls.regular : result.src.large;
    const canUse = canUseImage(imageUrl);
    
    if (!canUse) {
      const usage = imageUsageTracker.get(imageUrl);
      const daysSince = usage ? (Date.now() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24) : 0;
      console.log(`⏳ Imagem em cooldown: ${imageUrl.substring(0, 50)}... (${Math.ceil(daysSince)} dias atrás)`);
    }
    
    return canUse;
  });
}

// Função para selecionar fallback que não foi usado recentemente
function selectAvailableFallback(slug: string): string {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  // Primeiro, tentar encontrar uma imagem que nunca foi usada ou que já passou do cooldown
  const availableFallbacks = fallbackImages.filter(canUseImage);
  
  if (availableFallbacks.length > 0) {
    // Usar hash do slug para determinismo entre as imagens disponíveis
    const hash = slug.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % availableFallbacks.length;
    const selectedImage = availableFallbacks[index];
    
    console.log(`🎯 Fallback selecionado (${availableFallbacks.length} disponíveis): ${selectedImage.substring(0, 50)}...`);
    return selectedImage;
  } else {
    // Se todas estão em cooldown, usar a que foi usada há mais tempo
    let oldestUsage: { url: string; date: Date } | null = null;
    
    for (const fallbackUrl of fallbackImages) {
      const usage = imageUsageTracker.get(fallbackUrl);
      if (usage && (!oldestUsage || usage.lastUsed < oldestUsage.date)) {
        oldestUsage = { url: fallbackUrl, date: usage.lastUsed };
      }
    }
    
    const selectedImage = oldestUsage?.url || fallbackImages[0];
    console.log(`🔄 Todas em cooldown, usando mais antiga: ${selectedImage.substring(0, 50)}...`);
    return selectedImage;
  }
}

// Array expandido de imagens de fallback para mais variedade
const fallbackImages = [
  // Bandeira americana e símbolos patrióticos
  'https://images.unsplash.com/photo-1586290503724-8e46c8b7e1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Cidades americanas icônicas
  'https://images.unsplash.com/photo-1587213811127-4bebbf3b0b6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // NYC
  'https://images.unsplash.com/photo-1541911087797-f89237bd95d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Washington DC
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Los Angeles
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Chicago
  
  // Temas de imigração e viagem
  'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1569959345776-76425a1f8a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Negócios e trabalho
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Educação e universidades
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Família e comunidade
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

export async function getImageForArticle(title: string, slug: string): Promise<string> {
  // Fazer limpeza automática ocasionalmente (10% das vezes)
  if (Math.random() < 0.1) {
    cleanupOldImageUsage();
  }
  
  // Verificar cache primeiro
  if (imageCache.has(slug)) {
    return imageCache.get(slug)!;
  }
  
  try {
    // Buscar nova imagem apenas se as chaves de API estiverem disponíveis
    if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      const imageUrl = await searchImageForArticle(title);
      
      if (imageUrl) {
        imageCache.set(slug, imageUrl);
        return imageUrl;
      }
    } else {
      console.log('⚠️ Chaves de API não encontradas, usando fallback direto');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar imagem:', error);
  }
  
  // Usar sistema inteligente de fallback que evita repetições
  const fallbackImage = selectAvailableFallback(slug);
  
  console.log(`🎯 Usando imagem fallback para "${title}": ${fallbackImage.substring(0, 50)}...`);
  
  // Marcar fallback como usada também
  markImageAsUsed(fallbackImage);
  imageCache.set(slug, fallbackImage);
  return fallbackImage;
}

// Função para limpar cache (útil para desenvolvimento)
export function clearImageCache(): void {
  imageCache.clear();
  console.log('🧹 Cache de imagens limpo');
}

// Função para verificar tamanho do cache
export function getCacheInfo(): { size: number; entries: string[] } {
  return {
    size: imageCache.size,
    entries: Array.from(imageCache.keys())
  };
}

// Função para obter estatísticas de uso de imagens
export function getImageUsageStats(): {
  totalTracked: number;
  recentlyUsed: number;
  available: number;
  oldestUsage: Date | null;
  mostUsed: { url: string; count: number } | null;
} {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  const now = new Date();
  const recentlyUsed = Array.from(imageUsageTracker.values()).filter(usage => {
    const daysSince = (now.getTime() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < COOLDOWN_DAYS;
  });

  let oldestUsage: Date | null = null;
  let mostUsed: { url: string; count: number } | null = null;

  imageUsageTracker.forEach(usage => {
    if (!oldestUsage || usage.lastUsed < oldestUsage) {
      oldestUsage = usage.lastUsed;
    }
    
    if (!mostUsed || usage.usageCount > mostUsed.count) {
      mostUsed = { url: usage.url.substring(0, 50) + '...', count: usage.usageCount };
    }
  });

  return {
    totalTracked: imageUsageTracker.size,
    recentlyUsed: recentlyUsed.length,
    available: imageUsageTracker.size - recentlyUsed.length,
    oldestUsage,
    mostUsed
  };
}

// Função para resetar o rastreamento de uma imagem específica
export function resetImageUsage(imageUrl: string): boolean {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  const deleted = imageUsageTracker.delete(imageUrl);
  if (deleted) {
    console.log(`🔄 Uso resetado para: ${imageUrl.substring(0, 50)}...`);
    saveUsageData(); // Salvar mudança
  }
  return deleted;
}

// Função para limpar usos antigos (mais de 90 dias)
export function cleanupOldImageUsage(): number {
  initializeImageUsageTracker(); // Garantir que dados estão carregados
  
  const now = new Date();
  let cleaned = 0;
  const toDelete: string[] = [];
  
  imageUsageTracker.forEach((usage, url) => {
    const daysSince = (now.getTime() - usage.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince >= COOLDOWN_DAYS) {
      toDelete.push(url);
      cleaned++;
    }
  });
  
  toDelete.forEach(url => imageUsageTracker.delete(url));
  
  if (cleaned > 0) {
    console.log(`🧹 Limpeza automática: ${cleaned} registros antigos removidos`);
    saveUsageData(); // Salvar mudanças
  }
  
  return cleaned;
}
