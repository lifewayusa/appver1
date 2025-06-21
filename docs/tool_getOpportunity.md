GetOpportunity
Objetivo: Explorar cenários profissionais e empreendedores, sugerindo caminhos realistas nos EUA com base em habilidades, experiência e perfil.
Entrada de Dados: Habilidades (habilidades), experiência (anos_experiencia, trabalhou_exterior), formação (escolaridade, certificacoes), perfil empreendedor (empresa_propria, capital_disponivel), profissão (profissao, ocupacao_atual) da tabela prospects. Análise de currículo/LinkedIn: Pode-se adicionar um campo linkedin_url ou curriculum_text na tabela prospects, que seria processado pela OpenAI no backend.
Lógica Backend (src/app/api/tools/get-opportunity/analyze-opportunity/route.ts):
Recebe prospectId.
Busca dados relevantes do prospect.
Integra com cities (para job_market_score, business_opportunity_score), professional_courses.
Cria um prompt para a OpenAI para gerar sugestões de:
Ocupações em demanda por região.
Cálculo de compatibilidade com setores econômicos.
Ideias de pequenos negócios com base no perfil do usuário.
Caminhos de certificação.
Armazenamento de Saída: O campo analise_getopportunity (JSONB para dados estruturados, ou TEXT) na tabela prospects.
Frontend (src/app/(app)/get-opportunity/[prospectId]/page.tsx que renderiza src/components/tools/get-opportunity/GetOpportunityClient.tsx):
Página de visualização dos dados do prospect e da análise de oportunidades da IA.
Botão "Gerar Análise de Oportunidades".
Permite edição de campos relevantes para refinar a análise.

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-get-opportunity.ts`
  - Recebe `prospectId` via POST.
  - Busca o perfil do usuário no Supabase.
  - Gera análise de oportunidades usando OpenAI.
  - Salva o resultado no campo `analise_getopportunity` da tabela `prospects`.
  - Retorna resposta padronizada para o frontend.

- **Frontend modular (Vite + React + Tailwind):**
  - Componente criado em `web/src/components/tools/get-opportunity/`:
    - `GetOpportunityClient.tsx` (componente principal)
  - Página de exemplo: `web/src/pages/GetOpportunityPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-get-opportunity`.

## Como reutilizar no Dashboard do usuário

O componente principal `GetOpportunityClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente, passando o `prospectId` do usuário logado:

```jsx
import GetOpportunityClient from '../components/tools/get-opportunity/GetOpportunityClient'

function Dashboard({ user }) {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <GetOpportunityClient prospectId={user.prospectId} />
    </div>
  )
}
```

Dessa forma, a análise de oportunidades aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.