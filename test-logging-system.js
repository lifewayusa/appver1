#!/usr/bin/env node

// Teste completo do sistema de logging
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🧪 TESTANDO SISTEMA DE LOGS COMPLETO');
console.log('=====================================');

async function testLoggingSystem() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente não configuradas');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('1️⃣ Testando conexão com Supabase...');
    
    // Testar inserção de log
    const testLog = {
      tool_name: 'test-tool',
      endpoint: '/test',
      http_method: 'POST',
      step: 'test_connection',
      status: 'success',
      user_email: 'test@example.com',
      execution_time_ms: 150,
      metadata: { test: true }
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('api_logs')
      .insert([testLog])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir log de teste:', insertError);
      
      // Tentar criar a tabela se não existir
      console.log('🔧 Tentando criar tabela api_logs...');
      const createTableResult = await supabase.rpc('create_api_logs_table_if_not_exists');
      console.log('Resultado da criação da tabela:', createTableResult);
      
      return;
    }

    console.log('✅ Log de teste inserido com sucesso:', insertResult[0].id);

    // Testar leitura de logs
    console.log('2️⃣ Testando leitura de logs...');
    const { data: logs, error: readError } = await supabase
      .from('api_logs')
      .select('*')
      .limit(5)
      .order('created_at', { ascending: false });

    if (readError) {
      console.error('❌ Erro ao ler logs:', readError);
      return;
    }

    console.log(`✅ ${logs.length} logs encontrados`);
    
    // Testar inserção de sessão
    console.log('3️⃣ Testando sessão de usuário...');
    const testSession = {
      session_id: `test_session_${Date.now()}`,
      user_email: 'test@example.com',
      total_requests: 1,
      tools_used: ['test-tool']
    };

    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert([testSession]);

    if (sessionError) {
      console.error('❌ Erro ao inserir sessão:', sessionError);
    } else {
      console.log('✅ Sessão de teste criada com sucesso');
    }

    // Testar métricas
    console.log('4️⃣ Testando consulta de métricas...');
    const { data: metrics, error: metricsError } = await supabase
      .from('api_logs')
      .select('tool_name, status, execution_time_ms, openai_tokens_used')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (metricsError) {
      console.error('❌ Erro ao buscar métricas:', metricsError);
    } else {
      console.log(`✅ ${metrics.length} registros de métricas encontrados`);
      
      // Calcular estatísticas simples
      const totalRequests = metrics.length;
      const successfulRequests = metrics.filter(m => m.status === 'success').length;
      const avgExecutionTime = metrics.reduce((acc, m) => acc + (m.execution_time_ms || 0), 0) / totalRequests;
      
      console.log('📊 ESTATÍSTICAS ATUAIS:');
      console.log(`   Total de requests: ${totalRequests}`);
      console.log(`   Requests com sucesso: ${successfulRequests}`);
      console.log(`   Taxa de sucesso: ${((successfulRequests / totalRequests) * 100).toFixed(1)}%`);
      console.log(`   Tempo médio de execução: ${Math.round(avgExecutionTime)}ms`);
    }

    // Limpar dados de teste
    console.log('5️⃣ Limpando dados de teste...');
    await supabase
      .from('api_logs')
      .delete()
      .eq('tool_name', 'test-tool');
    
    await supabase
      .from('user_sessions')
      .delete()
      .like('session_id', 'test_session_%');

    console.log('✅ Dados de teste limpos');

    console.log('');
    console.log('🎉 SISTEMA DE LOGS FUNCIONANDO PERFEITAMENTE!');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('1. Testar APIs com dados reais');
    console.log('2. Acessar /admin para ver dashboard');
    console.log('3. Monitorar logs em produção');

  } catch (error) {
    console.error('💥 Erro crítico no teste:', error);
  }
}

// Executar teste
testLoggingSystem();
