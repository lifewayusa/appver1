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
      
      // Pequeno delay entre queries para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Tentar Pexels
  if (process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
    for (const query of searchQueries.slice(0, 5)) { // Limitar queries no Pexels
      try {
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
          {
            headers: {
              'Authorization': process.env.NEXT_PUBLIC_PEXELS_API_KEY
            }
          }
        );
        
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.photos.length);
          console.log(`✅ Imagem encontrada no Pexels para query: "${query}"`);
          return data.photos[randomIndex].src.large;
        }
      } catch (error) {
        console.error('❌ Erro no Pexels:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
    }
  }
  
  // Fallback: imagens relacionadas aos EUA
  const fallbackImages = [
    'https://images.unsplash.com/photo-1586290503724-8e46c8b7e1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // USA flag
    'https://images.unsplash.com/photo-1587213811127-4bebbf3b0b6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // NYC skyline
    'https://images.unsplash.com/photo-1541911087797-f89237bd95d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Washington DC
    'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Immigration theme
  ];
  
  // Retornar imagem baseada no hash do título
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % fallbackImages.length;
  return fallbackImages[index];
}

// Cache simples em memória
const imageCache = new Map<string, string>();

export async function getImageForArticle(title: string, slug: string): Promise<string> {
  // Verificar cache primeiro
  if (imageCache.has(slug)) {
    return imageCache.get(slug)!;
  }
  
  // Buscar nova imagem
  const imageUrl = await searchImageForArticle(title);
  
  if (imageUrl) {
    imageCache.set(slug, imageUrl);
    return imageUrl;
  }
  
  // Fallback final
  const defaultImage = 'https://images.unsplash.com/photo-1586290503724-8e46c8b7e1dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  imageCache.set(slug, defaultImage);
  return defaultImage;
}
