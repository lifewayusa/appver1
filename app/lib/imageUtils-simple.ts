// Utilitário para gerar URLs de imagem para artigos do blog
// Baseado no título do artigo, busca imagens relevantes

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

// Função para buscar imagem em múltiplos provedores
export async function searchImageForArticle(title: string): Promise<string | null> {
  const keywords = extractImageKeywords(title);
  console.log(`🔍 Buscando imagem para: "${title}"`);
  console.log(`🏷️ Palavras-chave: ${keywords.join(', ')}`);
  
  // Tentar Unsplash primeiro
  if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
    for (const keyword of keywords) {
      const queries = [
        `${keyword} USA america`,
        `${keyword} united states`,
        `${keyword} american`,
        keyword
      ];
      
      for (const query of queries) {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
              }
            }
          );
          
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            // Escolher uma imagem aleatória dos resultados para mais variedade
            const randomIndex = Math.floor(Math.random() * data.results.length);
            console.log(`✅ Imagem encontrada no Unsplash para query: "${query}"`);
            return data.results[randomIndex].urls.regular;
          }
        } catch (error) {
          console.error('❌ Erro no Unsplash:', error);
        }
        
        // Delay entre queries para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }
  
  // Tentar Pexels
  if (process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
    for (const keyword of keywords) {
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword + ' USA')}&per_page=3&orientation=landscape`,
          {
            headers: {
              'Authorization': process.env.NEXT_PUBLIC_PEXELS_API_KEY
            }
          }
        );
        
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.photos.length);
          console.log(`✅ Imagem encontrada no Pexels para query: "${keyword}"`);
          return data.photos[randomIndex].src.large;
        }
      } catch (error) {
        console.error('❌ Erro no Pexels:', error);
      }
      
      // Delay entre queries
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return null;
}

// Cache simples em memória
const imageCache = new Map<string, string>();

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

// Controle de delay entre requisições
let lastImageRequest = 0;
const MIN_DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requisições

export async function getImageForArticle(title: string, slug: string): Promise<string> {
  // Verificar cache primeiro
  if (imageCache.has(slug)) {
    return imageCache.get(slug)!;
  }
  
  // Aplicar delay entre requisições para não sobrecarregar as APIs
  const now = Date.now();
  const timeSinceLastRequest = now - lastImageRequest;
  
  if (timeSinceLastRequest < MIN_DELAY_BETWEEN_REQUESTS) {
    const delayNeeded = MIN_DELAY_BETWEEN_REQUESTS - timeSinceLastRequest;
    console.log(`⏰ Aguardando ${delayNeeded}ms antes da próxima requisição...`);
    await new Promise(resolve => setTimeout(resolve, delayNeeded));
  }
  
  lastImageRequest = Date.now();
  
  try {
    // Buscar nova imagem apenas se as chaves de API estiverem disponíveis
    if (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      const imageUrl = await searchImageForArticle(title);
      
      if (imageUrl) {
        // Verificar se a URL está válida antes de cachear
        console.log(`🔍 Verificando URL antes de cachear: ${imageUrl}`);
        const isValid = await isImageUrlValid(imageUrl);
        
        if (isValid) {
          console.log(`✅ URL válida, adicionando ao cache: ${imageUrl}`);
          imageCache.set(slug, imageUrl);
          return imageUrl;
        } else {
          console.warn(`❌ URL inválida detectada, descartando: ${imageUrl}`);
        }
      }
    } else {
      console.log('⚠️ Chaves de API não encontradas, usando fallback direto');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar imagem:', error);
  }
  
  // Fallback com variedade - usar hash do slug para determinismo
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % fallbackImages.length;
  const fallbackImage = fallbackImages[index];
  
  console.log(`🎯 Usando imagem fallback para "${title}": ${fallbackImage.substring(0, 50)}...`);
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

// Função para verificar se uma URL de imagem está válida
export async function isImageUrlValid(url: string, timeoutMs: number = 5000): Promise<boolean> {
  try {
    // Usar AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // HEAD request para verificar se a imagem existe sem baixá-la
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageChecker/1.0)'
      }
    });
    
    clearTimeout(timeoutId);
    
    // Verificar se o status é OK e se é realmente uma imagem
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      return contentType ? contentType.startsWith('image/') : true;
    }
    
    return false;
  } catch (error) {
    console.warn(`⚠️ Erro ao verificar URL: ${url}`, error);
    return false;
  }
}

// Função alternativa para verificar imagem no cliente (browser)
export function checkImageLoadClient(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout para evitar espera infinita
    setTimeout(() => resolve(false), 10000);
  });
}

// Função para verificar múltiplas URLs de imagem e retornar a primeira válida
export async function findValidImageUrl(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    try {
      const isValid = await isImageUrlValid(url);
      if (isValid) {
        console.log(`✅ URL válida encontrada: ${url}`);
        return url;
      } else {
        console.log(`❌ URL inválida: ${url}`);
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao verificar URL ${url}:`, error);
    }
  }
  
  return null;
}

// Função para verificar e reparar fallback images
export async function validateFallbackImages(): Promise<string[]> {
  console.log('🔍 Validando imagens de fallback...');
  const validFallbacks: string[] = [];
  
  for (let i = 0; i < fallbackImages.length; i++) {
    const url = fallbackImages[i];
    try {
      const isValid = await isImageUrlValid(url, 3000); // timeout menor para fallbacks
      if (isValid) {
        validFallbacks.push(url);
        console.log(`✅ Fallback ${i + 1}/${fallbackImages.length} válido`);
      } else {
        console.warn(`❌ Fallback ${i + 1}/${fallbackImages.length} inválido: ${url}`);
      }
    } catch (error) {
      console.warn(`⚠️ Erro verificando fallback ${i + 1}:`, error);
    }
    
    // Pequeno delay entre verificações
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`📊 Fallbacks válidos: ${validFallbacks.length}/${fallbackImages.length}`);
  return validFallbacks;
}
