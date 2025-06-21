'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '../../../lib/auth-context'
import VisaMatchClient from '../../../components/tools/VisaMatchClient'
import { ArrowLeft, FileText, Shield } from 'lucide-react'

export default function VisaMatchPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!prospectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="font-baskerville text-2xl text-gray-800 mb-4">
                VisaMatch - Consultoria de Visto
              </h1>
              <p className="text-gray-600 mb-6">
                Para acessar a consultoria de visto, você precisa primeiro completar o seu perfil.
              </p>
              <a
                href="/start-journey"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-600 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="text-white hover:text-purple-200 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-baskerville text-3xl text-white mb-2">
                🛂 VisaMatch
              </h1>
              <p className="text-purple-100">
                Consultoria especializada em vistos americanos com IA
              </p>
            </div>
          </div>

          {/* Tool Component */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h2 className="font-baskerville text-xl text-gray-800">
                  Consultoria de Visto Americano
                </h2>
                <p className="text-gray-600">
                  Análise completa e personalizada baseada no seu perfil e objetivos
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-purple-50 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Análise Detalhada</h3>
                <p className="text-sm text-gray-600">
                  Recomendações específicas de visto baseadas no seu perfil completo
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-800 mb-1">Regulamentações Atuais</h3>
                <p className="text-sm text-gray-600">
                  Informações atualizadas do USCIS e melhores práticas
                </p>
              </div>
            </div>

            <VisaMatchClient prospectId={prospectId} />

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-gray-800 mb-2">⚖️ Disclaimer Legal</h3>
              <p className="text-sm text-gray-700">
                Esta análise é baseada em informações fornecidas e regulamentações gerais do USCIS. 
                Não constitui aconselhamento jurídico formal. Recomenda-se consultar um advogado 
                especializado em imigração para casos específicos.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Voltar ao Dashboard
            </a>
            <a
              href="/tools"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
            >
              Explorar Mais Ferramentas
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
