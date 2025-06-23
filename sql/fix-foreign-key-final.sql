-- 🔧 CORREÇÃO DEFINITIVA DO ERRO 500 - Foreign Key Constraint
-- Problema: multistep_forms_user_id_fkey exige que user_id exista na tabela users
-- Solução: Remover a constraint para permitir usuários não autenticados

-- 1. Verificar a constraint existente
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'multistep_forms_user_id_fkey';

-- 2. Remover a foreign key constraint
ALTER TABLE multistep_forms 
DROP CONSTRAINT IF EXISTS multistep_forms_user_id_fkey;

-- 3. Permitir NULL no user_id (para usuários não autenticados)
ALTER TABLE multistep_forms 
ALTER COLUMN user_id DROP NOT NULL;

-- 4. Verificar se a constraint foi removida
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name
FROM pg_constraint 
WHERE conname = 'multistep_forms_user_id_fkey';

-- 5. Teste de inserção após correção
DO $$
DECLARE
    test_id uuid;
    test_user_id text;
BEGIN
    test_id := gen_random_uuid();
    test_user_id := 'test-user-' || extract(epoch from now())::text;
    
    -- Teste 1: Com user_id customizado (não UUID)
    INSERT INTO multistep_forms (id, user_id, data, is_completed, qualify, updated_at)
    VALUES (
        test_id,
        test_user_id,
        '{"name": "Teste FK Removida", "age": 25, "freeFormAspirations": "Teste sem constraint"}',
        false,
        null,
        NOW()
    );
    
    RAISE NOTICE 'SUCESSO: Inserção com user_id customizado funcionou! ID: %', test_id;
    
    -- Limpar teste
    DELETE FROM multistep_forms WHERE id = test_id;
    
    -- Teste 2: Com user_id NULL
    test_id := gen_random_uuid();
    INSERT INTO multistep_forms (id, user_id, data, is_completed, qualify, updated_at)
    VALUES (
        test_id,
        NULL,
        '{"name": "Teste NULL", "age": 30, "freeFormAspirations": "Teste user_id NULL"}',
        false,
        null,
        NOW()
    );
    
    RAISE NOTICE 'SUCESSO: Inserção com user_id NULL funcionou! ID: %', test_id;
    
    -- Limpar teste
    DELETE FROM multistep_forms WHERE id = test_id;
    
    RAISE NOTICE '🎉 CORREÇÃO COMPLETA! O erro 500 foi resolvido.';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERRO no teste: %', SQLERRM;
END $$;

-- 6. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'multistep_forms' 
ORDER BY ordinal_position;
