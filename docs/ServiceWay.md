ServiceWay (Marketplace de Serviços)
Objetivo: Criar conexão com corretores imobiliários, serviços de mudança internacional, contadores especializados e escolas de inglês.
Dados:
Nova Tabela public.partners:
id (UUID)
name (TEXT)
service_type (TEXT, ex: 'Imobiliário', 'Mudanças', 'Contabilidade', 'Escola de Inglês')
contact_info (JSONB, ex: {email, phone, website})
description (TEXT)
plan (TEXT, ex: 'Free', 'Pro', 'Premium') - Para controle de visibilidade.
logo_url (TEXT)
city_id (UUID, FK para public.cities.id) - Opcional, se o parceiro for local.
created_at, updated_at.
Nova Tabela public.leads (Opcional): Para parceiros comprarem leads de usuários.
id (UUID)
partner_id (UUID, FK para public.partners.id)
prospect_id (INT, FK para public.prospects.id)
status (TEXT, ex: 'Novo', 'Contactado', 'Convertido')
data_lead (TIMESTAMP)
Lógica Backend (src/app/api/tools/service-way/get-partners/route.ts, buy-lead/route.ts):
API para listar parceiros (filtrar por tipo de serviço, plano, localização).
API para registrar compra de leads (chamada N8N para notificar parceiro).
Frontend (src/app/(app)/service-way/page.tsx que renderiza src/components/tools/service-way/ServiceWayClient.tsx):
Página de busca/listagem de parceiros.
Detalhes do parceiro.
Formulário para solicitar contato/comprar lead.
Visualização proporcional ao plano de adesão do parceiro.

## Implementação já realizada

- **Backend independente:**
  - Arquivo: `api/tools-service-way.ts`
  - GET: Lista parceiros (filtros opcionais: tipo, cidade, plano).
  - POST: Registra compra de lead (parceiro, prospect).
  - Integração opcional com webhook N8N para notificação.

- **Frontend modular (Vite + React + Tailwind):**
  - Componente criado em `web/src/components/tools/service-way/`:
    - `ServiceWayClient.tsx` (componente principal)
  - Página de exemplo: `web/src/pages/ServiceWayPage.jsx`
  - Integração frontend-backend via fetch para `/api/tools-service-way`.

## Como reutilizar no Dashboard do usuário

O componente principal `ServiceWayClient` foi projetado para ser facilmente reutilizado em qualquer parte do sistema, inclusive no Dashboard do usuário. Basta importar e renderizar o componente:

```jsx
import ServiceWayClient from '../components/tools/service-way/ServiceWayClient'

function Dashboard() {
  // ...outros widgets/cards...
  return (
    <div>
      {/* ...outros elementos do dashboard... */}
      <ServiceWayClient />
    </div>
  )
}
```

Dessa forma, o marketplace de serviços aparece como um card/widget interativo dentro do Dashboard, mantendo a experiência integrada e reaproveitando toda a lógica já implementada.