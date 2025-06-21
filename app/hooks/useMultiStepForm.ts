'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FormData } from '../lib/types'
import { calculateQualification } from '../lib/qualification'
import { useUser } from '../lib/user-context'

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Carregar dados salvos do Supabase ao montar o componente
  useEffect(() => {
    if (user) {
      loadFormData()
    }
  }, [user])

  const loadFormData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile && !error) {
        setFormData({
          ...initialFormData,
          ...{
            fullName: profile.full_name || '',
            email: user.email || '',
            birthDate: profile.birth_date || '',
            cpf: profile.cpf || '',
            rg: profile.rg || '',
            passport: profile.passport || '',
            profileType: profile.profile_type || '',
            maritalStatus: profile.marital_status || '',
            spouse: profile.spouse ? JSON.parse(profile.spouse) : undefined,
            children: profile.children || [],
            education: profile.education ? JSON.parse(profile.education) : undefined,
            englishLevel: profile.english_level || '',
            profession: profile.profession || '',
            experience: profile.years_experience ? Number(profile.years_experience) : undefined,
            currentSalary: profile.current_salary,
            skills: profile.skills || [],
            usaObjectives: profile.usa_objectives || [],
            targetStates: profile.target_states || [],
            timeline: profile.timeline || '',
            currentSavings: profile.current_savings,
            monthlyIncome: profile.monthly_income,
            investmentCapacity: profile.investment_capacity,
            currentStep: profile.current_step || 1,
            isCompleted: profile.is_completed || false,
            qualify: profile.qualify || false
          }
        })
      } else {
        setFormData({
          ...initialFormData,
          email: user.email || '',
          fullName: user.user_metadata?.full_name || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
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
      // Mapear campos do formulário para os campos da tabela 'profiles'
      const profilePayload: any = {
        user_id: user.id,
        full_name: updatedData.fullName,
        birth_date: updatedData.birthDate,
        cpf: updatedData.cpf,
        rg: updatedData.rg,
        passport: updatedData.passport,
        profile_type: updatedData.profileType,
        marital_status: updatedData.maritalStatus,
        spouse: updatedData.spouse ? JSON.stringify(updatedData.spouse) : null,
        children: updatedData.children ? updatedData.children : null,
        education: updatedData.education ? JSON.stringify(updatedData.education) : null,
        english_level: updatedData.englishLevel,
        profession: updatedData.profession,
        years_experience: updatedData.experience ? String(updatedData.experience) : null,
        current_salary: updatedData.currentSalary,
        skills: updatedData.skills,
        usa_objectives: updatedData.usaObjectives,
        target_states: updatedData.targetStates,
        timeline: updatedData.timeline,
        current_savings: updatedData.currentSavings,
        monthly_income: updatedData.monthlyIncome,
        investment_capacity: updatedData.investmentCapacity,
        current_step: updatedData.currentStep,
        is_completed: updatedData.isCompleted,
        qualify: updatedData.qualify,
        updated_at: new Date().toISOString()
      }
      const { error } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'user_id' })
      if (error) throw error
      setFormData(updatedData)
      return true
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
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
