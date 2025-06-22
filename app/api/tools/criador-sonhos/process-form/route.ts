import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const userData = await request.json();

    // Read the prompt template
    const promptPath = path.join(process.cwd(), 'prompt_criadordesonhos.md');
    const promptTemplate = fs.readFileSync(promptPath, 'utf8');

    // Combine prompt with user data
    const fullPrompt = `${promptTemplate}

---

## DADOS DA FAMÍLIA PARA ANÁLISE:

### Composição Familiar:
- Membros da família: ${userData.familyMembers || 'Não informado'}
- Dinâmica familiar atual: ${userData.familyDynamic || 'Não informado'}
- Valores e princípios importantes: ${userData.values || 'Não informado'}
- Tradições que querem manter/criar: ${userData.traditions || 'Não informado'}

### Sonhos e Aspirações:
- Sonhos dos adultos: ${userData.adultDreams || 'Não informado'}
- Interesses das crianças: ${userData.childrenInterests || 'Não informado'}
- Experiências familiares desejadas: ${userData.familyExperiences || 'Não informado'}
- Legado a construir: ${userData.legacy || 'Não informado'}

### Situação Atual:
- Estilo de vida presente: ${userData.currentLifestyle || 'Não informado'}
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
        user_id: userId,
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