import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const openaiApiKey = process.env.OPENAI_API_KEY
const openaiUrl = 'https://api.openai.com/v1/chat/completions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { prospectId } = await req.json()
  if (!prospectId) {
    return NextResponse.json({ error: 'prospectId obrigatório' }, { status: 400 })
  }

  // Buscar dados do prospect
  const { data: prospect, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .single()
  if (error || !prospect) {
    return NextResponse.json({ error: 'Prospect não encontrado' }, { status: 404 })
  }

  // Montar prompt para OpenAI
  const prompt = `Usuário: ${prospect.fullName || prospect.nome}\nPerfil: ${prospect.profileType}\nObjetivo: ${prospect.objetivo_eua || ''}\nDados familiares: ${JSON.stringify(prospect.filhos || {})}\nResumo VisaMatch: ${prospect.analise_visamatch || ''}\nResumo FamilyPlanner: ${prospect.analise_familyplanner || ''}\nGere um plano detalhado de mudança para os EUA, com etapas, prazos e recomendações personalizadas.`

  try {
    const openaiRes = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um consultor de imigração e planejamento de mudança para os EUA.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 900
      })
    })
    const data = await openaiRes.json()
    const plano = data.choices?.[0]?.message?.content || 'Não foi possível gerar o plano.'

    // Salvar output no prospect
    await supabase
      .from('prospects')
      .update({ plano_projectusa_output: plano })
      .eq('id', prospectId)

    return NextResponse.json({ plano })
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao gerar plano com IA.' }, { status: 500 })
  }
}
