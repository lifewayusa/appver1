import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const openaiApiKey = process.env.OPENAI_API_KEY
const openaiUrl = 'https://api.openai.com/v1/chat/completions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()
    const { user_id, ...prospectData } = formData

    // Criar ou atualizar prospect
    let prospectId = prospectData.id
    if (!prospectId) {
      // Criar novo prospect
      const { data: newProspect, error: createError } = await supabase
        .from('prospects')
        .insert({
          user_id: user_id || null,
          ...prospectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Erro ao criar prospect' }, { status: 500 })
      }
      prospectId = newProspect.id
    } else {
      // Atualizar prospect existente
      const { error: updateError } = await supabase
        .from('prospects')
        .update({
          ...prospectData,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospectId)

      if (updateError) {
        return NextResponse.json({ error: 'Erro ao atualizar prospect' }, { status: 500 })
      }
    }

    // Gerar análise inicial com OpenAI
    const prompt = `
    Baseado no perfil do usuário:
    - Nome: ${prospectData.nome || 'Não informado'}
    - Idade: ${prospectData.idade || 'Não informado'}
    - Estado Civil: ${prospectData.estado_civil || 'Não informado'}
    - Profissão: ${prospectData.profissao || 'Não informado'}
    - Escolaridade: ${prospectData.escolaridade || 'Não informado'}
    - Renda Mensal: ${prospectData.renda_mensal || 'Não informado'}
    - Objetivo: ${prospectData.objetivo_mudanca || 'Não informado'}
    - Cidades de interesse: ${prospectData.cidades_interesse?.join(', ') || 'Não informado'}
    - Possui filhos: ${prospectData.possui_filhos ? 'Sim' : 'Não'}
    - Já visitou EUA: ${prospectData.ja_visitou_eua ? 'Sim' : 'Não'}
    
    Crie um resumo motivacional e uma análise inicial do "sonho americano" desta pessoa, destacando:
    1. Pontos fortes do perfil
    2. Desafios a considerar
    3. Cidades que podem ser adequadas
    4. Próximos passos recomendados
    
    Seja motivacional, mas realista. Limite a 300 palavras.
    `

    const openaiRes = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um consultor especializado em imigração para os EUA, motivacional e realista.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500
      })
    })

    const openaiJson = await openaiRes.json()
    const analise = openaiJson.choices?.[0]?.message?.content || 'Análise não disponível no momento.'

    // Salvar análise no prospect
    await supabase
      .from('prospects')
      .update({ 
        analise_criador_sonhos: analise,
        updated_at: new Date().toISOString()
      })
      .eq('id', prospectId)

    return NextResponse.json({ 
      success: true, 
      prospectId, 
      analise,
      message: 'Formulário processado com sucesso!' 
    })

  } catch (error) {
    console.error('Erro no processamento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
