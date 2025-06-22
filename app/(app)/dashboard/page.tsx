'use client'

import { useEffect, useState } from 'react'
import { useUser } from '../../lib/auth-context'
import { Star, Briefcase, FileText, Users, ArrowRight } from 'lucide-react'
import TemplatePages from '../../components/TemplatePages'
import CriadorSonhosClient from '../../components/tools/CriadorSonhosClient'
import GetOpportunityClient from '../../components/tools/GetOpportunityClient'
import VisaMatchClient from '../../components/tools/VisaMatchClient'

export default function DashboardPage() {
  const { user } = useUser()
  const [prospectId, setProspectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      setProspectId(user.id)
      
      // Carregar dados do formulário
      const savedData = localStorage.getItem('lifewayusa_form_data')
      if (savedData) {
        setFormData(JSON.parse(savedData))
      }
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <TemplatePages
        title="Dashboard"
        subtitle="Carregando seu painel personalizado..."
        ctaText="Aguarde"
        ctaHref="#"
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-petroleo mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </TemplatePages>
    )
  }

  if (!user) {
    return (
      <TemplatePages
        title="Dashboard"
        subtitle="Acesso restrito - faça login para continuar"
        ctaText="Fazer Login"
        ctaHref="/sign-in"
      >
        <div className="text-center py-8">
          <h3 className="text-xl font-baskerville text-gray-800 mb-4">
            Acesso Restrito
          </h3>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para acessar o dashboard.
          </p>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="Dashboard"
      subtitle={`Bem-vindo, ${user.name || 'Usuário'}! Seu painel personalizado para planejamento de imigração`}
      ctaText="Explorar Ferramentas"
      ctaHref="#tools"
    >
      <div id="tools" className="space-y-8">

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <a
              href="/start-journey"
              className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow group"
            >
              <Star className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">Criar Meu Sonho</h3>
              <p className="text-green-100 text-sm mb-3">
                Comece sua jornada criando um perfil personalizado
              </p>
              <div className="flex items-center text-sm">
                <span>Começar agora</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <a
              href={prospectId ? `/get-opportunity/${prospectId}` : '/start-journey'}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow group"
            >
              <Briefcase className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">Oportunidades</h3>
              <p className="text-blue-100 text-sm mb-3">
                Descubra carreiras e negócios promissores nos EUA
              </p>
              <div className="flex items-center text-sm">
                <span>Explorar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <a
              href={prospectId ? `/visa-match/${prospectId}` : '/start-journey'}
              className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow group"
            >
              <FileText className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">Visto Ideal</h3>
              <p className="text-purple-100 text-sm mb-3">
                Consultoria especializada para seu tipo de visto
              </p>
              <div className="flex items-center text-sm">
                <span>Consultar</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          {/* Tools Dashboard */}
          {prospectId && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h2 className="font-baskerville text-xl text-white flex items-center">
                    <Star className="w-6 h-6 mr-3" />
                    Criador de Sonhos
                  </h2>
                </div>
                <div className="p-6">
                  <CriadorSonhosClient prospectId={prospectId} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h2 className="font-baskerville text-xl text-white flex items-center">
                    <Briefcase className="w-6 h-6 mr-3" />
                    Get Opportunity
                  </h2>
                </div>
                <div className="p-6">
                  <GetOpportunityClient prospectId={prospectId} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                  <h2 className="font-baskerville text-xl text-white flex items-center">
                    <FileText className="w-6 h-6 mr-3" />
                    VisaMatch
                  </h2>
                </div>
                <div className="p-6">
                  <VisaMatchClient prospectId={prospectId} />
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Precisa de ajuda?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Nossa equipe está pronta para ajudar você em cada etapa da sua jornada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contato"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Falar com Especialista
              </a>
              <a
                href="/recursos-uteis"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors text-center"
              >
                Ver Recursos
              </a>
            </div>
          </div>
        </div>
      </TemplatePages>
    )
  }
