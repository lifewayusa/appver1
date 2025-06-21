# Fluxo de Autenticação – LifeWayUSA

## Níveis de Autenticação e Campos Coletados

### 1. Visitante (não autenticado)
- Pode navegar, visualizar conteúdo público e acessar ferramentas em modo demonstração.
- Não armazena dados pessoais.

### 2. Usuário Registrado (autenticado)
- Campos obrigatórios:
  - email
  - senha
- Campos opcionais (perfil):
  - full_name
  - birth_date
  - phone
- Pode salvar progresso em formulários, acessar histórico, receber recomendações.

### 3. Usuário Avançado (perfil completo)
- Todos os campos do MultiStepForm:
  - fullName, email, birthDate, cpf, rg, passport
  - profileType, maritalStatus, spouse, children
  - education, englishLevel, profession, experience, currentSalary, skills
  - usaObjectives, targetStates, timeline
  - currentSavings, monthlyIncome, investmentCapacity
- Pode submeter dados para análise, receber resultados personalizados, acessar funcionalidades premium.

### 4. Editor
- Todos os campos de usuário avançado
- role = 'editor' em profiles
- Pode criar/editar posts no blog

### 5. Administrador
- Todos os campos de editor
- role = 'admin' em profiles
- Pode gerenciar usuários, permissões, conteúdo e configurações do sistema

---

*Gerado automaticamente por GitHub Copilot em 19/06/2025*
