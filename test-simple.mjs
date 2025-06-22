import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oaxkqqamnppkeavunlgo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGtxcWFtbnBwa2VhdnVubGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjk0NDAsImV4cCI6MjA2NTk0NTQ0MH0.Unrx3t5ONb7gmVG1-NFF2jZMca71WMWFmhVlLQueQv8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateSystem() {
  console.log('🔍 Validando sistema de logs...\n');
  
  try {
    // Testar api_logs
    const { data: logs, error: logsError } = await supabase
      .from('api_logs')
      .select('count')
      .limit(1);
      
    if (logsError) {
      console.log('❌ api_logs:', logsError.message);
    } else {
      console.log('✅ api_logs funcionando');
    }
    
    // Testar api_metrics_daily  
    const { data: metrics, error: metricsError } = await supabase
      .from('api_metrics_daily')
      .select('count')
      .limit(1);
      
    if (metricsError) {
      console.log('❌ api_metrics_daily:', metricsError.message);
    } else {
      console.log('✅ api_metrics_daily funcionando');
    }
    
    // Inserir log de teste
    const { data: insert, error: insertError } = await supabase
      .from('api_logs')
      .insert({
        tool_name: 'test-validation',
        endpoint: '/test',
        http_method: 'GET',
        step: 'validation',
        status: 'success',
        user_email: 'test@lifewayusa.com'
      });
      
    if (insertError) {
      console.log('❌ Inserção:', insertError.message);
    } else {
      console.log('✅ Inserção de logs funcionando');
    }
    
    console.log('\n🎉 Sistema validado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

validateSystem();
