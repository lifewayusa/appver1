// Mapeamento estático de IDs para nomes de arquivo das imagens
// Este arquivo é gerado automaticamente e deve ser importado estaticamente

export const cityImageMapping: Record<string, string> = {}; // Será populado dinamicamente

// Função para carregar o mapeamento
let mappingLoaded = false;
let imageMapping: Record<string, string> = {};

export async function loadImageMapping() {
  if (mappingLoaded) return imageMapping;
  
  try {
    const response = await fetch('/images/cities/image-mapping.json');
    imageMapping = await response.json();
    mappingLoaded = true;
    return imageMapping;
  } catch (error) {
    console.error('Erro ao carregar mapeamento de imagens:', error);
    return {};
  }
}

// Função para obter URL da imagem usando o ID
export function getCityImageFromMapping(cityId: string): string | null {
  const filename = imageMapping[cityId];
  return filename ? `/images/cities/${filename}` : null;
}
