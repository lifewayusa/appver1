// Teste simples e direto do Pexels
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testando Pexels com correção...');

const headers = { 'Authorization': process.env.PEXELS_API_KEY };
console.log('🔑 Header:', JSON.stringify(headers));

fetch('https://api.pexels.com/v1/search?query=test&per_page=1', { headers })
  .then(res => {
    console.log(`📡 Status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    if (data.photos) {
      console.log('✅ CORREÇÃO FUNCIONOU! Pexels OK');
      console.log(`📊 ${data.total_results} resultados encontrados`);
    } else {
      console.log('❌ Erro:', JSON.stringify(data));
    }
  })
  .catch(err => console.error('💥 Erro:', err.message));
