-- Adicionar campo freeFormAspirations na tabela multistep_forms
ALTER TABLE multistep_forms 
ADD COLUMN IF NOT EXISTS free_form_aspirations TEXT;
