import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const openaiApiKey = process.env.OPENAI_API_KEY
const openaiUrl = 'https://api.openai.com/v1/chat/completions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Gerenciamento de sessões em memória (em produção, usar Redis)
const sessions = new Map()

export async function POST(req: NextRequest) {
  try {
    const { prospectId, followUpQuestion } = await req.json()
    
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

    // Gerenciar sessão
    let sessionKey = `visa_${prospectId}`
    let session = sessions.get(sessionKey)
    
    if (!session) {
      session = {
        threadId: `thread_${Date.now()}_${prospectId}`,
        clientId: prospectId,
        createdAt: new Date(),
        lastActivity: new Date(),
        messageCount: 0,
        history: []
      }
      sessions.set(sessionKey, session)
    }

    session.lastActivity = new Date()
    session.messageCount++

    let prompt = ''
    
    if (followUpQuestion) {
      // Follow-up question
      prompt = `Pergunta adicional do cliente: ${followUpQuestion}
      
      Contexto da conversa anterior: ${session.history.slice(-2).map(h => h.content).join('\n')}
      
      Responda de forma específica e detalhada.`
    } else {
      // Análise inicial
      prompt = `
      PERFIL DO CLIENTE PARA CONSULTORIA DE VISTO AMERICANO:
      
      📋 DADOS PESSOAIS:
      - Nome: ${prospect.nome || 'Não informado'}
      - Idade: ${prospect.idade || 'Não informado'}
      - Nacionalidade: Brasileiro(a)
      - Estado Civil: ${prospect.estado_civil || 'Não informado'}
      - Possui filhos: ${prospect.possui_filhos ? 'Sim' : 'Não'}
      - Escolaridade: ${prospect.escolaridade || 'Não informado'}
      
      💼 DADOS PROFISSIONAIS:
      - Profissão: ${prospect.profissao || 'Não informado'}
      - Ocupação atual: ${prospect.ocupacao_atual || 'Não informado'}
      - Anos de experiência: ${prospect.anos_experiencia || 'Não informado'}
      - Renda mensal: ${prospect.renda_mensal || 'Não informado'}
      - Possui empresa própria: ${prospect.empresa_propria ? 'Sim' : 'Não'}
      - Capital disponível: ${prospect.capital_disponivel || 'Não informado'}
      - Trabalhou no exterior: ${prospect.trabalhou_exterior ? 'Sim' : 'Não'}
      
      🎯 OBJETIVOS DE VIAGEM:
      - Propósito: ${prospect.objetivo_mudanca || 'Não informado'}
      - Duração pretendida: ${prospect.duracao_pretendida || 'Não informado'}
      - Já visitou EUA: ${prospect.ja_visitou_eua ? 'Sim' : 'Não'}
      - Possui patrocínio: ${prospect.possui_patrocinio ? 'Sim' : 'Não'}
      - Tipo de patrocínio: ${prospect.tipo_patrocinio || 'Não informado'}
      
      Como especialista em vistos americanos, forneça uma análise COMPLETA e PERSONALIZADA incluindo:
      
      1. 🎯 ANÁLISE DO PERFIL
      - Pontos fortes do candidato
      - Áreas de preocupação
      - Avaliação geral de elegibilidade
      
      2. 📋 RECOMENDAÇÕES ESPECÍFICAS
      - Tipos de visto mais adequados (com probabilidade de sucesso)
      - Justificativas detalhadas para cada recomendação
      - Alternativas caso o visto principal seja negado
      
      3. 📄 DOCUMENTAÇÃO NECESSÁRIA
      - Lista específica por tipo de visto recomendado
      - Documentos opcionais que fortalecem o caso
      - Certificações ou validações necessárias
      
      4. ⏰ TIMELINE REALISTA
      - Tempo de preparação necessário
      - Processamento esperado pelo USCIS
      - Marcos importantes do processo
      
      5. 🚀 PRÓXIMOS PASSOS
      - Ações imediatas a tomar
      - Preparação de documentos prioritários
      - Agendamentos necessários
      
      Seja detalhado, específico e baseado nas regulamentações atuais do USCIS. Use dados do perfil para personalizar completamente a resposta.
      `
    }

    // Chamar OpenAI
    const openaiRes = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um advogado especialista em imigração americana com 15 anos de experiência. Forneça consultorias detalhadas, precisas e baseadas nas leis atuais dos EUA. Sempre inclua disclaimers legais apropriados.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500
      })
    })

    const openaiJson = await openaiRes.json()
    const analise = openaiJson.choices?.[0]?.message?.content || 'Análise não disponível no momento.'

    // Adicionar à sessão
    session.history.push({
      type: followUpQuestion ? 'followup' : 'initial',
      question: followUpQuestion || 'Análise inicial',
      content: analise,
      timestamp: new Date()
    })

    // Salvar no banco apenas se for análise inicial
    if (!followUpQuestion) {
      await supabase
        .from('prospects')
        .update({ 
          analise_visamatch: analise,
          updated_at: new Date().toISOString()
        })
        .eq('id', prospectId)
    }

    // Formatar resposta profissional
    const formattedResponse = `
╔════════════════════════════════════════════════════════════════════════════════╗
║                           CONSULTORIA DE VISTO AMERICANO                      ║
║                              Relatório Personalizado                          ║
╚════════════════════════════════════════════════════════════════════════════════╝

📅 Data da Análise: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
🤖 Analisado por: LifeWayUSA AI Consultant
👤 Cliente: ${prospect.nome || 'Prospect'}
🆔 Sessão: ${session.threadId}

${analise}

───────────────────────────────────────────────────────────────────────────────

⚖️ DISCLAIMER LEGAL:
Esta análise é baseada em informações fornecidas e regulamentações gerais do USCIS. 
Não constitui aconselhamento jurídico formal. Recomenda-se consultar um advogado 
especializado em imigração para casos específicos.

💬 Para perguntas adicionais, use o botão "Fazer Pergunta" abaixo.
    `

    return NextResponse.json({ 
      success: true,
      analise: formattedResponse,
      threadId: session.threadId,
      sessionData: {
        messageCount: session.messageCount,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity
      }
    })

  } catch (error) {
    console.error('Erro na análise de visto:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
