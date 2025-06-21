# LifeWayUSA

Plataforma para orientar famílias brasileiras interessadas em imigrar para os Estados Unidos.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **Tailwind CSS** - Framework CSS utility-first
- **Clerk** - Autenticação e gerenciamento de usuários
- **Supabase** - Backend as a Service (Database + Auth)
- **Stripe** - Processamento de pagamentos
- **OpenAI** - Integração com IA para ferramentas inteligentes
- **TypeScript** - Tipagem estática
- **Lucide React** - Ícones

## 🎨 Design System

### Fontes
- **Títulos**: Libre Baskerville (serifada, elegante)
- **Textos**: Figtree (sem serifa, moderna)

### Cores
- **Azul Petróleo**: `#084c61` - CTAs, hero, footer
- **Lilás Claro**: `#e9d5ff` - Section de ferramentas
- **Cinza Claro**: `#f3f4f6` - Background neutro
- **Branco**: `#ffffff` - Cards, navbar
- **Preto**: `#000000` - Textos primários

## 🏗️ Estrutura do Projeto

```
app/
├── components/         # Componentes reutilizáveis
├── lib/               # Utilitários e configurações
├── globals.css        # Estilos globais
├── layout.tsx         # Layout principal
└── page.tsx          # Página inicial
```

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no `.env.local`
4. Execute o projeto:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`

## 📋 Fases de Desenvolvimento

### 🟩 Fase 1 - Fundamentos Visuais e Setup ✅
- [x] Identidade visual (cores, fontes, layout)
- [x] Home com seções e navbar
- [x] Setup Next.js + Tailwind + Clerk + Supabase
- [ ] Versionamento GitHub + deploy Vercel

### 🟨 Fase 2 - Fluxo de Usuário e Qualificação
- [ ] Autenticação com Clerk
- [ ] MultiStepForm adaptativo
- [ ] Avaliação de qualificação
- [ ] Redirecionamento inteligente

### 🟧 Fase 3 - Ferramentas e Dashboard
- [ ] Dashboard com cards de ferramentas
- [ ] Integração OpenAI (VisaMatch, GetOpportunity, etc.)
- [ ] Layouts de ferramentas
- [ ] Resumo visual do formulário

### 🟥 Fase 4 - Upgrade e Monetização
- [ ] Página de planos
- [ ] Integração Stripe
- [ ] Webhook de ativação
- [ ] Liberação de funcionalidades Pro

### 🟦 Fase 5 - Conteúdo e ServiceWay
- [ ] Blog (MDX)
- [ ] Página de destinos
- [ ] ServiceWay (marketplace)
- [ ] Painel admin simples

### 🟪 Fase 6 - Testes e Go Live
- [ ] Testes automatizados
- [ ] Refino visual e performance
- [ ] Conteúdo final
- [ ] Lançamento v1.0

## 📝 Licença

Este projeto está sob a licença MIT.