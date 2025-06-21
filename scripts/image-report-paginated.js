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

// Função para buscar todas as cidades com paginação
async function getAllCitiesPaginated() {
  let allCities = [];
  let page = 0;
  const pageSize = 1000;
  
  console.log('📊 Coletando dados de todas as cidades...');
  
  while (true) {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, imagem, main_destiny')
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('name');
    
    if (error) {
      throw error;
    }
    
    if (!cities || cities.length === 0) {
      break;
    }
    
    allCities = allCities.concat(cities);
    process.stdout.write(`\r📄 Página ${page + 1}: ${allCities.length} cidades coletadas...`);
    
    if (cities.length < pageSize) {
      break;
    }
    
    page++;
    
    // Limite de segurança
    if (page > 100) {
      console.log('\n⚠️  Limite de páginas atingido (100), parando busca');
      break;
    }
  }
  
  console.log(`\n✅ Total coletado: ${allCities.length} cidades\n`);
  return allCities;
}

// Função para verificar arquivos físicos
async function checkPhysicalFiles() {
  const citiesDir = path.join(__dirname, '..', 'public', 'images', 'cities');
  let physicalFiles = [];
  let totalSizeBytes = 0;
  
  try {
    const files = await fs.readdir(citiesDir);
    physicalFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp')
    );
    
    // Calcular tamanho total
    for (const file of physicalFiles) {
      try {
        const filePath = path.join(citiesDir, file);
        const stats = await fs.stat(filePath);
        totalSizeBytes += stats.size;
      } catch (error) {
        // Ignorar erros de arquivo específico
      }
    }
  } catch (error) {
    console.log('⚠️  Diretório de imagens não encontrado:', citiesDir);
  }
  
  return {
    files: physicalFiles,
    count: physicalFiles.length,
    totalSizeBytes,
    totalSizeMB: (totalSizeBytes / 1024 / 1024).toFixed(2),
    avgSizeKB: physicalFiles.length > 0 ? (totalSizeBytes / physicalFiles.length / 1024).toFixed(1) : 0
  };
}

// Função para gerar relatório completo
async function generateComprehensiveReport() {
  console.log('🚀 Gerando Relatório Abrangente de Imagens de Cidades');
  console.log('====================================================\n');

  try {
    // Buscar todos os dados
    const allCities = await getAllCitiesPaginated();
    const physicalInfo = await checkPhysicalFiles();
    
    // Calcular estatísticas gerais
    const totalCities = allCities.length;
    const citiesWithImages = allCities.filter(city => city.imagem);
    const citiesWithoutImages = allCities.filter(city => !city.imagem);
    const mainDestinyCities = allCities.filter(city => city.main_destiny);
    const mainDestinyWithImages = mainDestinyCities.filter(city => city.imagem);
    
    // Imprimir estatísticas gerais
    console.log('🏙️  ESTATÍSTICAS GERAIS:');
    console.log(`   Total de cidades no banco: ${totalCities.toLocaleString()}`);
    console.log(`   Cidades com imagens: ${citiesWithImages.length.toLocaleString()} (${Math.round((citiesWithImages.length/totalCities)*100)}%)`);
    console.log(`   Cidades sem imagens: ${citiesWithoutImages.length.toLocaleString()} (${Math.round((citiesWithoutImages.length/totalCities)*100)}%)`);
    console.log('');

    console.log('🎯 DESTINOS PRINCIPAIS (main_destiny=true):');
    console.log(`   Total de destinos principais: ${mainDestinyCities.length}`);
    console.log(`   Com imagens: ${mainDestinyWithImages.length} (${Math.round((mainDestinyWithImages.length/mainDestinyCities.length)*100)}%)`);
    console.log(`   Sem imagens: ${mainDestinyCities.length - mainDestinyWithImages.length}`);
    console.log('');

    console.log('💾 ARQUIVOS FÍSICOS:');
    console.log(`   Arquivos na pasta: ${physicalInfo.count.toLocaleString()}`);
    console.log(`   Tamanho total: ${physicalInfo.totalSizeMB} MB`);
    console.log(`   Tamanho médio por arquivo: ${physicalInfo.avgSizeKB} KB`);
    console.log('');

    // Verificar consistência entre BD e arquivos físicos
    console.log('🔍 VERIFICAÇÃO DE CONSISTÊNCIA:');
    
    const dbImageReferences = citiesWithImages
      .map(city => {
        if (city.imagem && city.imagem.startsWith('/images/cities/')) {
          return city.imagem.split('/').pop();
        }
        return null;
      })
      .filter(Boolean);

    const missingFiles = dbImageReferences.filter(filename => !physicalInfo.files.includes(filename));
    const orphanFiles = physicalInfo.files.filter(filename => !dbImageReferences.includes(filename));

    if (missingFiles.length > 0) {
      console.log(`   ❌ Referências no BD sem arquivo físico: ${missingFiles.length}`);
      missingFiles.slice(0, 5).forEach(file => console.log(`      • ${file}`));
      if (missingFiles.length > 5) {
        console.log(`      ... e mais ${missingFiles.length - 5} arquivos`);
      }
    } else {
      console.log('   ✅ Todas as referências do BD têm arquivos físicos');
    }

    if (orphanFiles.length > 0) {
      console.log(`   ⚠️  Arquivos físicos sem referência no BD: ${orphanFiles.length}`);
      orphanFiles.slice(0, 5).forEach(file => console.log(`      • ${file}`));
      if (orphanFiles.length > 5) {
        console.log(`      ... e mais ${orphanFiles.length - 5} arquivos`);
      }
    } else {
      console.log('   ✅ Todos os arquivos físicos têm referências no BD');
    }
    console.log('');

    // Estatísticas por estado
    console.log('📊 ESTATÍSTICAS POR ESTADO (top 15):');
    const stateStats = {};
    
    allCities.forEach(city => {
      if (!stateStats[city.state]) {
        stateStats[city.state] = { total: 0, withImages: 0, mainDestiny: 0, mainDestinyWithImages: 0 };
      }
      stateStats[city.state].total++;
      if (city.imagem) {
        stateStats[city.state].withImages++;
      }
      if (city.main_destiny) {
        stateStats[city.state].mainDestiny++;
        if (city.imagem) {
          stateStats[city.state].mainDestinyWithImages++;
        }
      }
    });

    const sortedStates = Object.entries(stateStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 15);

    sortedStates.forEach(([state, stats]) => {
      const percentage = Math.round((stats.withImages / stats.total) * 100);
      const mainInfo = stats.mainDestiny > 0 ? ` | Principais: ${stats.mainDestinyWithImages}/${stats.mainDestiny}` : '';
      console.log(`   ${state.padEnd(20)}: ${stats.withImages.toString().padStart(4)}/${stats.total.toString().padStart(4)} (${percentage.toString().padStart(2)}%)${mainInfo}`);
    });
    console.log('');

    // Top cidades sem imagens (priorizando destinos principais)
    const priorityCities = citiesWithoutImages
      .sort((a, b) => {
        if (a.main_destiny && !b.main_destiny) return -1;
        if (!a.main_destiny && b.main_destiny) return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 20);

    if (priorityCities.length > 0) {
      console.log('🚨 TOP 20 CIDADES SEM IMAGENS (prioridade para main_destiny):');
      priorityCities.forEach((city, index) => {
        const priority = city.main_destiny ? '🎯' : '📍';
        console.log(`   ${(index + 1).toString().padStart(2)}. ${priority} ${city.name}, ${city.state} (ID: ${city.id})`);
      });
      console.log('');
    }

    // Estatísticas de progresso para próximas execuções
    console.log('📈 RECOMENDAÇÕES PARA PRÓXIMA EXECUÇÃO:');
    
    if (mainDestinyCities.length - mainDestinyWithImages.length > 0) {
      console.log(`   🎯 Focar primeiro nos ${mainDestinyCities.length - mainDestinyWithImages.length} destinos principais sem imagem`);
    }
    
    const batchSize = 50;
    const remainingBatches = Math.ceil(citiesWithoutImages.length / batchSize);
    console.log(`   📦 Cidades restantes podem ser processadas em ${remainingBatches} lotes de ${batchSize}`);
    
    if (citiesWithoutImages.length > 0) {
      console.log('   💡 Comando sugerido para próximo lote:');
      console.log(`      BATCH_SIZE=${batchSize} node scripts/fetch-city-images.js`);
    }
    
    console.log('\n====================================================');
    console.log(`✅ Relatório completo gerado! (${new Date().toLocaleString('pt-BR')})`);

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Função para relatório rápido (apenas números principais)
async function generateQuickReport() {
  try {
    // Contar rapidamente usando count
    const { count: totalCities } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });

    const { count: citiesWithImages } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true })
      .not('imagem', 'is', null);

    const { count: mainDestinyTotal } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true })
      .eq('main_destiny', true);

    const { count: mainDestinyWithImages } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true })
      .eq('main_destiny', true)
      .not('imagem', 'is', null);

    console.log('⚡ RELATÓRIO RÁPIDO');
    console.log('==================');
    console.log(`🏙️  Total: ${totalCities?.toLocaleString() || 0} cidades`);
    console.log(`📸 Com imagens: ${citiesWithImages?.toLocaleString() || 0} (${Math.round(((citiesWithImages || 0)/(totalCities || 1))*100)}%)`);
    console.log(`❌ Sem imagens: ${((totalCities || 0) - (citiesWithImages || 0)).toLocaleString()}`);
    console.log(`🎯 Principais com imagens: ${mainDestinyWithImages || 0}/${mainDestinyTotal || 0}`);
    console.log('==================\n');

  } catch (error) {
    console.error('❌ Erro no relatório rápido:', error.message);
  }
}

// CLI
const args = process.argv.slice(2);
const reportType = args[0] || 'full';

if (reportType === 'quick' || reportType === 'q') {
  generateQuickReport();
} else {
  generateComprehensiveReport();
}
