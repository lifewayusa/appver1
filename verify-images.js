// Script para verificar se as imagens realmente existem fisicamente
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGtxcWFtbnBwa2VhdnVubGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2OTQ0MCwiZXhwIjoyMDY1OTQ1NDQwfQ.-5ORkj6NKs32EkwBpRUyNtV2WKd5kxG1y38vEvOGslY'
);

async function verifyImages() {
  console.log('🔍 Verificando imagens das cidades principais...\n');
  
  try {
    // Buscar cidades principais
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, imagem')
      .eq('main_destiny', true)
      .order('name')
      .limit(10);

    if (error) {
      console.error('❌ Erro ao buscar cidades:', error);
      return;
    }

    console.log(`📊 Verificando ${cities.length} cidades principais:\n`);

    for (const city of cities) {
      console.log(`🏙️  ${city.name}, ${city.state}`);
      console.log(`   ID: ${city.id}`);
      console.log(`   URL no banco: ${city.imagem || 'NULL'}`);
      
      // Verificar se o arquivo existe fisicamente
      if (city.imagem) {
        // Remover /images/cities/ e verificar o arquivo
        const fileName = city.imagem.replace('/images/cities/', '');
        const filePath = path.join(__dirname, 'public', 'images', 'cities', fileName);
        const exists = fs.existsSync(filePath);
        
        console.log(`   Arquivo esperado: ${fileName}`);
        console.log(`   Existe fisicamente: ${exists ? '✅' : '❌'}`);
        
        if (!exists) {
          // Verificar se existe com o ID
          const idFileName = `${city.id}.jpg`;
          const idFilePath = path.join(__dirname, 'public', 'images', 'cities', idFileName);
          const idExists = fs.existsSync(idFilePath);
          
          console.log(`   Existe com ID (${idFileName}): ${idExists ? '✅' : '❌'}`);
        }
      } else {
        console.log(`   ❌ Sem URL no banco`);
      }
      console.log('');
    }

    // Listar alguns arquivos da pasta para comparação
    console.log('\n📁 Arquivos na pasta /public/images/cities/ (primeiros 20):');
    const citiesDir = path.join(__dirname, 'public', 'images', 'cities');
    const files = fs.readdirSync(citiesDir).slice(0, 20);
    
    files.forEach(file => {
      console.log(`   ${file}`);
    });

    console.log(`\n   ... e mais ${fs.readdirSync(citiesDir).length - 20} arquivos`);

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

verifyImages();
