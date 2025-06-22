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
      // Salvar dados localmente sem chamar API
      const completedData = {
        ...formData,
        isCompleted: true,
        completedAt: new Date().toISOString()
      }
      
      localStorage.setItem('lifewayusa_form_data', JSON.stringify(completedData))
      
      // Simular um resultado baseado nos dados do formulário
      const mockResult = {
        success: true,
        message: 'Seu perfil foi criado com sucesso!',
        profile: {
          name: formData.fullName,
          profileType: formData.profileType,
          hasQualification: true
        },
        nextSteps: [
          'Explore oportunidades no dashboard',
          'Configure sua busca por cidades',
          'Analise opções de visto disponíveis'
        ]
      }
      
      setResult(mockResult)
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao salvar dados. Tente novamente.')
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
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="font-baskerville text-3xl text-gray-800 mb-2">
                  Seu Sonho Americano foi Criado!
                </h1>
                <p className="text-gray-600">
                  Baseado no seu perfil, criamos uma análise personalizada
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h2 className="font-semibold text-lg mb-3 text-gray-800">
                  🎯 Próximos Passos
                </h2>
                <div className="space-y-3">
                  {result.nextSteps.map((step: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Perfil: <span className="font-semibold text-azul-petroleo">{result.profile.name}</span> - {result.profile.profileType}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/dashboard"
                    className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Ver Dashboard Completo
                  </a>
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
