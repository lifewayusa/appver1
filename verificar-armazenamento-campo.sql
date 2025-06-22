-- Verificação da estrutura onde o campo freeFormAspirations será armazenado

-- 1. TABELA PRINCIPAL: multistep_forms
-- O campo freeFormAspirations será armazenado dentro da coluna 'data' (tipo JSONB)

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'multistep_forms' 
ORDER BY ordinal_position;

-- Exemplo de como os dados serão armazenados:
-- {
--   "fullName": "João Silva", 
--   "email": "joao@email.com",
--   "profession": "Engenheiro",
--   "usaObjectives": ["Trabalhar em empresa americana", "Melhor qualidade de vida"],
--   "targetStates": ["California", "Texas"],
--   "timeline": "1year",
--   "freeFormAspirations": "Quero que meus filhos tenham acesso a educação de qualidade, sonho em trabalhar com tecnologia no Vale do Silício..."
-- }

-- 2. LOGS DETALHADOS: api_logs
-- Todos os dados também são logados na tabela api_logs para auditoria

SELECT 
    tool_name,
    endpoint,
    step,
    status,
    metadata
FROM api_logs 
WHERE tool_name = 'multistep-form'
ORDER BY created_at DESC
LIMIT 5;

-- 3. INTEGRAÇÃO COM OPENAI: user_reports  
-- Quando o formulário é completado, uma análise personalizada é gerada e salva

SELECT 
    tool_type,
    user_data,
    generated_report
FROM user_reports 
WHERE tool_type = 'criador-sonhos'
ORDER BY created_at DESC
LIMIT 3;
