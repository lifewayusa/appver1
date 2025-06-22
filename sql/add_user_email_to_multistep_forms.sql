-- Adicionar campo user_email à tabela multistep_forms para simplificar a API
-- Como alternativa ao relacionamento com a tabela users

ALTER TABLE multistep_forms 
ADD COLUMN IF NOT EXISTS user_email text;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_multistep_forms_user_email 
ON multistep_forms(user_email);

-- Exemplo de como migrar dados existentes se necessário:
-- UPDATE multistep_forms 
-- SET user_email = (SELECT email FROM users WHERE users.id = multistep_forms.user_id)
-- WHERE user_email IS NULL AND user_id IS NOT NULL;
