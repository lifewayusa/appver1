# ⚠️ AVISOS CRÍTICOS - LEIA ANTES DE FAZER QUALQUER MUDANÇA

## 🚨 ATENÇÃO MÁXIMA - ERROS QUE JÁ CAUSARAM PROBLEMAS:

### ❌ NUNCA MEXER COM CLERK
- **NÃO instalar** pacotes do Clerk (`@clerk/nextjs`, etc.)
- **NÃO adicionar** variáveis de ambiente do Clerk
- **NÃO configurar** autenticação Clerk
- **NÃO usar** `clerkMiddleware` ou qualquer função do Clerk
- **Motivo**: Causou erro de produção que derrubou o site (MIDDLEWARE_INVOCATION_FAILED)

### ❌ NUNCA COMMITAR ARQUIVOS COM CHAVES SENSÍVEIS
- **NÃO criar** arquivos `.env.production` ou `.env.vercel` no git
- **NÃO commitar** chaves da OpenAI, Supabase, etc.
- **Motivo**: GitHub bloqueia push por segurança

### ❌ MIDDLEWARE DEVE PERMANECER SIMPLES
- O `middleware.ts` atual está funcionando - **NÃO MUDAR**
- Apenas permite todas as requisições passarem
- **NÃO adicionar** lógica de autenticação complexa

## ✅ O QUE ESTÁ FUNCIONANDO AGORA:

### ✅ APIs Implementadas e Funcionais:
- `/api/tools/get-opportunity/analyze-opportunity`
- `/api/tools/criador-sonhos/process-form`
- `/api/tools/visa-match/analyze-visa`

### ✅ Variáveis de Ambiente Configuradas na Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### ✅ Funcionalidades Implementadas:
- Leitura dos prompts dos arquivos `.md`
- Integração com OpenAI (GPT-4o)
- Armazenamento no Supabase (tabela `user_reports`)
- APIs públicas (sem autenticação)

## 🔧 PROCESSO SEGURO PARA MUDANÇAS:

1. **SEMPRE** ler este arquivo primeiro
2. **SEMPRE** fazer backup antes de grandes mudanças
3. **SEMPRE** testar localmente com `npm run build`
4. **NUNCA** commitar arquivos com chaves sensíveis
5. **SEMPRE** usar `git add` específico, não `git add .`

## 🚀 URL ATUAL EM PRODUÇÃO:
https://lifewayusa-fwpzrxcm0-sergio-castros-projects-ae7c87eb.vercel.app

---

**LEMBRE-SE**: Se algo está funcionando, pense duas vezes antes de mexer!
