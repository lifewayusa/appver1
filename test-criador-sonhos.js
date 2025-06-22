// Teste da API do Criador de Sonhos
const formData = {
  email: "teste@teste.com",
  fullName: "João Teste",
  freeFormAspirations: "Quero realizar meu sonho americano, construir uma vida próspera nos EUA para minha família",
  usaObjectives: ["trabalhar", "estudar"],
  targetStates: ["California", "Florida"],
  timeline: "1-2 anos",
  profession: "Desenvolvedor",
  monthlyIncome: "R$ 8.000"
};

console.log('🎯 Testando API do Criador de Sonhos...');
console.log('Dados a enviar:', JSON.stringify(formData, null, 2));

fetch('http://localhost:3000/api/tools/criador-sonhos/process-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  console.log('\n✅ Resposta da API do Criador de Sonhos:');
  if (data.success) {
    console.log('✅ Sucesso!');
    console.log('📋 Report ID:', data.reportId);
    console.log('📝 Tamanho da análise:', data.report?.length || 0, 'caracteres');
    console.log('🎉 Mensagem:', data.message);
  } else {
    console.log('❌ Erro:', JSON.stringify(data, null, 2));
  }
})
.catch(error => {
  console.error('❌ Erro na requisição:', error);
});
