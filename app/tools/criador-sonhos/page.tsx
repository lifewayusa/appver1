'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../lib/auth-context'
import TemplatePages from '../../components/TemplatePages'

export default function CriadorSonhosPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!user) {
      // Redirecionar para login com redirect de volta
      router.push('/sign-in?redirect=/tools/criador-sonhos')
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
        title="Criador de Sonhos"
        subtitle="Faça login para começar a criar seu sonho americano"
        ctaText="Fazer Login"
        ctaHref="/sign-in"
      >
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">
            Para usar o Criador de Sonhos, você precisa estar logado.
          </p>
          <p className="text-sm text-gray-500">
            O Criador de Sonhos irá te ajudar a descobrir como seria viver nos EUA 
            e planeje toda sua jornada de imigração personalizada.
          </p>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="Criador de Sonhos"
      subtitle="Redirecionando para seu sonho americano..."
      ctaText="Aguarde"
      ctaHref="#"
    >
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul-petroleo mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">
          Preparando sua experiência personalizada...
        </p>
      </div>
    </TemplatePages>
  )
}
