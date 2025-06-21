'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '../../../lib/auth-context'
import GetOpportunityClient from '../../../components/tools/GetOpportunityClient'
import { ArrowLeft, Briefcase } from 'lucide-react'

export default function GetOpportunityPage() {
  const params = useParams()
  const { user } = useUser()
  const [prospectId, setProspectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.prospectId) {
      setProspectId(params.prospectId as string)
      setLoading(false)
    } else if (user) {
      // Se não tem prospectId na URL, buscar do usuário logado
      // Por enquanto, vamos usar um mock ou redirecionar para criar prospect
      setLoading(false)
    }
  }, [params, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!prospectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Briefcase className="w-16 h-16 text-azul-petroleo mx-auto mb-4" />
              <h1 className="font-baskerville text-2xl text-gray-800 mb-4">
                Analyze Your Opportunities
              </h1>
              <p className="text-gray-600 mb-6">
                Para acessar a análise de oportunidades, você precisa primeiro completar o seu perfil.
              </p>
              <a
                href="/start-journey"
                className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Criar Meu Perfil
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="text-white hover:text-azul-claro transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-baskerville text-3xl text-white mb-2">
                🚀 GetOpportunity
              </h1>
              <p className="text-azul-claro">
                Análise de oportunidades profissionais e empreendedoras nos EUA
              </p>
            </div>
          </div>

          {/* Tool Component */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="w-8 h-8 text-azul-petroleo mr-3" />
              <div>
                <h2 className="font-baskerville text-xl text-gray-800">
                  Análise de Oportunidades
                </h2>
                <p className="text-gray-600">
                  Baseado no seu perfil, vamos identificar as melhores oportunidades nos EUA
                </p>
              </div>
            </div>

            <GetOpportunityClient prospectId={prospectId} />

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📋 O que você vai descobrir:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ocupações em alta demanda na sua área</li>
                <li>• Setores econômicos compatíveis com seu perfil</li>
                <li>• Ideias de pequenos negócios promissores</li>
                <li>• Caminhos de certificação recomendados</li>
                <li>• Análise de mercado por região</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Voltar ao Dashboard
            </a>
            <a
              href="/get-opportunity/visa-analysis"
              className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-center"
            >
              Próximo: Análise de Visto
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
