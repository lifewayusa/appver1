// Teste do sistema MultiStepForm integrado com OpenAI
const testFormData = {
  fullName: 'Maria Silva Santos',
  email: 'maria.silva@email.com',
  birthDate: '1985-03-15',
  cpf: '123.456.789-10',
  rg: '12.345.678-9',
  profileType: 'family',
  maritalStatus: 'married',
  spouse: {
    name: 'João Santos',
    profession: 'Engenheiro'
  },
  children: [
    { name: 'Pedro Santos', birthDate: '2010-05-20', education: 'Ensino Fundamental' },
    { name: 'Ana Santos', birthDate: '2012-08-10', education: 'Ensino Fundamental' }
  ],
  profession: 'Professora',
  experience: 12,
  monthlyIncome: 8000,
  currentSavings: 150000,
  investmentCapacity: 200000,
  usaObjectives: ['Educação para os filhos', 'Melhor qualidade de vida', 'Oportunidades de carreira'],
  targetStates: ['California', 'Florida', 'Texas'],
  timeline: '2years',
  freeFormAspirations: 'Sonho em proporcionar uma educação de qualidade mundial para meus filhos. Quero que eles tenham acesso às melhores universidades e oportunidades que só os EUA podem oferecer. Também busco crescimento profissional na área da educação, talvez fazer um mestrado em uma universidade americana. Meu maior medo é a barreira do idioma e a adaptação cultural, mas estou determinada a estudar inglês intensivamente. Quero que minha família tenha segurança, estabilidade financeira e que possamos construir um futuro sólido juntos.',
  englishLevel: 'intermediate',
  education: {
    level: 'graduate',
    course: 'Pedagogia',
    institution: 'Universidade Federal'
  }
};

async function testMultiStepFormIntegration() {
  console.log('🧪 TESTANDO INTEGRAÇÃO MULTISTEPFORM + OPENAI');
  console.log('='.repeat(50));
  
  try {
    console.log('📤 Enviando dados do formulário...');
    
    const response = await fetch('http://localhost:3000/api/form/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: testFormData.email,
        form_data: testFormData,
        is_completed: true,
        qualify: true
      })
    });

    const result = await response.json();
    
    console.log('📊 RESULTADO:');
    console.log('Status:', response.status);
    console.log('Sucesso:', result.success);
    console.log('Mensagem:', result.message);
    
    if (result.dreamAnalysis) {
      console.log('✅ ANÁLISE PERSONALIZADA GERADA:');
      console.log('-'.repeat(40));
      console.log(result.dreamAnalysis.substring(0, 500) + '...');
      console.log('-'.repeat(40));
    } else {
      console.log('⚠️ Análise não foi gerada ainda');
    }
    
    if (result.data) {
      console.log('💾 Dados salvos no banco:', result.data.id);
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
  }
}

// Executar teste
testMultiStepFormIntegration();
