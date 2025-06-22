'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../../lib/auth-context'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signUp(email, password, name)
      router.push('/start-journey')
    } catch (error) {
      console.error('Erro no cadastro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-azul-petroleo focus:border-azul-petroleo"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-azul-petroleo focus:border-azul-petroleo"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-azul-petroleo focus:border-azul-petroleo"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-azul-petroleo hover:bg-azul-claro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-azul-petroleo disabled:opacity-50"
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/sign-in" className="text-azul-petroleo hover:text-azul-claro">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  )
}
