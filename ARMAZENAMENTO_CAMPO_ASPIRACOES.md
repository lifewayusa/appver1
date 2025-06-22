# 📍 ONDE O CAMPO `freeFormAspirations` É ARMAZENADO

## 1. **Tabela Principal: `multistep_forms`**
```sql
CREATE TABLE multistep_forms (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  data JSONB NOT NULL,  -- ← AQUI o campo freeFormAspirations é armazenado
  is_completed BOOLEAN DEFAULT FALSE,
  qualify BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Estrutura do JSONB na coluna `data`:**
```json
{
  "fullName": "João Silva",
  "email": "joao@email.com", 
  "profession": "Engenheiro",
  "usaObjectives": ["Trabalhar em empresa americana"],
  "targetStates": ["California", "Texas"],
  "timeline": "1year",
  "freeFormAspirations": "Quero que meus filhos tenham acesso a educação de qualidade, sonho em trabalhar com tecnologia no Vale do Silício, tenho medo do processo ser muito complicado, mas estou determinado..."
}
```

---

## 2. **Sistema de Logs: `api_logs`**
```sql
INSERT INTO api_logs (
  tool_name,
  endpoint, 
  step,
  status,
  user_email,
  request_body,     -- ← Dados completos do formulário incluindo freeFormAspirations
  metadata          -- ← Metadados sobre o processamento
);
```

**Exemplo de log:**
```json
{
  "tool_name": "multistep-form",
  "endpoint": "/api/form/save",
  "user_email": "joao@email.com",
  "request_body": {
    "form_data": {
      "freeFormAspirations": "Quero que meus filhos..."
    }
  },
  "metadata": {
    "form_data_keys": ["fullName", "email", "freeFormAspirations", ...]
  }
}
```

---

## 3. **Análise Personalizada: `user_reports`**
```sql
INSERT INTO user_reports (
  tool_type,
  user_data,         -- ← Dados do usuário incluindo freeFormAspirations  
  generated_report,  -- ← Análise personalizada gerada pela OpenAI
  created_at
);
```

**Como é usado na análise:**
```json
{
  "tool_type": "criador-sonhos",
  "user_data": {
    "email": "joao@email.com",
    "freeFormAspirations": "Quero que meus filhos...",
    "adultDreams": "Quero que meus filhos..."  // ← Mapeado para o prompt
  },
  "generated_report": "🌟 **Análise Personalizada do Seu Sonho Americano**\n\nBased on your aspirations about your children's education..."
}
```

---

## 4. **LocalStorage (Backup Local)**
```javascript
// Salvamento automático no navegador
localStorage.setItem('lifewayusa_form_data', JSON.stringify({
  fullName: "João Silva",
  freeFormAspirations: "Quero que meus filhos...",
  // ... outros campos
}));
```

---

## 5. **Integração com OpenAI (Prompt)**

O campo é enviado para a OpenAI como parte do prompt personalizado:

```javascript
// app/api/tools/criador-sonhos/process-form/route.ts
const fullPrompt = `
### Sonhos e Aspirações:
- Sonhos dos adultos: ${userData.adultDreams || userData.freeFormAspirations || 'Buscar uma vida melhor nos EUA'}
- Experiências familiares desejadas: ${userData.familyExperiences || userData.freeFormAspirations || 'Não informado'}

### Dados detalhados fornecidos pelo usuário:
"${userData.freeFormAspirations}"
`;
```

---

## 🔍 **Como Verificar se Está Funcionando**

### 1. Verificar na tabela multistep_forms:
```sql
SELECT 
  user_id,
  data->>'freeFormAspirations' as aspirations,
  data->>'fullName' as name,
  created_at
FROM multistep_forms 
WHERE data->>'freeFormAspirations' IS NOT NULL
ORDER BY created_at DESC;
```

### 2. Verificar nos logs:
```sql
SELECT 
  user_email,
  request_body->>'form_data'->>'freeFormAspirations' as aspirations,
  created_at
FROM api_logs 
WHERE tool_name = 'multistep-form'
AND request_body->>'form_data'->>'freeFormAspirations' IS NOT NULL
ORDER BY created_at DESC;
```

### 3. Verificar análises geradas:
```sql
SELECT 
  user_data->>'freeFormAspirations' as aspirations,
  LENGTH(generated_report) as report_length,
  created_at
FROM user_reports 
WHERE tool_type = 'criador-sonhos'
ORDER BY created_at DESC;
```

---

## ✅ **Fluxo Completo de Armazenamento**

1. **Usuário preenche** o campo no formulário
2. **LocalStorage salva** automaticamente (backup)
3. **API /form/save** recebe e armazena na tabela `multistep_forms`
4. **Sistema de logs** registra a operação na tabela `api_logs`
5. **Criador de Sonhos** usa o campo para gerar análise personalizada
6. **Análise é salva** na tabela `user_reports`
7. **Usuário recebe** a resposta personalizada baseada em suas aspirações

**O campo está completamente integrado em todo o sistema!** 🎯
