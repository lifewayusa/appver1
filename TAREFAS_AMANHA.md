# 📋 TAREFAS PARA AMANHÃ - 23 DE JUNHO 2025

## 🔧 MELHORIAS NAS FERRAMENTAS

### 1. **Aprimorar Prompts das Ferramentas**
- **Problema:** Respostas muito genéricas nos componentes:
  - `CriadorSonhosClient.tsx`
  - `GetOpportunityClient.tsx` 
  - `VisaMatchClient.tsx`

- **Ações necessárias:**
  - [ ] Criar prompts mais específicos baseados nos dados do formulário
  - [ ] Implementar lógica condicional para respostas personalizadas
  - [ ] Usar dados reais do localStorage para gerar análises mais precisas
  - [ ] Adicionar variações nas respostas para evitar repetição
  - [ ] Incluir dados demográficos, econômicos e estatísticas reais

---

## 📰 IMPLEMENTAÇÃO DO BLOG

### 2. **Sistema de Gestão de Blog**
- **Status atual:** Estrutura básica criada, páginas estáticas funcionando

- **Implementar:**
  - [ ] **CMS Admin Panel** para criação/edição de posts
  - [ ] **Base de dados** para armazenar artigos (Supabase?)
  - [ ] **Sistema de categorias** dinâmico
  - [ ] **Tags** para organização de conteúdo
  - [ ] **SEO metadata** para cada artigo
  - [ ] **Sistema de busca** no blog
  - [ ] **Paginação** para listagem de posts
  - [ ] **Upload de imagens** para artigos
  - [ ] **Editor rich text** (TinyMCE ou similar)
  - [ ] **Preview** antes de publicar

### 2.1 **Páginas Blog a Criar/Melhorar**
- [ ] Página de categoria individual 
- [ ] Página de busca de artigos
- [ ] Página de artigo individual com layout completo
- [ ] Sidebar com artigos relacionados
- [ ] Newsletter signup integration

---

## 🌎 IMPLEMENTAÇÃO DE DESTINOS

### 3. **Sistema de Cidades/Destinos**
- **Status atual:** Páginas básicas criadas, dados estáticos

- **Base de dados necessária:**
  - [ ] **Estrutura de dados** para cidades:
    ```
    cidades: {
      id, nome, estado, regiao,
      custo_vida_index, populacao,
      salario_medio, custo_moradia,
      temperatura_media, principais_industrias,
      comunidade_brasileira, aeroportos,
      universidades, sistema_saude,
      seguranca_index, imagens[]
    }
    ```

- **Funcionalidades a implementar:**
  - [ ] **Listagem dinâmica** de cidades por estado
  - [ ] **Filtros avançados** (custo, clima, indústria, etc.)
  - [ ] **Comparador de cidades** (lado a lado)
  - [ ] **Mapas interativos** com pins das cidades
  - [ ] **Calculadora de custo de vida** por cidade
  - [ ] **Gráficos comparativos** (custos, salários, etc.)
  - [ ] **Reviews/comentários** de brasileiros que moram lá
  - [ ] **Guias detalhados** por cidade (como o que já existe)

### 3.1 **Páginas Destinos a Criar**
- [ ] `/destinos/[estado]/[cidade]` - Página individual da cidade
- [ ] `/destinos/comparar` - Ferramenta de comparação
- [ ] `/destinos/mapa` - Visualização em mapa
- [ ] `/destinos/filtros` - Busca avançada com filtros

---

## 🎯 PRIORIDADES PARA O DIA

### **MANHÃ (Alta Prioridade)**
1. **Melhorar prompts das ferramentas** - 2-3 horas
   - Começar com CriadorSonhosClient (mais importante)
   - Implementar lógica condicional baseada em dados reais

### **TARDE (Média Prioridade)**
2. **Estruturar base de dados de cidades** - 2-3 horas
   - Criar schema no Supabase
   - Popular com dados das principais cidades para brasileiros
   - Implementar listagem dinâmica básica

### **FINAL DO DIA (Se der tempo)**
3. **Iniciar CMS do Blog** - 1-2 horas
   - Estrutura básica de admin
   - Integração com base de dados

---

## 📊 DADOS NECESSÁRIOS

### **Para Ferramentas:**
- [ ] Estatísticas reais de salários por profissão/estado
- [ ] Dados de investimento EB-5 atualizados
- [ ] Custos reais de processos de visto
- [ ] Timeline realista para cada tipo de visto

### **Para Cidades:**
- [ ] Índices de custo de vida atualizados (2024/2025)
- [ ] Dados demográficos de comunidades brasileiras
- [ ] Principais empregadores por cidade
- [ ] Preços médios de aluguel/compra por bairro

---

## 🔄 MELHORIAS CONTÍNUAS

- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Analytics implementation
- [ ] User feedback collection
- [ ] A/B testing para CTAs

---

**Versão atual:** 1.45 ✅  
**Próxima versão:** 1.46 (com ferramentas aprimoradas)  
**Meta:** 1.50 (com blog completo e destinos dinâmicos)

---

*Arquivo criado em: 22/06/2025 - Última atualização: 22/06/2025*  
*Status do projeto: Em desenvolvimento ativo*

**Boa noite! 🌙**
