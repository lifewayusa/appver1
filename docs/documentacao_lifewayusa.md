## Documentação Global do Sistema — LifeWayUSA

### 1. Visão Geral e Estratégica

#### 1.1. Contexto e Justificativa

O projeto LifeWayUSA surge da necessidade crescente de orientar famílias interessadas em imigrar para os Estados Unidos, oferecendo uma plataforma centralizada com ferramentas inteligentes, dados confiáveis e um plano personalizado para cada usuário.

#### 1.2. Objetivos de Negócio e KPIs

* Aumentar a conversão de usuários gratuitos para planos pagos em 20% até o final do Q4.
* Reduzir a taxa de desistência durante o preenchimento do MultiStepForm para menos de 15%.
* Garantir um tempo médio de resposta das ferramentas com IA inferior a 3 segundos.

#### 1.3. Público-Alvo e Personas

* Famílias de classe média com interesse em mudar para os EUA.
* Jovens profissionais e estudantes buscando oportunidades acadêmicas e de trabalho.
* Microempreendedores interessados em internacionalização.

#### 1.4. Stakeholders e Papéis

* Product Owner: \[Definir Nome]
* Tech Lead: \[Definir Nome]
* UX Designer: \[Definir Nome]
* Desenvolvedores Frontend e Backend

---

### 2. Escopo e Requisitos do Produto

#### 2.1. Escopo Detalhado

**Incluso:**

* Plataforma Web responsiva com autenticação Clerk
* MultiStepForm adaptável por perfil
* Dashboard com cards de ferramentas
* Ferramentas com IA: Criador de Sonhos, VisaMatch, GetOpportunity, FamilyPlanner, ProjectUSA, Simulador de Entrevista e Serviceway
* Página de planos com upgrade via Stripe
* Blog em MDX, Destinos, ServiceWay* Painel administrativo avançado (MVP)

#### 2.2. Requisitos Funcionais

* RF001: Usuário pode se cadastrar e fazer login via Clerk
* RF002: MultiStepForm inicia após cadastro, adaptável
* RF003: Ferramentas liberadas com qualify = TRUE
* RF004: ProjectUSA e Simulador de Entrevista requerem pro = TRUE
* RF005: Upgrade de plano via Stripe
* RF006: Blog e Destinos acessíveis livremente

#### 2.3. Requisitos Não-Funcionais

* Tempo de carregamento < 2s nas páginas principais
* Compatibilidade com navegadores modernos
* Armazenamento seguro (Supabase com RLS)

#### 2.4. Histórias de Usuário

* HU01: Como usuário, quero preencher um formulário para receber recomendações personalizadas.
* HU02: Como usuário Pro, quero desbloquear ferramentas premium após o pagamento.
* HU03: Como visitante, quero entender os planos antes de me cadastrar.

---

### 3. Experiência do Usuário e Design

🧠 1. Estrutura Visual da Home
A página inicial (/) será composta por:

✅ Navbar
Altura: 40px, cor de fundo: branca

Itens: Home, Quem Somos, Planos, Blog, Destinos, Entrar/Cadastrar (ou Dashboard/Sair se logado)

Ícone de engrenagem se is_editor = true (admin)

✅ Seções da Página
Hero

Altura: 400px

Fundo: imagem com overlay azul petróleo (95% de opacidade)

Título: “Viva legalmente nos EUA e mude sua vida e da sua família”

Subtítulo: “Ferramentas incríveis para você simular, planejar e sonhar”

Section 1 – Motivos para mudar

Título: “Porque você deveria se mudar para os EUA?”

4 cards: Segurança, Educação, Oportunidades, Qualidade de vida

Section 2 – Ferramentas Gratuitas

Fundo: cor lilás

Título: “Ferramentas gratuitas para você Pesquisar, Planejar e Sonhar”

Subtítulo explicativo

Mini cards com 100x200px (sem ProjectUSA)

Section 3 – Planos

Fundo: imagem

Título: “Nossos Planos”

Cards: Free, Pro, Premium

Footer

Altura: 400px

Fundo: azul petróleo

Elementos: links rápidos, redes sociais, slogan, copyright

✒️ 2. Fontes do Projeto
Títulos: Libre Baskerville — serifada, elegante, transmite seriedade

Textos: Figtree — sem serifa, moderna, legível

Essas fontes foram definidas no documento global como padrão e já estão alinhadas com o branding desejado.

🎨 3. Paleta de Cores
Nome	Hex	Uso Principal
Azul Petróleo	#084c61	Fundo do Hero, footer, CTAs
Lilás Claro	#e9d5ff	Section 2 – Ferramentas
Branco	#ffffff	Navbar, textos em fundo escuro
Cinza Claro	#f3f4f6	Background neutro e cards
Preto	#000000	Textos primários

Essa paleta equilibra confiança (azul), inovação (lilás) e clareza (branco e cinza claro).



#### 3.1. Fluxos e Jornadas

* Cadastro ➝ MultiStepForm ➝ Resultado ➝ Dashboard
* Login ➝ Verificação de qualify ➝ Dashboard ou Formulário

#### 3.2. Wireframes e Protótipos

* Desenvolvidos diretamente com Tailwind + React
* Imagens do Unsplash

#### 3.3. Design System

* Tipografia: Libre Baskerville (títulos), Figtree (textos)
* Cores: azul petróleo, lilás, branco, preto, tons de cinza personalizados

#### 3.4. Casos de Borda

* Se usuário fechar o formulário antes do fim, pode retomar depois
* Se não tiver qualify, verá cards bloqueados com CTA “Complete seu cadastro”

---

### 4. Especificação Técnica e Arquitetura

#### 4.1. Visão Geral

* Frontend: Next.js com App Router, Tailwind, React
* Backend: Supabase (Auth, DB, Edge Functions)
* IA: OpenAI API
* Notificações: N8N (email e WhatsApp)

#### 4.2. Modelo de Dados

* Tabelas: users (auth), profiles, prospects, ferramentas (análises IA), blog\_posts, blog\_categories, blog\_post\_categories
* Campos-chave: qualify (boolean), pro (boolean), user\_id (FK), role (text)

#### 4.3. APIs

* Stripe Checkout
* OpenAI
* Webhooks N8N

---

### 5. Qualidade e Deploy

#### 5.1. Testes

* Unitários com Jest (log de ferramentas)
* E2E com Cypress (formulário e fluxo de upgrade)

#### 5.2. CI/CD

* GitHub Actions ➝ Deploy automático em Vercel

---

### 6. Anexos

#### 6.1. Decisões de Arquitetura

* Uso de Clerk em vez de autenticação manual
* Separação total entre parte visual e lógica IA para facilitar testes e deploy

---

# Modelagem de Banco de Dados — Lifewayusa (2025)

## Tabelas Principais

### 1. users
- id (uuid, PK)
- email (text, único)
- created_at (timestamptz)

### 2. profiles
- id (uuid, PK, referencia users.id)
- user_id (uuid, único, referencia users.id)
- full_name (text)
- birth_date (date)
- phone (text)
- role (text, default 'user')  -- valores: 'user', 'admin', 'editor'
- created_at (timestamptz)
- updated_at (timestamptz)

### 3. prospects
- id (uuid, PK)
- user_id (uuid, único, referencia users.id)
- qualify (boolean)
- pro (boolean)
- analise_familyplanner (text)
- analise_visamatch (text)
- analise_getopportunity (text)
- plano_projectusa_output (text)
- simulador_entrevista_output (text)
- created_at (timestamptz)

### 4. content
- id (uuid, PK)
- slug (text, único)
- title (text)
- body (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### 5. blog_posts
- id (uuid, PK)
- author_id (uuid, referencia profiles.id)
- title (text)
- slug (text, único)
- summary (text)
- body (text)
- published (boolean, default false)
- published_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)

### 6. blog_categories
- id (uuid, PK)
- name (text, único)
- description (text)

### 7. blog_post_categories
- post_id (uuid, referencia blog_posts.id)
- category_id (uuid, referencia blog_categories.id)
- PK (post_id, category_id)

### 8. cities
- id (uuid, PK)
- name (text)
- state (text)
- country (text)

### 9. universities
- id (uuid, PK)
- name (text)
- url (text)

### 10. schools
- id (uuid, PK)
- name (text)

### 11. professional_courses
- id (uuid, PK)
- name (text)

### 12. cursos_de_ingles
- id (uuid, PK)
- name (text)

### 13. project_usa
- id (uuid, PK)
- user_id (uuid, referencia users.id)
- data (jsonb)
- created_at (timestamptz)

### 14. visa_match
- id (uuid, PK)
- user_id (uuid, referencia users.id)
- answers (jsonb)
- result (jsonb)
- created_at (timestamptz)

### 15. family_planner
- id (uuid, PK)
- user_id (uuid, referencia users.id)
- data (jsonb)
- created_at (timestamptz)

### 16. criador_sonhos
- id (uuid, PK)
- user_id (uuid, referencia users.id)
- data (jsonb)
- created_at (timestamptz)

### 17. newsletter_leads
- id (uuid, PK)
- email (text, único)
- created_at (timestamptz)

---

## Observações
- O campo `role` em `profiles` permite distinguir usuários comuns, administradores e editores.
- O blog é composto por `blog_posts`, `blog_categories` e a tabela de relação `blog_post_categories`.
- As tabelas de dados (cidades, universidades, etc.) facilitam buscas e cadastros.
- As ferramentas possuem tabelas próprias para máxima flexibilidade.
- Relacionamentos e constraints devem ser definidos conforme necessidade do negócio.

---

*Esse documento é a referência principal para guiar a arquitetura, design, implementação e roadmap do projeto LifeWayUSA.*

