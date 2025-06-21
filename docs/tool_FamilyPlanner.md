FamilyPlanner (Revisado)
Objetivo: Criar roteiros personalizados de viagem com foco em turismo, prospecção e avaliação real de possíveis locais para viver, estudar e trabalhar nos EUA, transformando informações familiares em um itinerário sob medida.
Entrada de Dados: Perfil familiar completo da tabela prospects (nome, idade, estado_civil, sem_conjuge, nome_conjuge, idade_conjuge, filhos (JSONB), motivo_migracao, cidades_interesse, filhos_escola, adulto_naofamilia, adulto_universidade, adulto_inglescourse, adulto_cursos, saude_condicoes (nos filhos), historico_imigratorio_eua (nos filhos), vistos_anteriores, ja_morou_exterior).
Lógica Backend (src/app/api/tools/family-planner/analyze-family/route.ts):
Recebe prospectId.
Busca todos os dados familiares do prospect.
Integra com cities (para average_temperature, cost_of_living_index, education_score, business_opportunity_score), schools, universities, cursos_de_ingles, professional_courses para sugestões de locais/atividades.
Cria prompt para a OpenAI gerando:
Sugestão de cidades com base no perfil familiar.
Roteiro de viagem otimizado (tempo, deslocamento, prioridades).
Locais recomendados para visita (escolas, bairros, centros empresariais).
Checklist de prospecção por cidade.
Dicas de turismo integradas à missão de mudança.
Simulador de viagem de Prospecção (cenários).
Armazenamento de Saída: O campo analise_familyplanner (TEXT/JSONB) na tabela prospects.
Frontend (src/app/(app)/family-planner/[prospectId]/page.tsx que renderiza src/components/tools/family-planner/FamilyPlannerClient.tsx):
Página de visualização e edição de dados familiares.
Exibe o roteiro gerado pela IA.
Botão para gerar nova análise.

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-family-planner.ts`
  - Recebe `prospectId` via POST.
  - Busca o perfil familiar do usuário no Supabase.
  - Gera roteiro e análise usando OpenAI.
  - Salva o resultado no campo `analise_familyplanner` da tabela `prospects`.
  - Retorna resposta padronizada para o frontend.

- **Frontend modular (Vite + React + Tailwind):**
  - Componente criado em `web/src/components/tools/family-planner/`:
    - `FamilyPlannerClient.tsx` (componente principal)
  - Página de exemplo: `web/src/pages/FamilyPlannerPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-family-planner`.

## Como reutilizar no Dashboard do usuário

O componente principal `FamilyPlannerClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente, passando o `prospectId` do usuário logado:

```jsx
import FamilyPlannerClient from '../components/tools/family-planner/FamilyPlannerClient'

function Dashboard({ user }) {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <FamilyPlannerClient prospectId={user.prospectId} />
    </div>
  )
}
```

Dessa forma, o FamilyPlanner aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.