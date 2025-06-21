'use client'

import { useUser } from '../../lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Briefcase } from 'lucide-react'

export default function GetOpportunityPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Redireciona para a página com o userId do usuário
      router.push(`/get-opportunity/${user.id}`)
    } else if (isLoaded && !user) {
      // Se não estiver logado, redireciona para começar a jornada
      router.push('/start-journey')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Get Opportunity</h1>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}
