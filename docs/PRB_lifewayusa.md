## PRB — Plano de Requisitos do Backlog (LifeWayUSA)

### 1. Épicos e Funcionalidades-Chave

#### EP01 - Autenticação e Conta

* HU001: Como visitante, quero me cadastrar com email/senha ou Google para acessar ferramentas.
* HU002: Como usuário, quero fazer login com segurança.
* HU003: Como usuário, quero editar meus dados de perfil.
* HU004: Como usuário, quero redefinir minha senha se esquecê-la.

#### EP02 - MultiStepForm Inteligente

* HU005: Como novo usuário, quero preencher um formulário que se adapta ao meu perfil.
* HU006: Como sistema, devo definir se o usuário tem qualify = TRUE após o formulário.
* HU007: Como usuário, posso interromper e retomar o formulário a qualquer momento.

#### EP03 - Ferramentas com IA

* HU008: Como usuário qualificado, quero acessar ferramentas com recomendações personalizadas.
* HU009: Como usuário Pro, quero acessar ferramentas Premium exclusivas.
* HU010: Como sistema, devo exibir cards com status de cada ferramenta (liberada ou bloqueada).

#### EP04 - Gestão de Planos

* HU011: Como visitante, quero ver a tabela comparativa dos planos.
* HU012: Como usuário, quero realizar upgrade para Pro via Stripe.
* HU013: Como sistema, devo atualizar o campo pro = TRUE após confirmação de pagamento.

#### EP05 - Dashboard e Navegação

* HU014: Como usuário, quero acessar um dashboard com atalhos para minhas ferramentas.
* HU015: Como sistema, devo ocultar ou exibir cards com base em qualify e pro.

#### EP06 - Conteúdo Estático e Blog

* HU016: Como visitante, quero ler conteúdos informativos sem login.
* HU017: Como admin, posso cadastrar posts MDX.

#### EP07 - Destinos e Comparadores

* HU018: Como visitante, quero pesquisar cidades e visualizar dados comparativos.

#### EP08 - ServiceWay

* HU019: Como usuário, quero visualizar fornecedores parceiros divididos por tipo de serviço.
* HU020: Como admin, quero cadastrar e editar os serviços oferecidos.

---

### 2. Requisitos Transversais

* RT001: Todo conteúdo e interface devem estar em português.
* RT002: O sistema deve ser mobile-first.
* RT003: A lógica de controle de acesso deve ser baseada nos campos qualify e pro.

---

### 3. Regras de Negócio

* RN001: O formulário MultiStep é obrigatório após cadastro, mas pode ser interrompido.
* RN002: Ferramentas só são liberadas se qualify = TRUE; Pro requer pro = TRUE.
* RN003: Campos de qualify e pro são gravados em prospects no Supabase.

---

*Este documento detalha o backlog funcional que deve guiar a criação e priorização de tarefas no projeto LifeWayUSA.*

