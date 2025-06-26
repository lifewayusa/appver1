const https = require('https');
const fs = require('fs');

// Apenas as duas imagens problemáticas
const imagesToFix = [
  {
    slug: 'visto-estudante-f1',
    query: 'f1 student visa university campus usa college education'
  },
  {
    slug: 'visto-k1-noivo',
    query: 'k1 fiance visa couple wedding usa engagement'
  }
];

async function downloadImage(query, filename) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
    
    console.log(`🔄 Baixando ${filename}...`);
    
    const file = fs.createWriteStream(`public/images/blog/${filename}.jpg`);
    
    https.get(searchUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${filename}.jpg baixado com sucesso`);
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

async function fixImages() {
  console.log('🔧 Corrigindo as 2 imagens problemáticas...\n');
  
  for (const image of imagesToFix) {
    try {
      await downloadImage(image.query, image.slug);
      // Pausa entre downloads
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`❌ Erro ao baixar ${image.slug}:`, error.message);
    }
  }
  
  console.log('\n🎉 Correção concluída!');
  
  // Verificar tamanhos
  console.log('\n📊 Verificando tamanhos:');
  for (const image of imagesToFix) {
    try {
      const stats = fs.statSync(`public/images/blog/${image.slug}.jpg`);
      console.log(`${image.slug}.jpg: ${Math.round(stats.size / 1024)}KB`);
    } catch (e) {
      console.log(`${image.slug}.jpg: ERRO`);
    }
  }
}

fixImages();
