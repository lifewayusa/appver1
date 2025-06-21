'use client'

import { useUser } from '../../lib/auth-context'
import { Star, Briefcase, FileText, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const { user } = useUser()

  const tools = [
    {
      id: 'criador-sonhos',
      title: 'Criador de Sonhos',
      description: 'Crie um perfil personalizado e descubra seu potencial nos EUA',
      icon: Star,
      color: 'from-green-400 to-green-600',
      features: [
        'Análise personalizada por IA',
        'Recomendações de cidades',
        'Avaliação de perfil',
        'Próximos passos'
      ],
      href: '/start-journey',
      cta: 'Começar Minha Jornada'
    },
    {
      id: 'get-opportunity',
      title: 'Get Opportunity',
      description: 'Descubra oportunidades profissionais e de negócios nos EUA',
      icon: Briefcase,
      color: 'from-blue-400 to-blue-600',
      features: [
        'Análise de mercado de trabalho',
        'Oportunidades de negócio',
        'Certificações recomendadas',
        'Setores em alta'
      ],
      href: '/get-opportunity',
      cta: 'Explorar Oportunidades'
    },
    {
      id: 'visa-match',
      title: 'VisaMatch',
      description: 'Consultoria especializada para encontrar seu visto ideal',
      icon: FileText,
      color: 'from-purple-400 to-purple-600',
      features: [
        'Análise de elegibilidade',
        'Recomendações de visto',
        'Timeline realista',
        'Documentação necessária'
      ],
      href: '/visa-match',
      cta: 'Consultar Visto'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-baskerville text-4xl text-white mb-4">
              🛠️ Ferramentas LifeWayUSA
            </h1>
            <p className="text-azul-claro text-xl max-w-3xl mx-auto">
              Três ferramentas poderosas para planejar sua jornada para os Estados Unidos. 
              Cada uma foi desenvolvida para uma etapa específica do seu processo.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className={`bg-gradient-to-r ${tool.color} p-6 text-white`}>
                    <Icon className="w-12 h-12 mb-4" />
                    <h2 className="font-baskerville text-2xl mb-2">{tool.title}</h2>
                    <p className="opacity-90">{tool.description}</p>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">✨ O que você vai obter:</h3>
                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      href={tool.href}
                      className={`bg-gradient-to-r ${tool.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow w-full flex items-center justify-center group`}
                    >
                      {tool.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Process Flow */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="font-baskerville text-2xl text-gray-800 mb-6 text-center">
              🚀 Processo Recomendado
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Criador de Sonhos</h3>
                <p className="text-gray-600 text-sm">
                  Comece criando seu perfil completo e recebendo uma análise inicial personalizada
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Get Opportunity</h3>
                <p className="text-gray-600 text-sm">
                  Explore oportunidades profissionais e de negócios baseadas no seu perfil
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">VisaMatch</h3>
                <p className="text-gray-600 text-sm">
                  Receba consultoria especializada sobre o visto ideal para seu caso
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href={user ? "/dashboard" : "/start-journey"}
              className="bg-white text-azul-petroleo px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              {user ? "Ver Meu Dashboard" : "Começar Agora"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
