import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients with correct environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    console.log('Dados recebidos:', userData);

    // Validação básica
    if (!userData.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    // Prompt personalizado para Criador de Sonhos
    const prompt = `
# Gerador de Sonhos - Transformação do Estilo de Vida Familiar

Baseado nos dados da família abaixo, crie um relatório inspirador com 3 cenários de transformação de vida:

## Dados da Família:
- Nome: ${userData.fullName || 'Não informado'}
- Email: ${userData.email}
- Idade: ${userData.age || 'Não informado'}
- Profissão: ${userData.profession || 'Não informado'}
- Estado Civil: ${userData.maritalStatus || 'Não informado'}
- Filhos: ${userData.children || 'Não informado'}
- Orçamento: ${userData.budget || 'Não informado'}
- Objetivos: ${userData.goals || 'Não informado'}
- Interesses: ${userData.interests || 'Não informado'}

## Estrutura do Relatório:

### 1. VISÃO INSPIRADORA
Crie um cenário inspirador de como a família estará daqui a 5 anos.

### 2. MAPEAMENTO DOS SONHOS FAMILIARES
Identifique sonhos individuais e familiares baseados no perfil.

### 3. TRÊS CENÁRIOS DE TRANSFORMAÇÃO
Para cada cenário, inclua:
- Nome inspirador do estilo de vida
- Localização sugerida
- Descrição da nova vida
- Crescimento pessoal, acadêmico e profissional
- Investimento necessário
- Timeline de implementação
- Primeiros passos práticos

Seja inspirador, prático e específico. Use linguagem calorosa e motivadora.
`;

    // Chamada para OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em planejamento de vida e transformação familiar. Crie relatórios inspiradores e práticos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    console.log('📝 Tentando salvar na tabela criador_sonhos...');
    console.log('user_id:', userData.userId);
    console.log('email:', userData.email);

    // Salvar na tabela criador_sonhos
    const { data: reportData, error: reportError } = await supabase
      .from('criador_sonhos')
      .insert([
        {
          user_id: userData.userId || null,
          data: {
            input_data: userData,
            ai_response: aiResponse,
            prompt_used: prompt,
            model: "gpt-4",
            tokens_used: completion.usage?.total_tokens || 0,
            generated_at: new Date().toISOString()
          }
        }
      ])
      .select()
      .single();

    if (reportError) {
      console.error('❌ Erro detalhado ao salvar criador_sonhos:', reportError);
      console.error('❌ Código do erro:', reportError.code);
      console.error('❌ Mensagem:', reportError.message);
      console.error('❌ Detalhes:', reportError.details);
      
      // Tentar salvar só na user_reports como fallback
      console.log('🔄 Tentando salvar apenas na user_reports...');
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_reports')
          .insert([
            {
              user_id: userData.email,
              tool_type: 'criador_sonhos',
              input_data: userData,
              ai_response: aiResponse
            }
          ])
          .select()
          .single();

        if (fallbackError) {
          console.error('❌ Erro também na user_reports:', fallbackError);
          return NextResponse.json({ 
            error: 'Erro ao salvar relatório',
            details: `criador_sonhos: ${reportError.message}, user_reports: ${fallbackError.message}`
          }, { status: 500 });
        }

        console.log('✅ Salvo com sucesso na user_reports como fallback');
        return NextResponse.json({
          success: true,
          report: aiResponse,
          reportId: fallbackData.id,
          tokensUsed: completion.usage?.total_tokens || 0,
          warning: 'Salvo apenas na tabela user_reports'
        });
        
      } catch (fallbackErr) {
        console.error('❌ Erro crítico no fallback:', fallbackErr);
        return NextResponse.json({ 
          error: 'Erro crítico ao salvar relatório',
          details: reportError.message
        }, { status: 500 });
      }
    }

    console.log('✅ Salvo com sucesso na criador_sonhos');

    // Também salvar na tabela user_reports para histórico geral
    try {
      await supabase
        .from('user_reports')
        .insert([
          {
            user_id: userData.email,
            tool_type: 'criador_sonhos',
            input_data: userData,
            ai_response: aiResponse
          }
        ]);
      console.log('✅ Salvo também na user_reports');
    } catch (userReportError) {
      console.warn('⚠️ Erro ao salvar na user_reports (não crítico):', userReportError);
    }

    return NextResponse.json({
      success: true,
      report: aiResponse,
      reportId: reportData.id,
      tokensUsed: completion.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Erro no Criador de Sonhos:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Endpoint para buscar relatórios existentes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const reportId = searchParams.get('id');

    if (reportId) {
      // Buscar relatório específico
      const { data, error } = await supabase
        .from('criador_sonhos')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
      }

      return NextResponse.json({ report: data });
    }

    if (email) {
      // Tentar primeiro na tabela criador_sonhos
      let { data: criadorData, error: criadorError } = await supabase
        .from('criador_sonhos')
        .select('*')
        .eq('data->input_data->>email', email)
        .order('created_at', { ascending: false });
      
      // Se não encontrar, buscar na user_reports
      let { data: userReportsData, error: userReportsError } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', email)
        .in('tool_type', ['criador_sonhos', 'criador_de_sonhos'])
        .order('created_at', { ascending: false });

      // Combinar os resultados
      const allReports = [
        ...(criadorData || []).map(report => ({
          id: report.id,
          user_id: email,
          tool_type: 'criador_sonhos',
          input_data: report.data?.input_data || {},
          ai_response: report.data?.ai_response || '',
          created_at: report.created_at
        })),
        ...(userReportsData || [])
      ];

      if (criadorError && userReportsError) {
        return NextResponse.json({ error: 'Erro ao buscar relatórios' }, { status: 500 });
      }

      return NextResponse.json({ reports: allReports });
    }

    return NextResponse.json({ error: 'Email ou ID do relatório é obrigatório' }, { status: 400 });

  } catch (error) {
    console.error('Erro ao buscar relatórios:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
