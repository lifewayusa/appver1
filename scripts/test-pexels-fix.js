// Teste rápido da correção do Pexels
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function testPexels() {
  const pexelsKey = process.env.PEXELS_API_KEY;
  
  console.log('🧪 Testando correção do Pexels...');
  console.log(`🔑 API Key: ${pexelsKey ? 'Configurada' : 'Não encontrada'}`);
  
  try {
    const response = await fetch('https://api.pexels.com/v1/search?query=new%20york&per_page=1', {
      headers: { 'Authorization': pexelsKey }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCESSO! Pexels funcionando perfeitamente');
      console.log(`📊 Total de resultados: ${data.total_results}`);
      console.log(`🖼️  Primeira imagem: ${data.photos[0]?.photographer || 'N/A'}`);
      return true;
    } else {
      console.log(`❌ Erro: ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('💥 Erro na requisição:', error.message);
    return false;
  }
}

testPexels();
