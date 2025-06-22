'use client'

import { useState, useEffect } from 'react'
import { FormData } from '../lib/types'
import { calculateQualification } from '../lib/qualification'
import { useUser } from '../lib/auth-context'

const initialFormData: FormData = {
  fullName: '',
  email: '',
  birthDate: '',
  cpf: '',
  rg: '',
  passport: '',
  profileType: '',
  currentStep: 1,
  isCompleted: false
}

export function useMultiStepForm() {
  const { user } = useUser()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Carregar dados do usuário Clerk e localStorage quando disponível
  useEffect(() => {
    if (user) {
      loadFormData()
    }
  }, [user])

  const loadFormData = async () => {
    setLoading(true)
    try {
      let loadedData = initialFormData

      // Tentar carregar dados salvos do banco se tiver usuário
      if (user?.email) {
        try {
          const response = await fetch(`/api/form/save-local?user_email=${encodeURIComponent(user.email)}`)
          const result = await response.json()
          
          if (result.success && result.data) {
            // Usar dados do banco como prioridade
            loadedData = { ...initialFormData, ...result.data.data }
            console.log('Dados carregados do arquivo local:', result.data)
          } else {
            console.log('Nenhum dado encontrado no arquivo local, tentando localStorage')
          }
        } catch (error) {
          console.error('Erro ao carregar dados do arquivo local:', error)
        }
      }

      // Se não carregou do banco, tentar localStorage
      if (loadedData === initialFormData) {
        const savedData = localStorage.getItem('lifewayusa_form_data')
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          loadedData = { ...initialFormData, ...parsedData }
          console.log('Dados carregados do localStorage')
        }
      }

      // Preencher com dados do usuário se disponível
      if (user) {
        loadedData = {
          ...loadedData,
          email: user.email || loadedData.email,
          fullName: user.name || loadedData.fullName
        }
      }

      setFormData(loadedData)
    } catch (error) {
      console.error('Error loading form data:', error)
      // Em caso de erro, usar dados do usuário se disponível
      if (user) {
        setFormData({
          ...initialFormData,
          email: user.email || '',
          fullName: user.name || ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const saveFormData = async (stepData: Partial<FormData>) => {
    setSaving(true)
    const updatedData = { ...formData, ...stepData }
    
    try {
      // Calcular qualificação se o formulário estiver completo
      if (updatedData.isCompleted) {
        updatedData.qualify = calculateQualification(updatedData)
      }

      // Salvar no localStorage (backup local)
      localStorage.setItem('lifewayusa_form_data', JSON.stringify(updatedData))
      
      // Salvar no banco de dados via API se tiver usuário
      if (user?.email) {
        const response = await fetch('/api/form/save-local', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_email: user.email,
            form_data: updatedData,
            is_completed: updatedData.isCompleted,
            qualify: updatedData.qualify
          })
        })

        const result = await response.json()
        
        if (!result.success) {
          console.error('Erro ao salvar no banco:', result.error)
          // Continua mesmo com erro do banco, pois já salvou no localStorage
        } else {
          console.log('Dados salvos no arquivo local com sucesso')
        }
      }
      
      setFormData(updatedData)
      console.log('Form data saved successfully')
      return true
    } catch (error) {
      console.error('Error saving form data:', error)
      return false
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const nextStep = async (stepData: Partial<FormData>) => {
    const success = await saveFormData({
      ...stepData,
      currentStep: formData.currentStep + 1
    })
    return success
  }

  const prevStep = () => {
    setFormData(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1)
    }))
  }

  const completeForm = async (finalData: Partial<FormData>) => {
    return await saveFormData({
      ...finalData,
      isCompleted: true,
      currentStep: formData.currentStep
    })
  }

  return {
    formData,
    loading,
    saving,
    updateFormData,
    saveFormData,
    nextStep,
    prevStep,
    completeForm,
    loadFormData
  }
}
