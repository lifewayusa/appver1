// Teste da API de formulário LOCAL
const testFormAPI = async () => {
  console.log('Testando API do formulário LOCAL...')
  
  const testData = {
    user_email: 'joao.silva@exemplo.com',
    form_data: {
      fullName: 'João Silva',
      email: 'joao.silva@exemplo.com',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      profileType: 'professional',
      currentStep: 3,
      isCompleted: false,
      profession: 'Desenvolvedor',
      experience: 5,
      currentSavings: 50000
    },
    is_completed: false
  }

  try {
    // Teste POST - Salvar dados
    console.log('1. Testando POST /api/form/save-local')
    const postResponse = await fetch('http://localhost:3000/api/form/save-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const postResult = await postResponse.json()
    console.log('Resultado POST:', JSON.stringify(postResult, null, 2))

    // Teste GET - Buscar dados
    console.log('\n2. Testando GET /api/form/save-local')
    const getResponse = await fetch(`http://localhost:3000/api/form/save-local?user_email=${encodeURIComponent(testData.user_email)}`)
    const getResult = await getResponse.json()
    console.log('Resultado GET:', JSON.stringify(getResult, null, 2))

    // Teste PUT - Atualizar dados
    console.log('\n3. Testando POST novamente para atualizar')
    const updateData = {
      ...testData,
      form_data: {
        ...testData.form_data,
        currentStep: 5,
        profession: 'Desenvolvedor Senior',
        isCompleted: true
      },
      is_completed: true,
      qualify: true
    }

    const updateResponse = await fetch('http://localhost:3000/api/form/save-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    const updateResult = await updateResponse.json()
    console.log('Resultado UPDATE:', JSON.stringify(updateResult, null, 2))

    // Verificar resultado final
    console.log('\n4. Verificando resultado final')
    const finalResponse = await fetch(`http://localhost:3000/api/form/save-local?user_email=${encodeURIComponent(testData.user_email)}`)
    const finalResult = await finalResponse.json()
    console.log('Resultado FINAL:', JSON.stringify(finalResult, null, 2))

  } catch (error) {
    console.error('Erro no teste:', error)
  }
}

// Executar teste
testFormAPI()
