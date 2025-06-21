'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoaded: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simular carregamento inicial
    const savedUser = localStorage.getItem('lifeway-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoaded(true)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulação de login
    const mockUser = {
      id: 'user-123',
      email,
      name: email.split('@')[0]
    }
    setUser(mockUser)
    localStorage.setItem('lifeway-user', JSON.stringify(mockUser))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Simulação de cadastro
    const mockUser = {
      id: 'user-' + Date.now(),
      email,
      name
    }
    setUser(mockUser)
    localStorage.setItem('lifeway-user', JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('lifeway-user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoaded, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useUser() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useUser deve ser usado dentro de AuthProvider')
  }
  return context
}
