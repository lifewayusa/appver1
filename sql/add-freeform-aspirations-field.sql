-- Script para verificar se o campo freeFormAspirations existe nos dados JSONB
-- e criar documentação sobre sua estrutura

-- 1. Verificar se existem registros com o campo freeFormAspirations
SELECT 
    id,
    created_at,
    data->'freeFormAspirations' as free_form_aspirations,
    data->'objectives' as objectives,
    CASE 
        WHEN data ? 'freeFormAspirations' THEN 'CAMPO EXISTE'
        ELSE 'CAMPO NÃO EXISTE'
    END as campo_status
FROM multistep_forms 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Contar quantos registros têm o campo
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN data ? 'freeFormAspirations' THEN 1 END) as com_campo_aspiracoes,
    COUNT(CASE WHEN data ? 'freeFormAspirations' THEN NULL ELSE 1 END) as sem_campo_aspiracoes
FROM multistep_forms;

-- 3. Ver estrutura completa do JSONB dos registros mais recentes
SELECT 
    id,
    created_at,
    jsonb_pretty(data) as estrutura_dados
FROM multistep_forms 
ORDER BY created_at DESC 
LIMIT 3;

-- 4. Verificar se há registros com aspirações preenchidas
SELECT 
    id,
    data->'freeFormAspirations' as aspiracoes,
    length(data->>'freeFormAspirations') as tamanho_texto
FROM multistep_forms 
WHERE data ? 'freeFormAspirations' 
    AND data->>'freeFormAspirations' IS NOT NULL 
    AND data->>'freeFormAspirations' != ''
ORDER BY created_at DESC;
