-- ✅ CRIAÇÃO DA TABELA multistep_forms SE NÃO EXISTIR
-- Script para garantir que a tabela existe e pode armazenar freeFormAspirations

-- 1. Criar tabela multistep_forms se não existir
CREATE TABLE IF NOT EXISTS multistep_forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  data JSONB NOT NULL,  -- Aqui será armazenado freeFormAspirations dentro do JSON
  is_completed BOOLEAN DEFAULT FALSE,
  qualify BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_multistep_forms_user_id ON multistep_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_multistep_forms_is_completed ON multistep_forms(is_completed);
CREATE INDEX IF NOT EXISTS idx_multistep_forms_created_at ON multistep_forms(created_at DESC);

-- 3. Criar índice JSONB para buscar pelo campo freeFormAspirations
CREATE INDEX IF NOT EXISTS idx_multistep_forms_aspirations 
ON multistep_forms USING GIN ((data->>'freeFormAspirations'));

-- 4. Políticas RLS (Row Level Security) - opcional
ALTER TABLE multistep_forms ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON multistep_forms;
CREATE POLICY "Allow insert for authenticated users" 
ON multistep_forms FOR INSERT 
WITH CHECK (true);

-- Política para permitir seleção
DROP POLICY IF EXISTS "Allow select for authenticated users" ON multistep_forms;
CREATE POLICY "Allow select for authenticated users" 
ON multistep_forms FOR SELECT 
USING (true);

-- Política para permitir atualização
DROP POLICY IF EXISTS "Allow update for authenticated users" ON multistep_forms;
CREATE POLICY "Allow update for authenticated users" 
ON multistep_forms FOR UPDATE 
USING (true);

-- 5. Comentários para documentação
COMMENT ON TABLE multistep_forms IS 'Formulários multi-etapas dos usuários com dados completos em JSONB';
COMMENT ON COLUMN multistep_forms.data IS 'Dados completos do formulário incluindo freeFormAspirations';
COMMENT ON COLUMN multistep_forms.user_id IS 'ID do usuário (MD5 do email por enquanto)';
COMMENT ON COLUMN multistep_forms.is_completed IS 'Se o formulário foi completado totalmente';
COMMENT ON COLUMN multistep_forms.qualify IS 'Se o usuário se qualifica baseado nas respostas';

-- 6. Exemplo de inserção de teste para validar estrutura
INSERT INTO multistep_forms (user_id, data, is_completed, qualify) 
VALUES (
  'test-user-123',
  jsonb_build_object(
    'fullName', 'João Silva Teste',
    'email', 'joao@teste.com',
    'profession', 'Engenheiro',
    'usaObjectives', ARRAY['Trabalhar em empresa americana', 'Melhor qualidade de vida'],
    'targetStates', ARRAY['California', 'Texas'],
    'timeline', '1year',
    'freeFormAspirations', 'Quero que meus filhos tenham acesso a educação de qualidade mundial. Sonho em trabalhar com tecnologia no Vale do Silício. Tenho medo do processo ser muito complicado, mas estou determinado a dar essa oportunidade para minha família. Queremos construir um futuro sólido e próspero nos EUA.'
  ),
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. Verificar se a tabela foi criada e o campo pode ser acessado
SELECT 
  'Tabela multistep_forms criada com sucesso!' as status,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE data->>'freeFormAspirations' IS NOT NULL) as registros_com_aspiracoes
FROM multistep_forms;

-- 8. Consulta para validar o campo freeFormAspirations
SELECT 
  user_id,
  data->>'fullName' as nome,
  data->>'email' as email,
  data->>'freeFormAspirations' as aspiracoes,
  LENGTH(data->>'freeFormAspirations') as tamanho_aspiracoes,
  is_completed,
  created_at
FROM multistep_forms 
WHERE data->>'freeFormAspirations' IS NOT NULL
ORDER BY created_at DESC;

-- ✅ PRONTO! 
-- A tabela multistep_forms agora existe e pode armazenar o campo freeFormAspirations
-- Execute este script no painel SQL do Supabase
