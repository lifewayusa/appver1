"use client"
import { useState } from 'react'

export default function CriadorSonhosClient({ prospectId }: { prospectId: string }) {
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGerarAnalise = async () => {
    setLoading(true)
    setError(null)
    setAnalise(null)
    
    try {
      // Simular processamento do sonho baseado nos dados do formulário
      const savedData = localStorage.getItem('lifewayusa_form_data')
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular processamento
      
      if (savedData) {
        const formData = JSON.parse(savedData)
        const analise = `🌟 **Seu Sonho Americano Personalizado**

Com base nas informações fornecidas, aqui está sua análise personalizada:

**Perfil:** ${formData.objetivo || 'Não especificado'}
**Experiência:** ${formData.experiencia || 'A definir'}
**Investimento Disponível:** ${formData.investimento || 'A avaliar'}

**Recomendações Personalizadas:**
• Explorar oportunidades em sua área de interesse
• Considerar programas de visto adequados ao seu perfil
• Avaliar custos de vida nas regiões de interesse
• Planejar cronograma de imigração

**Próximos Passos:**
1. Usar nossa ferramenta "Get Opportunity" para explorar carreiras
2. Consultar "Visa Match" para encontrar o visto ideal
3. Agendar consultoria personalizada com nossa equipe

Seu sonho está mais próximo do que imagina! 🇺🇸`
        
        setAnalise(analise)
      } else {
        setAnalise('Para uma análise personalizada, complete primeiro o formulário na seção "Criar Meu Sonho".')
      }
    } catch (e) {
      setError('Erro ao processar análise')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <h3 className="font-baskerville text-xl mb-2">Criador de Sonhos</h3>
      <p className="text-gray-600 mb-4">Gere um resumo personalizado do seu sonho americano e recomendações iniciais.</p>
      <button
        onClick={handleGerarAnalise}
        disabled={loading}
        className="bg-azul-petroleo text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 mb-4"
      >
        {loading ? 'Gerando...' : 'Gerar Análise'}
      </button>
      {analise && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold mb-2">Resultado:</h4>
          <div className="whitespace-pre-line text-gray-800">{analise}</div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}
    </div>
  )
}
