"use client"
import { useState } from 'react'
import { MessageCircle, FileText } from 'lucide-react'

interface SessionData {
  threadId: string
  messageCount: number
  createdAt: string
  lastActivity: string
}

export default function VisaMatchClient({ prospectId }: { prospectId: string }) {
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [followUpQuestion, setFollowUpQuestion] = useState('')
  const [isFollowUp, setIsFollowUp] = useState(false)

  const handleGerarAnalise = async () => {
    setLoading(true)
    setError(null)
    setAnalise(null)
    setIsFollowUp(false)
    
    try {
      // Simular análise de visto baseada no perfil
      const savedData = localStorage.getItem('lifewayusa_form_data')
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular processamento
      
      const analise = `📋 **Análise de Visto Personalizada**

**VISTOS RECOMENDADOS PARA SEU PERFIL:**

🎯 **EB-5 (Investidor)** - ALTA COMPATIBILIDADE
• Investimento: $800k-1M
• Tempo: 2-3 anos
• Benefícios: Green Card direto para família

💼 **L-1 (Transferência Intraempresa)**
• Para empresários com negócio no Brasil
• Tempo: 1-2 anos para Green Card
• Permite abertura de filial nos EUA

🎓 **F-1 → H-1B → Green Card**
• Via educação/especialização
• Tempo: 3-6 anos total
• Ideal para profissionais qualificados

👥 **IR/CR (Reunião Familiar)**
• Se tiver familiares americanos
• Tempo: 1-2 anos
• Mais rápido e econômico

**PRÓXIMOS PASSOS:**
1. ✅ Avaliação detalhada do seu caso
2. 📄 Preparação da documentação
3. 🏛️ Assessoria jurídica especializada
4. 📅 Cronograma personalizado

**Recomendação:** Agende uma consultoria gratuita para análise aprofundada! 🇺🇸`
      
      setAnalise(analise)
      setSessionData({
        threadId: 'local-session-' + Date.now(),
        messageCount: 1,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      })
    } catch (e) {
      setError('Erro ao processar análise')
    } finally {
      setLoading(false)
    }
  }

  const handleFollowUpQuestion = async () => {
    if (!followUpQuestion.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      // Simular resposta para pergunta de follow-up
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const responses = [
        `📝 **Resposta sobre ${followUpQuestion.trim()}:**

Com base na sua pergunta, aqui estão informações adicionais:

• Para mais detalhes sobre prazos e custos, recomendo uma consultoria personalizada
• Cada caso tem particularidades que influenciam o processo
• Nossa equipe pode fornecer orientação específica para sua situação
• Documentação necessária varia conforme o tipo de visto escolhido

💡 **Dica:** Agende uma consulta gratuita para esclarecimentos detalhados!`,

        `🎯 **Sobre sua dúvida "${followUpQuestion.trim()}":**

Excelente pergunta! Aqui está uma orientação:

• Processo de visto pode variar de 6 meses a 3 anos
• Custos incluem taxas governamentais + assessoria jurídica
• Alguns vistos permitem trabalho imediato, outros têm restrições
• Planejamento antecipado é fundamental para o sucesso

📞 **Próximo passo:** Consultoria detalhada com nossa equipe especializada!`
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setAnalise(randomResponse)
      setSessionData(prev => prev ? {
        ...prev,
        messageCount: prev.messageCount + 1,
        lastActivity: new Date().toISOString()
      } : null)
      setFollowUpQuestion('')
      setIsFollowUp(true)
    } catch (e) {
      setError('Erro ao processar pergunta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-azul-petroleo mr-3" />
        <div>
          <h3 className="font-baskerville text-xl">VisaMatch</h3>
          <p className="text-gray-600 text-sm">Consultoria especializada em vistos americanos</p>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">
        Descubra qual visto é ideal para seu perfil e receba recomendações detalhadas baseadas nas regulamentações atuais do USCIS.
      </p>

      {!analise && (
        <button
          onClick={handleGerarAnalise}
          disabled={loading}
          className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 mb-4 flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          {loading ? 'Gerando análise...' : 'Iniciar Consultoria de Visto'}
        </button>
      )}

      {analise && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">📋 Consultoria de Visto</h4>
              {sessionData && (
                <span className="text-xs text-gray-500">
                  Sessão: {sessionData.messageCount} mensagens
                </span>
              )}
            </div>
            <div className="whitespace-pre-line text-gray-800 text-sm leading-relaxed">
              {analise}
            </div>
          </div>

          {/* Follow-up Questions */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-3">
              <MessageCircle className="w-5 h-5 text-azul-petroleo mr-2" />
              <span className="font-medium text-gray-800">Tem alguma pergunta adicional?</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                placeholder="Ex: Quanto tempo demora o processo do H1B?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-azul-petroleo focus:border-transparent"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleFollowUpQuestion()}
              />
              <button
                onClick={handleFollowUpQuestion}
                disabled={loading || !followUpQuestion.trim()}
                className="bg-azul-petroleo text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {loading ? 'Enviando...' : 'Perguntar'}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              💡 Você pode fazer quantas perguntas quiser na mesma sessão
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Erro:</strong> {error}
        </div>
      )}
    </div>
  )
}
