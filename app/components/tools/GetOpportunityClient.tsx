"use client"
import { useState } from 'react'

export default function GetOpportunityClient({ prospectId }: { prospectId: string }) {
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGerarAnalise = async () => {
    setLoading(true)
    setError(null)
    setAnalise(null)
    
    try {
      // Simular análise de oportunidades baseada no perfil
      const savedData = localStorage.getItem('lifewayusa_form_data')
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simular processamento
      
      const analise = `💼 **Oportunidades Personalizadas para Você**

**CARREIRAS EM ALTA:**
• Tecnologia: Desenvolvedor de Software ($85k-150k/ano)
• Saúde: Enfermeiro Registrado ($70k-100k/ano)
• Engenharia: Engenheiro Civil ($75k-120k/ano)
• Educação: Professor Especializado ($60k-90k/ano)

**OPORTUNIDADES DE NEGÓCIO:**
• Franchising (investimento: $50k-200k)
• E-commerce e Dropshipping
• Serviços de Consultoria
• Food Truck/Restaurante

**REGIÕES RECOMENDADAS:**
• Texas: Baixo custo, economia forte
• Flórida: Sem imposto estadual, turismo
• Carolina do Norte: Tech hub emergente
• Arizona: Crescimento populacional

**PRÓXIMOS PASSOS:**
1. ✅ Complete seu perfil no formulário
2. 📋 Use o VisaMatch para encontrar o visto ideal
3. 📞 Agende consultoria especializada
4. 💰 Avalie opções de financiamento

Entre em contato para uma análise detalhada! 🚀`
      
      setAnalise(analise)
    } catch (e) {
      setError('Erro ao processar análise')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 my-6">
      <h3 className="font-baskerville text-xl mb-2">GetOpportunity</h3>
      <p className="text-gray-600 mb-4">Descubra oportunidades profissionais e empreendedoras nos EUA com base no seu perfil.</p>
      <button
        onClick={handleGerarAnalise}
        disabled={loading}
        className="bg-azul-petroleo text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 mb-4"
      >
        {loading ? 'Gerando...' : 'Gerar Oportunidades'}
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
