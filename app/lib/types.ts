// Types for the MultiStepForm
export interface FormData {
  // Dados pessoais
  fullName: string
  email: string
  birthDate: string
  cpf: string
  rg: string
  passport?: string
  
  // Perfil
  profileType: 'family' | 'student' | 'professional' | ''
  
  // Dados familiares (se profileType === 'family')
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | ''
  spouse?: {
    name: string
    birthDate: string
    education: string
    profession: string
  }
  children?: Array<{
    name: string
    birthDate: string
    education: string
  }>
  
  // Dados acadêmicos (se profileType === 'student')
  education?: {
    level: 'high_school' | 'undergraduate' | 'graduate' | 'postgraduate' | ''
    institution: string
    course: string
    gpa?: number
  }
  englishLevel?: 'basic' | 'intermediate' | 'advanced' | 'fluent' | ''
  
  // Dados profissionais (se profileType === 'professional')
  profession?: string
  experience?: number
  currentSalary?: number
  skills?: string[]
  
  // Objetivos nos EUA
  usaObjectives?: string[]
  targetStates?: string[]
  timeline?: '6months' | '1year' | '2years' | '3years+' | ''
  freeFormAspirations?: string
  
  // Situação financeira
  currentSavings?: number
  monthlyIncome?: number
  investmentCapacity?: number
  
  // Status do formulário
  currentStep: number
  isCompleted: boolean
  qualify?: boolean
}

export interface FormStep {
  id: number
  title: string
  description: string
  fields: string[]
  validation: (data: Partial<FormData>) => boolean
  isConditional?: boolean
  condition?: (data: Partial<FormData>) => boolean
}
