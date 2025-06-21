## Cronograma de Desenvolvimento — LifeWayUSA

### 🟩 Fase 1 — Fundamentos Visuais e Setup (Semana 1)

**Milestone 1.1: Identidade Visual**

* Escolha de fontes, cores e padrão visual base

**Milestone 1.2: Prototipagem Inicial**

* Layout funcional da Home com seções e navbar fixa

**Milestone 1.3: Setup do Projeto**

* Next.js com Tailwind, integração Clerk e Supabase

**Milestone 1.4: Deploy Inicial**

* GitHub, Vercel e documentação inicial
* [x] Definição da identidade visual (cores, fontes, layout)
* [x] Criação da Home com seções e navbar
* [x] Configuração do projeto Next.js + Tailwind + Clerk + Supabase
* [x] Versionamento inicial no GitHub + deploy Vercel

### 🟨 Fase 2 — Fluxo de Usuário e Qualificação (Semanas 2-3)

**Milestone 2.1: Autenticação com Clerk**

* Cadastro e login com segurança
* Edição de perfil básico (via Profile)

**Milestone 2.2: MultiStepForm Adaptativo**

* Lógica condicional por perfil (família, estudante, profissional)
* Salvamento progressivo e retomada

**Milestone 2.3: Avaliação de Qualificação**

* Análise automatizada dos dados para gerar `qualify = TRUE`

**Milestone 2.4: Redirecionamento Inteligente**

* Pós-cadastro ➝ formulário obrigatório
* Pós-login ➝ dashboard se qualify, senão retomar formulário
* [ ] Implementação do cadastro/login com Clerk
* [ ] Criação do MultiStepForm com lógica condicional
* [ ] Avaliação qualify e persistência no Supabase
* [ ] Redirecionamento inteligente após login/cadastro

### 🟧 Fase 3 — Ferramentas e Dashboard (Semanas 4-5)

**Milestone 3.1: Estrutura de Dashboard**

* Cards de ferramentas com lógica de bloqueio baseada em `qualify` e `pro`
* Exibição de mensagens e CTAs personalizados

**Milestone 3.2: Integração com IA (OpenAI)**

* Criador de Sonhos  
* ServiceWay - marketplase de servicos e oportunidades
* VisaMatch: sugestão de visto
* GetOpportunity: análise de perfil profissional/empreendedor
* FamilyPlanner: roteiro de imigração personalizado
* Simulador de Entrevista: perguntas/respostas com IA

**Milestone 3.3: Layouts de Ferramentas**

* Páginas independentes para cada ferramenta
* Output interativo e responsivo

**Milestone 3.4: Resumo Visual do Formulário**


* [ ] Cards de ferramentas com bloqueio/CTA conforme qualify e pro
* [ ] Integração com IA (OpenAI): Criador de Sonhos, ServiceWay, VisaMatch, GetOpportunity, FamilyPlanner, Simulador
* [ ] Layouts individuais para cada ferramenta
* [ ] PDF ou resumo visual final após MultiStepForm

### 🟥 Fase 4 — Upgrade e Monetização (Semana 6)

**Milestone 4.1: Página de Planos**

* Tabela comparativa Free / Pro / Premium
* Botões de chamada para ação nos cards de planos

**Milestone 4.2: Integração com Stripe**

* Implementação do botão de upgrade
* Redirecionamento para checkout com sessão personalizada

**Milestone 4.3: Webhook de Ativação**

* Endpoint para escutar evento "checkout.session.completed"
* Atualização automática do campo `pro = TRUE`

**Milestone 4.4: Liberação de Funcionalidades Pro**

* Verificação do campo `pro` e desbloqueio das ferramentas ProjectUSA e Simulador de Entrevista
* [ ] Página de Planos
* [ ] Checkout Stripe e webhook de ativação
* [ ] Verificação de `pro = TRUE` para liberar ferramentas avançadas

### 🟦 Fase 5 — Conteúdo, Destinos e ServiceWay (Semanas 7-8)

**Milestone 5.1: Página de Blog (MDX)**

* Integração com sistema de arquivos Markdown/MDX
* Layout de listagem e post individual

**Milestone 5.2: Página de Destinos**

* Cards com dados das cidades (nome, estado, custo, clima)
* Filtros por estado, tipo e preferências

**Milestone 5.3: ServiceWay (Marketplace)**

* Cards de serviços por categoria (ex: contabilidade, escola, moradia)
* Integração fictícia inicial com dados dummy

**Milestone 5.4: Painel Admin Simples**

* Cadastro manual de conteúdo para blog, destinos e ServiceWay
* [ ] Página de Blog (MDX)
* [ ] Página de Destinos (filtros, cards)
* [ ] ServiceWay com categorias e cards fictícios
* [ ] Painel admin simplificado para cadastros básicos

### 🟪 Fase 6 — Testes, Refino e Go Live (Semana 9)

**Milestone 6.1: Testes Automatizados**

* Implementação de testes unitários (Jest)
* Testes de ponta a ponta com Cypress nos fluxos críticos

**Milestone 6.2: Refino Visual e de Performance**

* Correções visuais finais
* Otimizações de carregamento e usabilidade

**Milestone 6.3: Preparação de Conteúdo Final**

* Inserção dos conteúdos reais nas seções institucionais, blog e destinos

**Milestone 6.4: Go Live**

* Verificação completa e publicação da versão 1.0 pública
* [ ] Testes unitários e E2E com Jest e Cypress
* [ ] Ajustes de layout e performance
* [ ] Preparação do conteúdo final
* [ ] Lançamento da versão 1.0 pública

