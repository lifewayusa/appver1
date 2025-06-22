// Teste simples da API
const formData = {
  user_email: "teste@teste.com",
  form_data: {
    fullName: "João Teste",
    freeFormAspirations: "Meu sonho americano"
  },
  is_completed: false,
  qualify: null
};

console.log('Testando API local...');
console.log('Dados a enviar:', JSON.stringify(formData, null, 2));

fetch('http://localhost:3000/api/form/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
  console.log('Resposta da API:');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Erro:', error);
});
