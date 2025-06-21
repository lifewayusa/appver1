const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function generateReport() {
  console.log('📊 Gerando Relatório de Imagens de Cidades');
  console.log('==========================================\n');

  try {
    // Buscar estatísticas do banco de dados
    const { data: allCities, error: allError } = await supabase
      .from('cities')
      .select('id, name, state, imagem, main_destiny');

    if (allError) throw allError;

    const { data: citiesWithImages, error: withImagesError } = await supabase
      .from('cities')
      .select('id, name, state, imagem, main_destiny')
      .not('imagem', 'is', null);

    if (withImagesError) throw withImagesError;

    const { data: mainDestinyCities, error: mainError } = await supabase
      .from('cities')
      .select('id, name, state, imagem, main_destiny')
      .eq('main_destiny', true);

    if (mainError) throw mainError;

    // Verificar arquivos físicos
    const citiesDir = path.join(__dirname, '..', 'public', 'images', 'cities');
    let physicalFiles = [];
    
    try {
      const files = await fs.readdir(citiesDir);
      physicalFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    } catch (error) {
      console.log('⚠️  Diretório de imagens não encontrado');
    }

    // Calcular estatísticas
    const totalCities = allCities.length;
    const citiesWithImagesCount = citiesWithImages.length;
    const citiesWithoutImages = totalCities - citiesWithImagesCount;
    const mainDestinyTotal = mainDestinyCities.length;
    const mainDestinyWithImages = mainDestinyCities.filter(city => city.imagem).length;
    const physicalFilesCount = physicalFiles.length;

    // Calcular tamanho total dos arquivos
    let totalSizeBytes = 0;
    for (const file of physicalFiles) {
      try {
        const filePath = path.join(citiesDir, file);
        const stats = await fs.stat(filePath);
        totalSizeBytes += stats.size;
      } catch (error) {
        // Ignorar erros de arquivo
      }
    }

    const totalSizeMB = (totalSizeBytes / 1024 / 1024).toFixed(2);

    // Imprimir relatório
    console.log('🏙️  ESTATÍSTICAS GERAIS:');
    console.log(`   Total de cidades no banco: ${totalCities}`);
    console.log(`   Cidades com imagens: ${citiesWithImagesCount} (${Math.round((citiesWithImagesCount/totalCities)*100)}%)`);
    console.log(`   Cidades sem imagens: ${citiesWithoutImages} (${Math.round((citiesWithoutImages/totalCities)*100)}%)`);
    console.log('');

    console.log('🎯 DESTINOS PRINCIPAIS (main_destiny=true):');
    console.log(`   Total de destinos principais: ${mainDestinyTotal}`);
    console.log(`   Com imagens: ${mainDestinyWithImages} (${Math.round((mainDestinyWithImages/mainDestinyTotal)*100)}%)`);
    console.log(`   Sem imagens: ${mainDestinyTotal - mainDestinyWithImages}`);
    console.log('');

    console.log('💾 ARQUIVOS FÍSICOS:');
    console.log(`   Arquivos na pasta: ${physicalFilesCount}`);
    console.log(`   Tamanho total: ${totalSizeMB} MB`);
    console.log(`   Tamanho médio por arquivo: ${physicalFilesCount > 0 ? (totalSizeBytes/physicalFilesCount/1024).toFixed(1) : 0} KB`);
    console.log('');

    // Verificar inconsistências
    console.log('🔍 VERIFICAÇÃO DE CONSISTÊNCIA:');
    
    const dbReferences = citiesWithImages.map(city => {
      const imagePath = city.imagem;
      if (imagePath && imagePath.startsWith('/images/cities/')) {
        return imagePath.split('/').pop();
      }
      return null;
    }).filter(Boolean);

    const missingFiles = dbReferences.filter(filename => !physicalFiles.includes(filename));
    const orphanFiles = physicalFiles.filter(filename => !dbReferences.includes(filename));

    if (missingFiles.length > 0) {
      console.log(`   ❌ Arquivos referenciados no DB mas ausentes fisicamente: ${missingFiles.length}`);
      missingFiles.slice(0, 5).forEach(file => console.log(`      • ${file}`));
      if (missingFiles.length > 5) {
        console.log(`      ... e mais ${missingFiles.length - 5} arquivos`);
      }
    } else {
      console.log('   ✅ Todas as referências do DB têm arquivos físicos correspondentes');
    }

    if (orphanFiles.length > 0) {
      console.log(`   ⚠️  Arquivos físicos sem referência no DB: ${orphanFiles.length}`);
      orphanFiles.slice(0, 5).forEach(file => console.log(`      • ${file}`));
      if (orphanFiles.length > 5) {
        console.log(`      ... e mais ${orphanFiles.length - 5} arquivos`);
      }
    } else {
      console.log('   ✅ Todos os arquivos físicos têm referências no DB');
    }

    console.log('');

    // Top 10 cidades sem imagens (destinos principais primeiro)
    const citiesWithoutImagesData = allCities.filter(city => !city.imagem);
    const priorityCities = citiesWithoutImagesData
      .sort((a, b) => {
        if (a.main_destiny && !b.main_destiny) return -1;
        if (!a.main_destiny && b.main_destiny) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 10);

    if (priorityCities.length > 0) {
      console.log('🚨 TOP 10 CIDADES SEM IMAGENS (prioridade):');
      priorityCities.forEach((city, index) => {
        const priority = city.main_destiny ? '🎯' : '📍';
        console.log(`   ${index + 1}. ${priority} ${city.name}, ${city.state} (ID: ${city.id})`);
      });
      console.log('');
    }

    // Estatísticas por estado
    const stateStats = {};
    allCities.forEach(city => {
      if (!stateStats[city.state]) {
        stateStats[city.state] = { total: 0, withImages: 0 };
      }
      stateStats[city.state].total++;
      if (city.imagem) {
        stateStats[city.state].withImages++;
      }
    });

    console.log('📊 ESTATÍSTICAS POR ESTADO (top 10):');
    const sortedStates = Object.entries(stateStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    sortedStates.forEach(([state, stats]) => {
      const percentage = Math.round((stats.withImages / stats.total) * 100);
      console.log(`   ${state}: ${stats.withImages}/${stats.total} (${percentage}%)`);
    });

    console.log('\n==========================================');
    console.log('✅ Relatório gerado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message);
  }
}

// Executar relatório
generateReport();
