import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { ApiLogger } from '../../../../../lib/api-logger';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const toolName = 'get-opportunity';
  
  try {
    // Parse request body
    const userData = await request.json();
    console.log('📊 GET-OPPORTUNITY: Request received', { userData });

    // Read the prompt template
    const promptPath = path.join(process.cwd(), 'prompt_getopportunity.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');
    console.log('📄 GET-OPPORTUNITY: Prompt loaded', { promptLength: promptTemplate.length });

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

**DADOS DO USUÁRIO:**
${JSON.stringify(userData, null, 2)}

Por favor, forneça uma análise detalhada e personalizada baseada nas informações fornecidas.`;

    // Log prompt loaded
    await ApiLogger.logPromptLoaded(toolName, fullPrompt, userData, request);

    console.log('🚀 GET-OPPORTUNITY: Sending request to OpenAI', { 
      promptLength: fullPrompt.length,
      model: 'gpt-4o'
    });

    const openaiStartTime = Date.now();
    
    // Log OpenAI request
    const openaiRequest = {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: fullPrompt }],
      max_tokens: 4000,
      temperature: 0.7
    };
    
    await ApiLogger.logOpenAIRequest(toolName, openaiRequest, request);

## DADOS DO USUÁRIO PARA ANÁLISE:

### Informações Profissionais:
- Formação acadêmica: ${userData.education || 'Não informado'}
- Experiência profissional: ${userData.experience || 'Não informado'}
- Habilidades técnicas: ${userData.skills || 'Não informado'}
- Certificações: ${userData.certifications || 'Não informado'}
- Área de atuação atual/desejada: ${userData.currentField || 'Não informado'}

### Informações Pessoais:
- Hobbies e interesses: ${userData.hobbies || 'Não informado'}
- Atividades que gosta de fazer: ${userData.activities || 'Não informado'}
- Talentos naturais: ${userData.talents || 'Não informado'}
- Paixões pessoais: ${userData.passions || 'Não informado'}

### Estrutura Familiar:
- Estado civil: ${userData.maritalStatus || 'Não informado'}
- Filhos (idades): ${userData.children || 'Não informado'}
- Dependentes: ${userData.dependents || 'Não informado'}
- Flexibilidade para mudança: ${userData.flexibility || 'Não informado'}
- Necessidades especiais da família: ${userData.specialNeeds || 'Não informado'}

### Preferências Geográficas:
- Cidades de interesse: ${userData.cities || 'Não informado'}
- Regiões preferidas: ${userData.regions || 'Não informado'}
- Limitações geográficas: ${userData.limitations || 'Não informado'}
- Disposição para mudança: ${userData.relocate || 'Não informado'}

### Objetivos e Restrições:
- Expectativa salarial/faturamento: ${userData.salaryExpectation || 'Não informado'}
- Disponibilidade de investimento: ${userData.investment || 'Não informado'}
- Prazo para transição: ${userData.timeline || 'Não informado'}
- Modelo de trabalho preferido: ${userData.workModel || 'Não informado'}

---

Por favor, gere um relatório completo seguindo exatamente a estrutura do prompt acima, considerando todas as informações fornecidas pelo usuário.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um consultor especializado em direcionamento profissional e oportunidades de negócio. Gere relatórios detalhados, personalizados e profissionais baseados nas informações fornecidas."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Store in database
    const { data, error } = await supabase
      .from('user_reports')
      .insert({
        user_id: 'anonymous',
        tool_type: 'get_opportunity',
        input_data: userData,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report: aiResponse,
      reportId: data.id,
      message: 'Relatório de oportunidades gerado com sucesso!'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
