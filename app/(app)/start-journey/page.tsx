'use client'

import { useEffect, useState } from 'react'
import { useUser } from '../../lib/auth-context'
import { CheckCircle } from 'lucide-react'
import MultiStepForm from '../../components/MultiStepForm'
import { FormData } from '../../lib/types'

export default function StartJourneyPage() {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Enviar dados para a API que irá gerar análise personalizada
      const response = await fetch('/api/form/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: user?.email || formData.email,
          form_data: formData,
          is_completed: true,
          qualify: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setResult({
          success: true,
          dreamAnalysis: result.dreamAnalysis,
          message: result.message,
          profile: {
            name: formData.fullName,
            profileType: formData.profileType,
            hasQualification: true
          }
        });
      } else {
        throw new Error(result.error || 'Erro ao processar dados');
      }
    } catch (err) {
      console.error('Erro:', err)
      setError(`Erro ao processar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azul-claro to-azul-petroleo pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="font-baskerville text-3xl text-gray-800 mb-2">
                  🌟 Seu Sonho Americano Personalizado
                </h1>
                <p className="text-gray-600">
                  {result.message || 'Baseado no seu perfil, criamos uma análise personalizada'}
                </p>
              </div>

              <div className="prose max-w-none">
                {result.dreamAnalysis ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                      🎯 Sua Análise Personalizada
                    </h2>
                    <div 
                      className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: result.dreamAnalysis.replace(/\n/g, '<br />') 
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      Análise em Processamento
                    </h3>
                    <p className="text-yellow-700">
                      Sua análise personalizada está sendo gerada. Isso pode levar alguns momentos.
                      Atualize a página em alguns instantes para ver o resultado completo.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Próximos Passos Recomendados:
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🎯 Get Opportunity
                    </h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Descubra oportunidades específicas para seu perfil
                    </p>
                    <a
                      href="/tools/get-opportunity"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Explorar →
                    </a>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      📋 Visa Match
                    </h4>
                    <p className="text-green-700 text-sm mb-3">
                      Encontre o tipo de visto ideal para você
                    </p>
                    <a
                      href="/tools/visa-match"
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Analisar →
                    </a>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      📊 Dashboard
                    </h4>
                    <p className="text-purple-700 text-sm mb-3">
                      Acompanhe seu progresso e planejamento
                    </p>
                    <a
                      href="/dashboard"
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Acessar →
                    </a>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setResult(null);
                      setError(null);
                    }}
                    className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Criar Novo Perfil
                  </button>
                  <a
                    href="/tools"
                    className="border-2 border-azul-petroleo text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-azul-petroleo hover:text-white transition-colors"
                  >
                    Explorar Mais Ferramentas
                  </a>
                </div>
              </div>
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
          <div className="text-center mb-8">
            <h1 className="font-baskerville text-4xl text-white mb-4">
              🌟 Criador de Sonhos
            </h1>
            <p className="text-azul-claro text-lg">
              Conte-nos sobre você e vamos criar juntos o seu sonho americano personalizado
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg">
            <MultiStepForm 
              onComplete={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
