// Teste de conexão Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Testando conexão Supabase...');
console.log('URL:', supabaseUrl ? 'CONFIGURADA' : '❌ NÃO CONFIGURADA');
console.log('KEY:', supabaseKey ? 'CONFIGURADA' : '❌ NÃO CONFIGURADA');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Teste 1: Verificar se conseguimos conectar
    console.log('\n📡 Teste 1: Verificando conexão...');
    const { data, error } = await supabase.from('multistep_forms').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      
      // Se a tabela não existe, vamos tentar criar
      if (error.message.includes('relation "multistep_forms" does not exist')) {
        console.log('\n🔨 Tabela não existe. Tentando criar...');
        
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS multistep_forms (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            user_id TEXT NOT NULL,
            data JSONB NOT NULL,
            is_completed BOOLEAN DEFAULT FALSE,
            qualify BOOLEAN,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_multistep_forms_user_id ON multistep_forms(user_id);
        `;
        
        const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
        
        if (createError) {
          console.error('❌ Erro ao criar tabela:', createError);
        } else {
          console.log('✅ Tabela criada com sucesso!');
        }
      }
    } else {
      console.log('✅ Conexão OK!');
    }
    
    // Teste 2: Teste de inserção
    console.log('\n📝 Teste 2: Teste de inserção...');
    const testData = {
      user_id: 'test_user_' + Date.now(),
      data: { 
        fullName: 'Teste Usuario',
        freeFormAspirations: 'Meu sonho americano de teste' 
      },
      is_completed: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('multistep_forms')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro na inserção:', insertError);
    } else {
      console.log('✅ Inserção OK!', insertData.id);
      
      // Limpar teste
      await supabase.from('multistep_forms').delete().eq('id', insertData.id);
      console.log('🧹 Registro de teste removido');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testConnection();
