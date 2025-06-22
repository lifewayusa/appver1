import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { createApiLogger } from '../../../../lib/ApiLogger';

// Initialize clients
const supabase = createClient(
  'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  let contextLogger: any;
  let userData: any;

  try {
    // Parse request body
    userData = await request.json();
    const userEmail = userData.email || userData.user_email || 'anonymous';
    
    // Initialize logger with user context
    contextLogger = createApiLogger(
      'criador-sonhos', 
      '/api/tools/criador-sonhos/process-form', 
      'POST', 
      request,
      userEmail
    );

    await contextLogger.logRequest(userData);
    await contextLogger.logStep('data_received', 'success', {
      user_data: userData,
      metadata: { data_keys: Object.keys(userData) }
    });

    // Read the prompt template
    await contextLogger.logStep('prompt_loading', 'in_progress');
    const promptPath = path.join(process.cwd(), 'prompt_criadordesonhos.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

## DADOS DA FAMÍLIA PARA ANÁLISE:

### Composição Familiar:
- Membros da família: ${userData.familyMembers || userData.fullName || 'Não informado'}
- Estado civil: ${userData.maritalStatus || 'Não informado'}
- Cônjuge: ${userData.spouse ? `${userData.spouse.name}, ${userData.spouse.profession}` : 'Não informado'}
- Filhos: ${userData.children && userData.children.length > 0 ? userData.children.map((c: any) => `${c.name} (${c.education})`).join(', ') : 'Não informado'}
- Valores e princípios importantes: ${userData.values || 'Família, crescimento pessoal e oportunidades'}

### Sonhos e Aspirações:
- Sonhos dos adultos: ${userData.adultDreams || userData.freeFormAspirations || 'Buscar uma vida melhor nos EUA'}
- Objetivos específicos nos EUA: ${userData.usaObjectives || 'Não informado'}
- Estados de interesse: ${userData.targetStates || 'Não informado'}
- Timeline desejado: ${userData.timeline || 'Não informado'}
- Experiências familiares desejadas: ${userData.familyExperiences || userData.freeFormAspirations || 'Não informado'}

### Situação Atual:
- Estilo de vida presente: ${userData.currentLifestyle || `Profissão: ${userData.profession || 'Não informado'}`}
- Escolaridade: ${userData.education ? `${userData.education.level} em ${userData.education.course}` : 'Não informado'}
- Nível de inglês: ${userData.englishLevel || 'Não informado'}
- Satisfações e insatisfações: ${userData.satisfaction || 'Busca por novas oportunidades'}
- Recursos disponíveis: ${userData.resources || `Poupança: ${userData.currentSavings || 'Não informado'}, Renda mensal: ${userData.monthlyIncome || 'Não informado'}`}
- Capacidade de investimento: ${userData.investmentCapacity || 'Não informado'}

### Perfil Profissional:
- Profissão atual: ${userData.profession || 'Não informado'}
- Anos de experiência: ${userData.experience || 'Não informado'}
- Salário atual: ${userData.currentSalary || 'Não informado'}
- Habilidades: ${userData.skills ? userData.skills.join(', ') : 'Não informado'}

### Interesses e Paixões:
- Hobbies de cada membro: ${userData.hobbies || 'Não informado'}
- Atividades que energizam a família: ${userData.energizingActivities || 'Não informado'}
- Causas que os motivam: ${userData.causes || 'Crescimento pessoal e familiar'}
- Experiências que sonham viver: ${userData.dreamExperiences || userData.freeFormAspirations || 'Vida nos EUA'}

### Critérios Importantes:
- Tipo de ambiente desejado: ${userData.environment || 'Ambiente familiar e seguro'}
- Clima preferido: ${userData.climate || 'Não informado'}
- Satisfações e insatisfações: ${userData.satisfaction || 'Não informado'}
- Recursos disponíveis: ${userData.resources || 'Não informado'}
- Flexibilidade para mudanças: ${userData.flexibility || 'Não informado'}

### Interesses e Paixões:
- Hobbies de cada membro: ${userData.hobbies || 'Não informado'}
- Atividades que energizam a família: ${userData.energizingActivities || 'Não informado'}
- Causas que os motivam: ${userData.causes || 'Não informado'}
- Experiências que sonham viver: ${userData.dreamExperiences || 'Não informado'}

### Critérios Importantes:
- Tipo de ambiente desejado: ${userData.environment || 'Não informado'}
- Clima preferido: ${userData.climate || 'Não informado'}
- Proximidade com natureza/cultura: ${userData.proximity || 'Não informado'}
- Custo de vida aceitável: ${userData.costOfLiving || 'Não informado'}

### Horizontes Geográficos:
- Locais que sempre sonharam conhecer: ${userData.dreamLocations || 'Não informado'}
- Culturas que os fascinam: ${userData.cultures || 'Não informado'}
- Idiomas que gostariam de dominar: ${userData.languages || 'Não informado'}
- Aventuras geográficas desejadas: ${userData.adventures || 'Não informado'}

---

Por favor, gere um relatório inspirador seguindo exatamente a estrutura do prompt acima, usando linguagem motivacional que toque o coração da família e os inspire a realizar seus sonhos.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um consultor inspiracional especializado em transformação de estilo de vida familiar. Gere relatórios que inspirem e motivem famílias a sonharem grande e realizarem mudanças transformadoras. Use linguagem emocional, inspiradora e esperançosa."
        },
        {
          role: "user",
          content: fullPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    });

    const aiResponse = completion.choices[0].message.content;

    // Store in database
    const { data, error } = await supabase
      .from('user_reports')
      .insert({
        user_id: 'anonymous',
        tool_type: 'criador_de_sonhos',
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
      message: 'Relatório de sonhos familiares gerado com sucesso!'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}