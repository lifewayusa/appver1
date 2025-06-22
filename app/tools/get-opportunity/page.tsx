'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../lib/auth-context'
import TemplatePages from '../../components/TemplatePages'

export default function GetOpportunityPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!user) {
      // Redirecionar para login com redirect de volta
      router.push('/sign-in?redirect=/tools/get-opportunity')
      return
    }

    // Se logado, verificar se já completou o formulário
    const savedData = localStorage.getItem('lifewayusa_form_data')
    if (savedData) {
      const formData = JSON.parse(savedData)
      if (formData.isCompleted) {
        // Se já completou, ir para o dashboard
        router.push('/dashboard')
        return
      }
    }

    // Se não completou, iniciar o formulário multi-step
    router.push('/start-journey')
  }, [user, router])

  if (!user) {
    return (
      <TemplatePages
        title="GetOpportunity"
        subtitle="Faça login para analisar suas oportunidades de trabalho"
        ctaText="Fazer Login"
        ctaHref="/sign-in"
      >
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">
            Para usar o GetOpportunity, você precisa estar logado.
          </p>
          <p className="text-sm text-gray-500">
            O GetOpportunity irá analisar oportunidades de trabalho baseadas no seu perfil profissional 
            e te ajudar a encontrar as melhores opções nos EUA.
          </p>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="GetOpportunity"
      subtitle="Redirecionando para análise de oportunidades..."
      ctaText="Aguarde"
      ctaHref="#"
    >
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-petroleo mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">
          Preparando análise das suas oportunidades...
        </p>
      </div>
    </TemplatePages>
  )
}
