// Teste rápido de conectividade com Supabase - Campo 'imagem' corrigido
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔌 Testando conexão Supabase com campo "imagem"...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseServiceKey ? 'Configurada' : 'Não configurada'}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('📋 Buscando contagem de cidades...');
    const { data, error, count } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }
    
    console.log(`✅ Conexão OK! Total de cidades: ${count}`);
    
    // Buscar algumas cidades sem imagem usando o campo 'imagem'
    console.log('🔍 Buscando cidades sem imagem (campo "imagem")...');
    const { data: cities, error: error2 } = await supabase
      .from('cities')
      .select('id, name, state, population, imagem')
      .is('imagem', null)
      .order('population', { ascending: false })
      .limit(5);
    
    if (error2) {
      console.error('❌ Erro na busca:', error2.message);
      return;
    }
    
    console.log(`📋 ${cities.length} cidades sem imagem encontradas:`);
    cities.forEach((city, i) => {
      console.log(`  ${i+1}. ${city.name}, ${city.state} (Pop: ${city.population?.toLocaleString()}) - Imagem: ${city.imagem || 'null'}`);
    });
    
    // Verificar estrutura da tabela
    console.log('\n🔍 Verificando estrutura da primeira cidade...');
    const { data: firstCity } = await supabase
      .from('cities')
      .select('*')
      .limit(1);
    
    if (firstCity && firstCity.length > 0) {
      console.log('📝 Campos disponíveis:', Object.keys(firstCity[0]).join(', '));
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error.message);
  }
}

testConnection();
