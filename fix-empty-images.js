const https = require('https');
const fs = require('fs');
const path = require('path');

// Imagens que precisam ser redownloadadas
const emptyImages = [
  'documentos-imigracao',
  'deportacao-defesa', 
  'visto-transito-c1',
  'green-card-eb5',
  'visto-k1-noivo',
  'entrevista-visto-americano',
  'consulado-americano',
  'visto-estudante-f1',
  'green-card-profissional',
  'visto-l1-transferencia'
];

// Termos de busca específicos para cada imagem
const searchTerms = {
  'documentos-imigracao': 'immigration documents papers usa official forms',
  'deportacao-defesa': 'legal defense immigration court lawyer usa',
  'visto-transito-c1': 'airport transit visa usa documents',
  'green-card-eb5': 'eb5 investment green card usa business',
  'visto-k1-noivo': 'k1 fiance visa couple wedding usa',
  'entrevista-visto-americano': 'visa interview us consulate office',
  'consulado-americano': 'us consulate building american flag',
  'visto-estudante-f1': 'f1 student visa university campus usa',
  'green-card-profissional': 'professional green card office worker',
  'visto-l1-transferencia': 'l1 visa business transfer office professional'
};

async function downloadImage(query, filename) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
    
    console.log(`Baixando ${filename}...`);
    
    const file = fs.createWriteStream(`public/images/blog/${filename}.jpg`);
    
    https.get(searchUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ ${filename}.jpg baixado com sucesso`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(`public/images/blog/${filename}.jpg`, () => {}); // Remove arquivo incompleto
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function fixEmptyImages() {
  console.log('Iniciando correção de imagens vazias...\n');
  
  for (let i = 0; i < emptyImages.length; i++) {
    const slug = emptyImages[i];
    const query = searchTerms[slug];
    
    try {
      await downloadImage(query, slug);
      // Pequena pausa entre downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Erro ao baixar ${slug}:`, error.message);
    }
  }
  
  console.log('\n✅ Processo de correção concluído!');
}

fixEmptyImages();
