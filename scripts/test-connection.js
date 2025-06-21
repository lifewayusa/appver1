const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente não configuradas');
    console.log('SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada');
    console.log('SUPABASE_SERVICE_KEY:', supabaseServiceKey ? 'Configurada' : 'Não configurada');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    const { data, error, count } = await supabase
      .from('cities')
      .select('id', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Conexão com Supabase OK!');
    console.log(`📊 Total de cidades no banco: ${count}`);
    
    // Testar contagem de imagens
    const { count: withImages } = await supabase
      .from('cities')
      .select('id', { count: 'exact' })
      .not('imagem', 'is', null);
    
    console.log(`🖼️  Cidades com imagens: ${withImages}`);
    console.log(`🔍 Cidades sem imagens: ${count - withImages}`);
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    process.exit(1);
  }
}

testConnection();
