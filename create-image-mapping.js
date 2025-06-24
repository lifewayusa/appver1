const fs = require('fs');
const path = require('path');

// Função para criar um mapeamento de ID para nome de arquivo
function createImageMapping() {
  const imagesDir = '/home/sergio-castro/Documentos/projetos/Lifewayusa/public/images/cities';
  const files = fs.readdirSync(imagesDir);
  
  const mapping = {};
  
  files.forEach(file => {
    if (file.includes('_') && (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))) {
      const parts = file.split('_');
      if (parts.length >= 2) {
        const id = parts[0];
        mapping[id] = file;
      }
    }
  });
  
  // Salvar o mapeamento em um arquivo JSON
  fs.writeFileSync(
    '/home/sergio-castro/Documentos/projetos/Lifewayusa/public/images/cities/image-mapping.json',
    JSON.stringify(mapping, null, 2)
  );
  
  console.log(`Mapeamento criado com ${Object.keys(mapping).length} imagens`);
  console.log('Arquivo salvo em: /home/sergio-castro/Documentos/projetos/Lifewayusa/public/images/cities/image-mapping.json');
}

createImageMapping();
