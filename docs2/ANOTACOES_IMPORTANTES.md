# ANOTAÇÕES IMPORTANTES - PROJETO LIFEWAYUSA

## Informações Críticas do Usuário

### Banco de Dados - Estrutura das Cidades
- ✅ **CAMPO PRINCIPAL**: `main_destiny` (boolean) - marca cidades principais
- ✅ **IMAGENS**: Campo `imagem` contém URLs para as 1000 maiores cidades
- ✅ **ÍNDICES**: Todos comparados à média nacional = 1.0
  - `cost_of_living_index`: 1.0 = média nacional, >1.0 = mais caro, <1.0 = mais barato
  - `education_score`: 1.0 = média nacional, >1.0 = melhor educação, <1.0 = pior
  - `business_opportunity_score`: 1.0 = média, >1.0 = melhores oportunidades
  - `job_market_score`: 1.0 = média, >1.0 = melhor mercado de trabalho
- ✅ **ESTRUTURA**: Tabela `cities` com campos: id, name, state, country, main_destiny, etc.

### Padrões de Imagens
- ✅ **Cidades Principais**: Campo `imagem` na tabela cities (1000 maiores cidades)
- ✅ **Fallback cidades pequenas**: `/images/cities/{id}.jpg` (futuro)
- ✅ **Fallback geral**: `/images/cities/default-city.jpg`
- ✅ **Blog**: Usar imagens existentes em `/public/images/blog/`

### Funções Implementadas
- ✅ `getMainDestinyCities()` - busca cidades com `main_destiny = true`
- ✅ `getCityImageUrl()` - gera URL baseada no ID da cidade
- ✅ Integração real com Supabase configurada

### Problemas Já Resolvidos
- ✅ Variáveis de ambiente configuradas (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY)
- ✅ Imagens hardcoded inexistentes substituídas por imagens reais
- ✅ Campo `costOfLiving` corrigido para `cost_of_living_index`
- ✅ Campo `text_attractions` corrigido para `attractions`

### Status Atual
- ✅ Servidor Next.js funcionando
- ✅ Páginas de destinos carregando
- ✅ **COMPARADOR DE CIDADES FUNCIONANDO** ✨
- ✅ Campo `imagem` corrigido em todos os componentes
- ✅ 1000 maiores cidades com URLs de imagens no banco

---
**LEMBRETE**: Sempre consultar estas anotações antes de fazer alterações!
