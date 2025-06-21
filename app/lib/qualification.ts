import { FormData } from './types'

export function calculateQualification(data: FormData): boolean {
  let score = 0
  
  // Pontuação por idade (20-35 anos = melhor pontuação)
  if (data.birthDate) {
    const age = new Date().getFullYear() - new Date(data.birthDate).getFullYear()
    if (age >= 20 && age <= 35) score += 3
    else if (age >= 18 && age <= 45) score += 2
    else score += 1
  }
  
  // Pontuação por educação
  if (data.education?.level) {
    switch (data.education.level) {
      case 'postgraduate': score += 4; break
      case 'graduate': score += 3; break
      case 'undergraduate': score += 2; break
      case 'high_school': score += 1; break
    }
  }
  
  // Pontuação por inglês
  if (data.englishLevel) {
    switch (data.englishLevel) {
      case 'fluent': score += 4; break
      case 'advanced': score += 3; break
      case 'intermediate': score += 2; break
      case 'basic': score += 1; break
    }
  }
  
  // Pontuação por experiência profissional
  if (data.experience) {
    if (data.experience >= 5) score += 3
    else if (data.experience >= 2) score += 2
    else score += 1
  }
  
  // Pontuação por situação financeira
  if (data.currentSavings) {
    if (data.currentSavings >= 100000) score += 3
    else if (data.currentSavings >= 50000) score += 2
    else if (data.currentSavings >= 20000) score += 1
  }
  
  // Pontuação por renda mensal
  if (data.monthlyIncome) {
    if (data.monthlyIncome >= 15000) score += 3
    else if (data.monthlyIncome >= 8000) score += 2
    else if (data.monthlyIncome >= 3000) score += 1
  }
  
  // Documentação
  if (data.passport) score += 2
  if (data.cpf && data.rg) score += 1
  
  // Qualificado se score >= 12 pontos
  return score >= 12
}

export function getQualificationReport(data: FormData) {
  const isQualified = calculateQualification(data)
  
  const recommendations = []
  
  if (!data.passport) {
    recommendations.push('Obtenha seu passaporte brasileiro')
  }
  
  if (data.englishLevel === 'basic' || !data.englishLevel) {
    recommendations.push('Melhore seu nível de inglês')
  }
  
  if (!data.currentSavings || data.currentSavings < 20000) {
    recommendations.push('Aumente suas reservas financeiras para pelo menos R$ 20.000')
  }
  
  return {
    isQualified,
    score: calculateQualification(data),
    recommendations,
    message: isQualified 
      ? 'Parabéns! Você tem um perfil qualificado para imigrar para os EUA.'
      : 'Seu perfil precisa de alguns ajustes para aumentar suas chances de sucesso.'
  }
}
