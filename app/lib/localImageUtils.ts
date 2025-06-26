// Utilitário para usar imagens locais do blog quando disponíveis
// Se a imagem local não existir, usa o sistema de busca online

import fs from 'fs';
import path from 'path';

// Função para verificar se existe imagem local para o artigo
export function getLocalImagePath(slug: string): string | null {
  try {
    const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
    
    if (!fs.existsSync(blogImagesDir)) {
      return null;
    }
    
    // Procurar por arquivos que comecem com o slug
    const files = fs.readdirSync(blogImagesDir);
    const matchingFile = files.find(file => 
      file.startsWith(slug) && (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    );
    
    if (matchingFile) {
      return `/images/blog/${matchingFile}`;
    }
    
    return null;
  } catch (error) {
    console.warn('Erro ao verificar imagem local:', error);
    return null;
  }
}

// Função para listar todas as imagens locais disponíveis
export function listLocalImages(): string[] {
  try {
    const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'blog');
    
    if (!fs.existsSync(blogImagesDir)) {
      return [];
    }
    
    const files = fs.readdirSync(blogImagesDir);
    return files
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
      .map(file => `/images/blog/${file}`);
  } catch (error) {
    console.warn('Erro ao listar imagens locais:', error);
    return [];
  }
}

// Função para gerar nome de arquivo a partir do slug
export function generateImageFileName(slug: string, title: string): string {
  const safeName = (slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
    
  return `${safeName}-${Date.now()}.jpg`;
}
