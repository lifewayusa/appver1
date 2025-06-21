Simulador de Entrevista
Objetivo: Uma simulação realista da entrevista no consulado americano, com perguntas personalizadas, avaliação de respostas e feedback construtivo.
Entrada de Dados: Tipo de visto desejado (selecionado pelo usuário), perfil do usuário (vistos_anteriores, ja_teve_visto_negad, profissao, motivo_migracao, escolaridade, ingles_nivel, etc.) da tabela prospects.
Lógica Backend (src/app/api/tools/interview-simulator/simulate-interview/route.ts):
Recebe prospectId e o tipo de visto.
Busca dados do prospect.
Cria um prompt para a OpenAI para:
Gerar perguntas personalizadas com base no perfil e tipo de visto.
Avaliar as respostas do usuário (se for texto ou transcrição de áudio).
Fornecer feedback construtivo (verbal e/ou textual) e dicas de melhoria.
Criar cenários por tipo de visto.
Armazenamento de Saída: simulador_entrevista_output (TEXT/JSONB) na tabela prospects.
Frontend (src/app/(app)/interview-simulator/[prospectId]/page.tsx que renderiza src/components/tools/interview-simulator/InterviewSimulatorClient.tsx):
Interface de chat ou gravação de voz.
Exibição de perguntas e feedback da IA.
Modo treino e modo desafio.

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-interview-simulator.ts`
  - Recebe `prospectId`, `visaType` e `answer` via POST.
  - Busca o perfil do usuário no Supabase.
  - Gera perguntas e feedback usando OpenAI.
  - Salva o resultado no campo `simulador_entrevista_output` da tabela `prospects`.
  - Retorna resposta padronizada para o frontend.

- **Frontend modular (Vite + React + Tailwind):**
  - Componentes criados em `web/src/components/tools/interview-simulator/`:
    - `InterviewSimulatorClient.tsx` (componente principal)
    - `InterviewModeSelector.tsx` (modo treino/desafio)
    - `InterviewQuestion.tsx` (exibe pergunta)
    - `InterviewChat.tsx` (input de texto)
    - `InterviewVoiceRecorder.tsx` (placeholder para áudio)
    - `InterviewFeedback.tsx` (exibe feedback)
  - Página de exemplo: `web/src/pages/InterviewSimulatorPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-interview-simulator`.

## Como reutilizar no Dashboard do usuário

O componente principal `InterviewSimulatorClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente, passando o `prospectId` do usuário logado:

```jsx
import InterviewSimulatorClient from '../components/tools/interview-simulator/InterviewSimulatorClient'

function Dashboard({ user }) {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <InterviewSimulatorClient prospectId={user.prospectId} />
    </div>
  )
}
```

Dessa forma, o Simulador de Entrevista aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.