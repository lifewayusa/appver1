ProjectUSA
Objetivo: Ferramenta de planejamento avançado que atua como um "gerente de projeto" digital para a mudança definitiva para os Estados Unidos.
Entrada de Dados: Todos os dados do prospect (prospect principal, cônjuge, filhos) e os outputs das ferramentas "VisaMatch" e "FamilyPlanner" (analise_visamatch, analise_familyplanner).
Lógica Backend (src/app/api/tools/project-usa/generate-plan/route.ts - Opcional):
Não usa IA para gerar o plano, mas pode ter uma API Route para consolidar os dados e os outputs das IAs em um formato estruturado que alimentará a timeline.
Armazenamento de Saída: plano_projectusa_output (TEXT/JSONB) na tabela prospects.
Frontend (src/app/(app)/project-usa/[prospectId]/page.tsx que renderiza src/components/tools/project-usa/ProjectUSAClient.tsx):
Recursos-chave:
Timeline interativa com todas as etapas até a mudança.
Integração visual com os outputs do VisaMatch e FamilyPlanner.
Acompanhamento do progresso por fases (legal, educacional, profissional, habitacional).
Alertas e prazos críticos (entrevistas, provas, traduções).
Simulação de custos por etapa (pode ser interativa no frontend).
Gerenciamento de checklist de itens (usuário pode adicionar/remover/marcar concluído).

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-project-usa.ts`
  - Recebe `prospectId` via POST.
  - Busca o perfil do usuário no Supabase.
  - Gera plano de vida e etapas usando OpenAI.
  - Salva o resultado no campo `analise_projectusa` da tabela `prospects`.
  - Retorna resposta padronizada para o frontend.

- **Frontend modular (Vite + React + Tailwind):**
  - Componente criado em `web/src/components/tools/project-usa/`:
    - `ProjectUSAClient.tsx` (componente principal)
  - Página de exemplo: `web/src/pages/ProjectUSAPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-project-usa`.

## Como reutilizar no Dashboard do usuário

O componente principal `ProjectUSAClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente, passando o `prospectId` do usuário logado:

```jsx
import ProjectUSAClient from '../components/tools/project-usa/ProjectUSAClient'

function Dashboard({ user }) {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <ProjectUSAClient prospectId={user.prospectId} />
    </div>
  )
}
```

Dessa forma, o ProjectUSA aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.