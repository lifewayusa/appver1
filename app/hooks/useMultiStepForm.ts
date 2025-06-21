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
      // Tentar carregar dados salvos do localStorage
      const savedData = localStorage.getItem('lifewayusa_form_data')
      let loadedData = initialFormData

      if (savedData) {
        loadedData = { ...initialFormData, ...JSON.parse(savedData) }
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

      // Salvar no localStorage
      localStorage.setItem('lifewayusa_form_data', JSON.stringify(updatedData))
      
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
