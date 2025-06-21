## Documentação Global do Sistema — LifeWayUSA

### 1. Visão Geral e Estratégica

#### 1.1. Contexto e Justificativa

O projeto LifeWayUSA surge da necessidade crescente de orientar famílias brasileiras interessadas em imigrar para os Estados Unidos, oferecendo uma plataforma centralizada com ferramentas inteligentes, dados confiáveis e um plano personalizado para cada usuário.

#### 1.2. Objetivos de Negócio e KPIs

* Aumentar a conversão de usuários gratuitos para planos pagos em 20% até o final do Q4.
* Reduzir a taxa de desistência durante o preenchimento do MultiStepForm para menos de 15%.
* Garantir um tempo médio de resposta das ferramentas com IA inferior a 3 segundos.

#### 1.3. Público-Alvo e Personas

* Famílias brasileiras de classe média com interesse em mudar para os EUA.
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
* Ferramentas com IA: Criador de Sonhos, VisaMatch, GetOpportunity, FamilyPlanner, ProjectUSA, Simulador de Entrevista
* Página de planos com upgrade via Stripe
* Blog em MDX, Destinos, ServiceWay

**Excluído:**

* Aplicativos móveis
* Painel administrativo avançado (MVP)

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


✅ Navbar


Itens: Home, Quem Somos, Planos, Blog, Destinos, Entrar/Cadastrar (ou Dashboard/Sair se logado)

Ícone de engrenagem se is_editor = true (admin)

✅ Seções da Página
Section1 Hero

Título: “Viva legalmente nos EUA e mude sua vida e da sua família”

Subtítulo: “Ferramentas incríveis para você simular, planejar e sonhar”

Mostra as ferramentas Criador de Sonhos, GetOpportunmity, VisaMatch, CalcWay, ServiceWay, Simulador de Entrevista, ProjectUSA nas caixas com cores da paleta

Section 2 – Motivos para mudar

Título: “Porque você deveria se mudar para os EUA?”

4 cards: Segurança, Educação, Oportunidades, Qualidade de vida

Section 3 Planos

Fundo: imagem

Título: “Nossos Planos”

Cards: Free, Pro, Premium

Section 4 Quem somos

Section 5 Blog 

Section 6 Contato

Section 7 Footer

Altura: 400px

Fundo: azul petróleo

Elementos: links rápidos, redes sociais, slogan, copyright

✒️ 2. Fontes do Projeto

Logo :Libre Baskerville 

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

* Tabelas: users (auth), profiles, prospects, ferramentas (análises IA)
* Campos-chave: qualify (boolean), pro (boolean), user\_id (FK)

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

*Esse documento é a referência principal para guiar a arquitetura, design, implementação e roadmap do projeto LifeWayUSA.*

