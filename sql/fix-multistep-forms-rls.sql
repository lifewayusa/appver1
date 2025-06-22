-- Desabilitar RLS temporariamente para permitir inserções
ALTER TABLE multistep_forms DISABLE ROW LEVEL SECURITY;

-- Verificar se a tabela existe e sua estrutura
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'multistep_forms' 
ORDER BY ordinal_position;

-- Inserir um registro de teste para verificar se o campo freeFormAspirations funciona
INSERT INTO multistep_forms (id, user_id, data, is_completed, qualify, updated_at)
VALUES (
  gen_random_uuid()::text,
  'test-user-123',
  '{"freeFormAspirations": "Quero ser um desenvolvedor de sucesso", "name": "Teste", "age": 25}',
  false,
  null,
  NOW()
);

-- Verificar se foi inserido com sucesso
SELECT id, user_id, data->>'freeFormAspirations' as aspirations, created_at 
FROM multistep_forms 
WHERE user_id = 'test-user-123';

-- Reabilitar RLS com política mais permissiva
ALTER TABLE multistep_forms ENABLE ROW LEVEL SECURITY;

-- Criar política que permite tudo para service_role
DROP POLICY IF EXISTS "Allow all for service role" ON multistep_forms;
CREATE POLICY "Allow all for service role" 
ON multistep_forms FOR ALL 
USING (true);
