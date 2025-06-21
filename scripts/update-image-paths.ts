const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Carregar variáveis de ambiente do .env.local
dotenv.config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas');
  console.error('   Verifique se .env.local existe e contém:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Criar cliente Supabase com chave de serviço
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Função para normalizar o caminho da imagem
function normalizeImagePath(currentPath) {
  if (!currentPath) return null;
  
  // Se já está no formato correto, retorna como está
  if (currentPath.startsWith('/images/cities/')) {
    return currentPath;
  }
  
  // Remove leading slash se houver
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
  
  // Pega apenas o nome do arquivo
  const filename = path.basename(cleanPath);
  
  // Retorna no formato padrão
  return `/images/cities/${filename}`;
}

// Função para verificar se a imagem existe fisicamente
function imageExists(imagePath) {
  const fullPath = path.join(process.cwd(), 'public', imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
  return fs.existsSync(fullPath);
}

async function updateImagePaths() {
  const startTime = Date.now();
  
  console.log('🚀 Iniciando atualização de caminhos de imagens...');
  console.log('================================================');
  console.log('⚠️  ATENÇÃO: Processando TODAS as ~5000 cidades do banco!');
  console.log('⏱️  Estimativa: 2-3 horas para completar');
  console.log('');
  
  try {
    // 1. Buscar TODAS as cidades (não apenas main_destiny)
    console.log('📡 Conectando ao Supabase e buscando cidades...');
    const { data: cities, error: fetchError } = await supabase
      .from('cities')
      .select('id, name, imagem')
      .order('id'); // Ordenar por ID para processamento sequencial
    
    if (fetchError) {
      console.error('❌ Erro ao buscar cidades:', fetchError);
      return;
    }
    
    console.log(`📊 Encontradas ${cities?.length || 0} cidades no banco para verificar.`);
    console.log('🔄 Iniciando processamento em lotes...');
    console.log('');
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let missingImageCount = 0;
    let processedCount = 0;
    
    const totalCities = cities?.length || 0;
    const batchSize = 50; // Processar em lotes de 50
    
    // 2. Processar cada cidade com progresso
    for (const city of cities || []) {
      processedCount++;
      const cityLabel = `[${processedCount}/${totalCities}] [ID: ${city.id}] ${city.name}`;
      
      // Mostrar progresso a cada 100 cidades
      if (processedCount % 100 === 0) {
        const percentage = ((processedCount / totalCities) * 100).toFixed(1);
        console.log(`🔄 Progresso: ${percentage}% (${processedCount}/${totalCities})`);
        console.log(`📊 Até agora: ${updatedCount} atualizadas, ${skippedCount} corretas, ${errorCount} erros`);
        console.log('');
      }
      
      if (!city.imagem) {
        if (processedCount % 500 === 0) { // Log apenas a cada 500 para sem imagem
          console.log(`⚪ ${cityLabel}: Sem imagem definida`);
        }
        skippedCount++;
        continue;
      }
      
      // Normalizar o caminho
      const currentPath = city.imagem;
      const newPath = normalizeImagePath(currentPath);
      
      if (!newPath) {
        console.log(`❌ ${cityLabel}: Caminho inválido (${currentPath})`);
        errorCount++;
        continue;
      }
      
      // Se o caminho já está correto, pular (log reduzido)
      if (currentPath === newPath) {
        // Verificar se a imagem existe fisicamente (apenas sample)
        if (processedCount % 1000 === 0) { // Check apenas algumas para performance
          if (!imageExists(newPath)) {
            console.log(`⚠️  ${cityLabel}: Imagem não existe (${newPath})`);
            missingImageCount++;
          } else {
            console.log(`✅ ${cityLabel}: OK (${currentPath})`);
          }
        }
        skippedCount++;
        continue;
      }
      
      // Verificar se a nova imagem existe antes de atualizar
      if (!imageExists(newPath)) {
        console.log(`⚠️  ${cityLabel}: Nova imagem não existe (${newPath}), mantendo atual`);
        missingImageCount++;
        skippedCount++;
        continue;
      }
      
      // Atualizar o registro
      const { error: updateError } = await supabase
        .from('cities')
        .update({ imagem: newPath })
        .eq('id', city.id);
      
      if (updateError) {
        console.error(`❌ ${cityLabel}: Erro ao atualizar:`, updateError);
        errorCount++;
        continue;
      }
      
      console.log(`🔄 ${cityLabel}: "${currentPath}" → "${newPath}"`);
      updatedCount++;
      
      // Pausa mais longa para não sobrecarregar banco com 5000 registros
      if (updatedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms a cada 10 updates
      } else {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms normal
      }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(1); // em minutos
    
    console.log('');
    console.log('📊 === RESUMO FINAL DA ATUALIZAÇÃO ===');
    console.log('====================================');
    console.log(`⏱️  Tempo total de execução: ${duration} minutos`);
    console.log(`📋 Total de cidades processadas: ${totalCities}`);
    console.log(`🔄 Cidades atualizadas: ${updatedCount}`);
    console.log(`✅ Cidades já corretas: ${skippedCount}`);
    console.log(`⚠️  Imagens não encontradas: ${missingImageCount}`);
    console.log(`❌ Erros de atualização: ${errorCount}`);
    console.log('');
    
    if (updatedCount > 0) {
      console.log('✅ Atualização concluída com sucesso!');
      console.log(`🎯 ${updatedCount} registros foram normalizados no banco.`);
    } else if (errorCount > 0) {
      console.log('⚠️  Atualização concluída com erros.');
    } else {
      console.log('ℹ️  Nenhuma atualização necessária - todos os caminhos já estão corretos.');
    }
    
  } catch (error) {
    console.error('💥 Erro inesperado ao executar o script:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Executar o script
updateImagePaths();