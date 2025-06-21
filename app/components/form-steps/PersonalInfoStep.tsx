'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FormData } from '../../lib/types'

interface PersonalInfoStepProps {
  data: FormData
  onNext: (data: Partial<FormData>) => void
  onUpdate: (data: Partial<FormData>) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  saving: boolean
  isFirst: boolean
  isLast: boolean
}

export default function PersonalInfoStep({
  data,
  onNext,
  onUpdate,
  errors,
  setErrors,
  saving,
  isFirst,
  isLast
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    birthDate: data.birthDate || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    passport: data.passport || ''
  })

  const handleInputChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória'
    } else {
      const birthYear = new Date(formData.birthDate).getFullYear()
      const currentYear = new Date().getFullYear()
      const age = currentYear - birthYear
      if (age < 18) {
        newErrors.birthDate = 'Você deve ter pelo menos 18 anos'
      }
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório'
    }

    if (!formData.rg.trim()) {
      newErrors.rg = 'RG é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-baskerville mb-2">Dados Pessoais</h2>
        <p className="text-gray-600">
          Vamos começar com suas informações básicas para criar seu perfil.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Seu nome completo"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Nascimento *
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          {errors.cpf && (
            <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* RG */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RG *
          </label>
          <input
            type="text"
            value={formData.rg}
            onChange={(e) => handleInputChange('rg', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo ${
              errors.rg ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="00.000.000-0"
          />
          {errors.rg && (
            <p className="text-red-500 text-sm mt-1">{errors.rg}</p>
          )}
        </div>

        {/* Passaporte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do Passaporte
          </label>
          <input
            type="text"
            value={formData.passport}
            onChange={(e) => handleInputChange('passport', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
            placeholder="Número do passaporte (opcional)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Ter passaporte aumenta significativamente suas chances de qualificação
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div></div> {/* Espaço vazio pois é o primeiro step */}
        
        <button
          onClick={handleNext}
          disabled={saving}
          className="flex items-center space-x-2 bg-azul-petroleo text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          <span>{saving ? 'Salvando...' : 'Próximo'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
