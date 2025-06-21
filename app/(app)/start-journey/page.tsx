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
      const response = await fetch('/api/tools/criador-sonhos/process-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id || null,
          ...formData
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Erro ao processar formulário')
      }
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro de conexão. Tente novamente.')
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
                  📋 Sua Análise Personalizada
                </h2>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700">
                    {result.analise}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Prospect ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{result.prospectId}</span>
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
