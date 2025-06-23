-- Script para verificar e corrigir foreign key constraints na tabela multistep_forms
-- Executa: Remove constraints problemáticas que podem estar causando erro 500

-- 1. Verificar constraints existentes
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'multistep_forms';

-- 2. Remover foreign key constraint do user_id se existir
DO $$ 
BEGIN
    -- Verificar se existe constraint FK no user_id
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'multistep_forms' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND kcu.column_name = 'user_id'
    ) THEN
        -- Encontrar o nome da constraint e removê-la
        EXECUTE (
            SELECT 'ALTER TABLE multistep_forms DROP CONSTRAINT ' || constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = 'multistep_forms' 
            AND constraint_type = 'FOREIGN KEY'
            AND constraint_name IN (
                SELECT constraint_name 
                FROM information_schema.key_column_usage 
                WHERE table_name = 'multistep_forms' 
                AND column_name = 'user_id'
            )
            LIMIT 1
        );
        
        RAISE NOTICE 'Foreign key constraint removida do user_id';
    ELSE
        RAISE NOTICE 'Nenhuma foreign key constraint encontrada no user_id';
    END IF;
END $$;

-- 3. Verificar se o campo user_id permite NULL (flexibilidade para usuários não autenticados)
ALTER TABLE multistep_forms ALTER COLUMN user_id DROP NOT NULL;

-- 4. Teste de inserção para validar que não há mais erro 500
DO $$
DECLARE
    test_id text;
BEGIN
    test_id := gen_random_uuid()::text;
    
    INSERT INTO multistep_forms (id, user_id, data, is_completed, qualify, updated_at)
    VALUES (
        test_id,
        'test-no-fk-' || extract(epoch from now())::text,
        '{"freeFormAspirations": "Testar sem FK constraint", "name": "Teste FK", "age": 30}',
        false,
        null,
        NOW()
    );
    
    RAISE NOTICE 'Inserção de teste bem-sucedida com ID: %', test_id;
    
    -- Limpar teste
    DELETE FROM multistep_forms WHERE id = test_id;
    RAISE NOTICE 'Teste limpo com sucesso';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro no teste: %', SQLERRM;
END $$;

-- 5. Verificar estrutura final da tabela
\d multistep_forms;
