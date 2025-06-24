// Script para verificar tipos de arquivo das imagens das cidades
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGtxcWFtbnBwa2VhdnVubGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2OTQ0MCwiZXhwIjoyMDY1OTQ1NDQwfQ.-5ORkj6NKs32EkwBpRUyNtV2WKd5kxG1y38vEvOGslY'
);

async function checkFileTypes() {
  console.log('🔍 Verificando tipos de arquivo das cidades principais...\n');
  
  try {
    // Buscar cidades principais
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .eq('main_destiny', true)
      .order('name');

    if (error) {
      console.error('❌ Erro ao buscar cidades:', error);
      return;
    }

    console.log(`✅ Encontradas ${cities.length} cidades principais\n`);

    const citiesDir = path.join(__dirname, 'public', 'images', 'cities');
    
    for (const city of cities) {
      console.log(`🏙️  ${city.name}, ${city.state}`);
      console.log(`   ID: ${city.id}`);
      console.log(`   URL do banco: ${city.imagem || 'NULL'}`);
      
      // Verificar diferentes extensões
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      let foundFile = null;
      
      for (const ext of extensions) {
        const fileName = `${city.id}${ext}`;
        const filePath = path.join(citiesDir, fileName);
        
        if (fs.existsSync(filePath)) {
          foundFile = { fileName, ext, filePath };
          break;
        }
      }
      
      if (foundFile) {
        const stats = fs.statSync(foundFile.filePath);
        console.log(`   ✅ Arquivo encontrado: ${foundFile.fileName}`);
        console.log(`   📁 Extensão: ${foundFile.ext}`);
        console.log(`   📊 Tamanho: ${(stats.size / 1024).toFixed(1)} KB`);
        
        // Verificar se a URL do banco corresponde à extensão real
        const expectedUrl = `/images/cities/${city.id}${foundFile.ext}`;
        const urlMatch = city.imagem === expectedUrl;
        console.log(`   🔗 URL correta: ${urlMatch ? '✅' : '❌'}`);
        if (!urlMatch) {
          console.log(`   📝 URL esperada: ${expectedUrl}`);
        }
      } else {
        console.log(`   ❌ Nenhum arquivo encontrado para nenhuma extensão`);
        
        // Verificar se existe algum arquivo que comece com esse ID
        const files = fs.readdirSync(citiesDir);
        const similarFiles = files.filter(file => file.startsWith(city.id.substring(0, 8)));
        if (similarFiles.length > 0) {
          console.log(`   🔍 Arquivos similares: ${similarFiles.join(', ')}`);
        }
      }
      console.log('');
    }

    // Resumo por extensão
    console.log('\n📊 RESUMO POR EXTENSÃO:');
    const extensionCount = { '.jpg': 0, '.jpeg': 0, '.png': 0, '.webp': 0, 'missing': 0 };
    
    for (const city of cities) {
      let found = false;
      for (const ext of ['.jpg', '.jpeg', '.png', '.webp']) {
        const filePath = path.join(citiesDir, `${city.id}${ext}`);
        if (fs.existsSync(filePath)) {
          extensionCount[ext]++;
          found = true;
          break;
        }
      }
      if (!found) extensionCount.missing++;
    }
    
    Object.entries(extensionCount).forEach(([ext, count]) => {
      if (count > 0) {
        console.log(`   ${ext === 'missing' ? '❌ Ausentes' : ext}: ${count} arquivo(s)`);
      }
    });

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

checkFileTypes();
