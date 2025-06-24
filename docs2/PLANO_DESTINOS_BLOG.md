# 🚀 PLANO DE EXECUÇÃO - DESTINOS E BLOG LIFEWAYUSA

## 📋 **ANÁLISE SITUAÇÃO ATUAL**

### ✅ **O QUE JÁ EXISTE**
- Sistema MultiStepForm funcionando 100%
- Estrutura básica de páginas (destinos, blog)
- Componentes mock para cidades (`/lib/cities.ts`)
- Interface blog com dados estáticos
- Tabelas `cities`, `blog_posts`, `blog_categories`, `blog_tags` criadas no Supabase

### ⚠️ **O QUE ESTÁ PENDENTE**
1. **Sistema de Destinos**: Integração real com tabela `cities` do Supabase
2. **Sistema de Blog**: Integração real com tabelas `blog_posts`, `blog_categories`, `blog_tags`

---

## 🎯 **TAREFA 1: IMPLEMENTAÇÃO DO SISTEMA DE DESTINOS**

### **Microtarefa 1.1: Integração com Supabase - Cities**
**Arquivos**: `/app/lib/cities.ts`, `/app/destinos/page.tsx`

**Subtarefas:**
- [ ] Substituir functions mock por conexões reais ao Supabase
- [ ] Implementar `getMainDestinyCities()` com query real
- [ ] Implementar `getCitiesByState()` para filtros
- [ ] Implementar `getCityById()` para páginas individuais
- [ ] Adicionar tratamento de erros e loading states

### **Microtarefa 1.2: Página de Listagem de Destinos**
**Arquivos**: `/app/destinos/page.tsx`, `/app/destinos/components/`

**Subtarefas:**
- [ ] Criar filtros funcionais por estado
- [ ] Implementar busca por nome de cidade
- [ ] Adicionar paginação ou scroll infinito
- [ ] Criar sistema de ordenação (população, custo de vida, rating)
- [ ] Implementar cards responsivos com dados reais

### **Microtarefa 1.3: Páginas Individuais de Cidades**
**Arquivos**: `/app/destinos/[slug]/page.tsx`

**Subtarefas:**
- [ ] Criar estrutura de página individual
- [ ] Implementar seções: Overview, Custo de Vida, Educação, Trabalho
- [ ] Adicionar mapa interativo (Google Maps/Mapbox)
- [ ] Exibir universidades e escolas da cidade
- [ ] Mostrar cursos de inglês disponíveis
- [ ] Integrar com APIs de ferramentas (Get Opportunity)

### **Microtarefa 1.4: Sistema de Imagens**
**Arquivos**: `/public/images/cities/`, `/app/lib/imageUtils.ts`

**Subtarefas:**
- [ ] Organizar/validar imagens existentes das cidades
- [ ] Implementar fallback para cidades sem imagem
- [ ] Otimizar carregamento de imagens (Next.js Image)
- [ ] Criar sistema de múltiplas imagens por cidade

### **Microtarefa 1.5: APIs e Integrações**
**Arquivos**: `/app/api/cities/`, `/app/api/destinations/`

**Subtarefas:**
- [ ] Criar API `/api/cities` para busca e filtros
- [ ] Implementar cache Redis/local para performance
- [ ] Integrar com APIs externas (dados de custo de vida)
- [ ] Criar webhooks para atualizações automáticas

---

## 📝 **TAREFA 2: IMPLEMENTAÇÃO DO SISTEMA DE BLOG**

### **Microtarefa 2.1: Integração com Supabase - Blog**
**Arquivos**: `/app/lib/blog.ts` (novo), `/app/blog/page.tsx`

**Subtarefas:**
- [ ] Criar funções de conexão com `blog_posts`
- [ ] Implementar `getBlogPosts()` com filtros e paginação
- [ ] Criar `getBlogPostBySlug()` para posts individuais
- [ ] Implementar `getBlogCategories()` para filtros
- [ ] Adicionar `getBlogPostsByCategory()`

### **Microtarefa 2.2: Página de Listagem do Blog**
**Arquivos**: `/app/blog/page.tsx`, `/app/components/BlogPodcastTeasers.tsx`

**Subtarefas:**
- [ ] Substituir dados mock por dados reais do Supabase
- [ ] Implementar filtros por categoria funcionais
- [ ] Adicionar busca por título/conteúdo
- [ ] Criar sistema de posts em destaque
- [ ] Implementar paginação ou load more

### **Microtarefa 2.3: Páginas Individuais de Posts**
**Arquivos**: `/app/blog/[slug]/page.tsx` (novo)

**Subtarefas:**
- [ ] Criar layout completo para post individual
- [ ] Implementar renderização de markdown/rich text
- [ ] Adicionar sistema de tags
- [ ] Criar "Posts Relacionados"
- [ ] Implementar tempo de leitura dinâmico
- [ ] Adicionar navegação anterior/próximo

### **Microtarefa 2.4: Sistema de Categorias e Tags**
**Arquivos**: `/app/blog/categoria/[slug]/page.tsx`, `/app/lib/blogUtils.ts`

**Subtarefas:**
- [ ] Criar páginas de categoria
- [ ] Implementar navegação por tags
- [ ] Criar breadcrumbs dinâmicos
- [ ] Adicionar contadores de posts por categoria
- [ ] Implementar sugestões de categorias relacionadas

### **Microtarefa 2.5: CMS/Admin para Blog**
**Arquivos**: `/app/admin/blog/`, `/app/api/admin/blog/`

**Subtarefas:**
- [ ] Criar interface para criar/editar posts
- [ ] Implementar upload de imagens
- [ ] Adicionar preview de posts
- [ ] Criar sistema de rascunhos
- [ ] Implementar agendamento de publicação

### **Microtarefa 2.6: SEO e Performance**
**Arquivos**: Vários

**Subtarefas:**
- [ ] Implementar metadata dinâmica (title, description)
- [ ] Adicionar Open Graph tags
- [ ] Criar sitemap.xml dinâmico
- [ ] Implementar schema markup para posts
- [ ] Otimizar Core Web Vitals

---

## 🔧 **TAREFAS TÉCNICAS TRANSVERSAIS**

### **Microtarefa 3.1: Database Schema Validation**
**Arquivos**: `/sql/validate-blog-cities.sql`

**Subtarefas:**
- [ ] Validar estrutura das tabelas existentes
- [ ] Adicionar índices para performance
- [ ] Criar constraints necessárias
- [ ] Implementar triggers para auditoria
- [ ] Popular tabelas com dados de exemplo

### **Microtarefa 3.2: Componentes Reutilizáveis**
**Arquivos**: `/app/components/shared/`

**Subtarefas:**
- [ ] Criar `<CityCard />` padronizado
- [ ] Desenvolver `<BlogCard />` responsivo
- [ ] Implementar `<SearchFilter />` genérico
- [ ] Criar `<Pagination />` reutilizável
- [ ] Desenvolver `<LoadingSkeletons />`

### **Microtarefa 3.3: Testes e Validação**
**Arquivos**: `/tests/`, scripts de teste

**Subtarefas:**
- [ ] Criar testes de integração para APIs
- [ ] Implementar testes de componentes
- [ ] Validar performance de carregamento
- [ ] Testar responsividade mobile
- [ ] Verificar acessibilidade (a11y)

---

## 📅 **CRONOGRAMA SUGERIDO**

### **Semana 1: Fundação**
- **Dias 1-2**: Microtarefas 1.1 e 2.1 (Integração Supabase)
- **Dias 3-4**: Microtarefa 3.1 (Database Schema)
- **Dias 5-7**: Microtarefa 3.2 (Componentes Base)

### **Semana 2: Destinos**
- **Dias 1-3**: Microtarefas 1.2 e 1.3 (Páginas de Destinos)
- **Dias 4-5**: Microtarefa 1.4 (Sistema de Imagens)
- **Dias 6-7**: Microtarefa 1.5 (APIs e Cache)

### **Semana 3: Blog**
- **Dias 1-3**: Microtarefas 2.2 e 2.3 (Páginas de Blog)
- **Dias 4-5**: Microtarefa 2.4 (Categorias e Tags)
- **Dias 6-7**: Microtarefa 2.5 (Admin/CMS)

### **Semana 4: Finalização**
- **Dias 1-3**: Microtarefa 2.6 (SEO e Performance)
- **Dias 4-5**: Microtarefa 3.3 (Testes)
- **Dias 6-7**: Deploy e ajustes finais

---

## 🎯 **CRITÉRIOS DE SUCESSO**

### **Destinos:**
- ✅ Listagem funcional com filtros por estado
- ✅ Páginas individuais com informações completas
- ✅ Sistema de busca eficiente
- ✅ Integração com ferramentas existentes

### **Blog:**
- ✅ CMS funcional para criação de posts
- ✅ Sistema de categorias e tags
- ✅ SEO otimizado e performance
- ✅ Design responsivo e acessível

### **Performance:**
- ✅ Tempo de carregamento < 3s
- ✅ Core Web Vitals dentro do verde
- ✅ Funcionalidade offline básica
- ✅ Cache estratégico implementado

---

## 🚀 **PRÓXIMOS PASSOS IMEDIATOS**

1. **COMEÇAR**: Microtarefa 1.1 - Integração Cities com Supabase
2. **PARALELAMENTE**: Microtarefa 2.1 - Integração Blog com Supabase
3. **VALIDAR**: Estrutura de tabelas no Supabase
4. **PREPARAR**: Ambiente de desenvolvimento e testes

**Está pronto para atacar essas implementações?** 🎯
