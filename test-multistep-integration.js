// Teste do componente MultiStepForm integrado

const testFormSubmit = async () => {
  console.log('Simulando preenchimento e submissão do MultiStepForm...')
  
  // Simular dados de todas as etapas do formulário
  const formData = {
    // Etapa 1 - Dados Pessoais
    fullName: 'Maria Silva Santos',
    email: 'maria.silva@exemplo.com',
    birthDate: '1985-03-15',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    passport: 'BR123456789',
    
    // Etapa 2 - Perfil
    profileType: 'professional',
    
    // Etapa 5 - Profissional
    profession: 'Desenvolvedora de Software',
    experience: 8,
    currentSalary: 12000,
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    
    // Etapa 7 - Situação Financeira
    currentSavings: 100000,
    monthlyIncome: 12000,
    investmentCapacity: 80000,
    
    // Metadados
    currentStep: 8,
    isCompleted: true,
    qualify: true
  }

  try {
    console.log('Dados do formulário a serem salvos:', JSON.stringify(formData, null, 2))

    // Simular salvamento via API
    const response = await fetch('http://localhost:3000/api/form/save-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: formData.email,
        form_data: formData,
        is_completed: true,
        qualify: true
      })
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Formulário salvo com sucesso!')
      console.log('Dados salvos:', JSON.stringify(result.data, null, 2))
      
      // Verificar se foi salvo corretamente
      const getResponse = await fetch(`http://localhost:3000/api/form/save-local?user_email=${encodeURIComponent(formData.email)}`)
      const getResult = await getResponse.json()
      
      if (getResult.success && getResult.data) {
        console.log('✅ Dados recuperados com sucesso!')
        
        // Verificar se todos os campos importantes estão presentes
        const savedData = getResult.data.data
        const importantFields = [
          'fullName', 'email', 'profileType', 'profession', 
          'currentSavings', 'isCompleted', 'qualify'
        ]
        
        const missingFields = importantFields.filter(field => !savedData[field])
        
        if (missingFields.length === 0) {
          console.log('✅ Todos os campos importantes foram salvos corretamente!')
        } else {
          console.log('⚠️ Campos não encontrados:', missingFields)
        }
      }
    } else {
      console.error('❌ Erro ao salvar formulário:', result.error)
    }

  } catch (error) {
    console.error('❌ Erro na simulação:', error)
  }
}

// Executar teste
console.log('=== TESTE DE INTEGRAÇÃO DO MULTISTEPFORM ===')
testFormSubmit()
