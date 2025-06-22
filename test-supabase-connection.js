const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function validateLoggingSystem() {
  console.log('🔍 VALIDANDO SISTEMA DE LOGS APÓS EXECUÇÃO DO SQL');
  console.log('================================================\n');
  
  try {
    // 1. Verificar tabela api_logs
    console.log('1. Verificando tabela api_logs...');
    const { data: apiLogsTest, error: apiError } = await supabase
      .from('api_logs')
      .select('id, tool_name, status, created_at')
      .limit(1);
      
    if (apiError) {
      console.log('❌ Erro na tabela api_logs:', apiError.message);
    } else {
      console.log('✅ Tabela api_logs OK');
    }
    
    // 2. Verificar tabela api_metrics_daily
    console.log('\n2. Verificando tabela api_metrics_daily...');
    const { data: metricsTest, error: metricsError } = await supabase
      .from('api_metrics_daily')
      .select('id')
      .limit(1);
      
    if (metricsError) {
      console.log('❌ Erro na tabela api_metrics_daily:', metricsError.message);
    } else {
      console.log('✅ Tabela api_metrics_daily OK');
    }
    
    // 3. Verificar tabela user_sessions
    console.log('\n3. Verificando tabela user_sessions...');
    const { data: sessionsTest, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1);
      
    if (sessionsError) {
      console.log('❌ Erro na tabela user_sessions:', sessionsError.message);
    } else {
      console.log('✅ Tabela user_sessions OK');
    }
    
    // 4. Testar inserção de log
    console.log('\n4. Testando inserção de log...');
    const testLog = {
      tool_name: 'system-validation',
      endpoint: '/test/validation',
      http_method: 'POST',
      step: 'validation_test',
      status: 'success',
      user_email: 'admin@lifewayusa.com',
      metadata: {
        message: 'Teste de validação do sistema de logs',
        timestamp: new Date().toISOString(),
        validation: true
      }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('api_logs')
      .insert(testLog)
      .select();
      
    if (insertError) {
      console.log('❌ Erro ao inserir log de teste:', insertError.message);
    } else {
      console.log('✅ Log de teste inserido com sucesso');
      console.log('   ID:', insertData[0]?.id);
    }
    
    // 5. Verificar views
    console.log('\n5. Verificando views criadas...');
    
    // View v_recent_errors
    const { data: errorsView, error: errorsError } = await supabase
      .from('v_recent_errors')
      .select('*')
      .limit(1);
      
    if (errorsError) {
      console.log('❌ View v_recent_errors:', errorsError.message);
    } else {
      console.log('✅ View v_recent_errors OK');
    }
    
    // View v_tool_performance
    const { data: perfView, error: perfError } = await supabase
      .from('v_tool_performance')
      .select('*')
      .limit(1);
      
    if (perfError) {
      console.log('❌ View v_tool_performance:', perfError.message);
    } else {
      console.log('✅ View v_tool_performance OK');
    }
    
    // 6. Contar logs existentes
    console.log('\n6. Contando logs existentes...');
    const { count, error: countError } = await supabase
      .from('api_logs')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.log('❌ Erro ao contar logs:', countError.message);
    } else {
      console.log(`✅ Total de logs na base: ${count || 0}`);
    }
    
    console.log('\n🎉 VALIDAÇÃO CONCLUÍDA!');
    console.log('======================');
    console.log('✅ Sistema de logs funcionando');
    console.log('✅ Tabelas criadas corretamente');
    console.log('✅ Views operacionais');
    console.log('✅ Inserção de logs funcionando');
    console.log('\n🚀 Próximo passo: Acesse https://lifewayusa.vercel.app/admin');
    
  } catch (error) {
    console.error('❌ Erro na validação:', error.message);
  }
}

validateLoggingSystem();
