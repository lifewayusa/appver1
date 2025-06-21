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

  const { data: prospect, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', prospectId)
    .single()
  if (error || !prospect) {
    return NextResponse.json({ error: 'Prospect não encontrado' }, { status: 404 })
  }

  const prompt = `Perfil profissional: ${prospect.profissao}, Escolaridade: ${prospect.escolaridade}, Experiência: ${prospect.anos_experiencia}, Habilidades: ${prospect.habilidades}, Certificações: ${prospect.certificacoes}, LinkedIn: ${prospect.linkedin_url}, Currículo: ${prospect.curriculum_text}.\nGere sugestões de oportunidades profissionais e empreendedoras nos EUA, setores em alta, ideias de negócio e recomendações de certificação.`

  const openaiRes = await fetch(openaiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um consultor de carreira e negócios nos EUA.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700
    })
  })
  const openaiJson = await openaiRes.json()
  const analise = openaiJson.choices?.[0]?.message?.content || 'Não foi possível gerar análise.'

  await supabase
    .from('prospects')
    .update({ analise_getopportunity: analise, updated_at: new Date().toISOString() })
    .eq('id', prospectId)

  return NextResponse.json({ analise })
}
