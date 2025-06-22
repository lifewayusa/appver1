// Teste da API de formulário
const testFormAPI = async () => {
  console.log('Testando API do formulário...')
  
  const testData = {
    user_email: 'teste@exemplo.com',
    form_data: {
      fullName: 'João Silva',
      email: 'teste@exemplo.com',
      birthDate: '1990-01-01',
      cpf: '123.456.789-00',
      profileType: 'professional',
      currentStep: 3,
      isCompleted: false
    },
    is_completed: false
  }

  try {
    // Teste POST - Salvar dados
    console.log('1. Testando POST /api/form/save')
    const postResponse = await fetch('http://localhost:3000/api/form/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const postResult = await postResponse.json()
    console.log('Resultado POST:', postResult)

    // Teste GET - Buscar dados
    console.log('\n2. Testando GET /api/form/save')
    const getResponse = await fetch(`http://localhost:3000/api/form/save?user_email=${encodeURIComponent(testData.user_email)}`)
    const getResult = await getResponse.json()
    console.log('Resultado GET:', getResult)

    // Teste PUT - Atualizar dados
    console.log('\n3. Testando PUT/POST novamente para atualizar')
    const updateData = {
      ...testData,
      form_data: {
        ...testData.form_data,
        currentStep: 5,
        profession: 'Desenvolvedor'
      }
    }

    const updateResponse = await fetch('http://localhost:3000/api/form/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    const updateResult = await updateResponse.json()
    console.log('Resultado UPDATE:', updateResult)

  } catch (error) {
    console.error('Erro no teste:', error)
  }
}

// Executar teste
testFormAPI()
