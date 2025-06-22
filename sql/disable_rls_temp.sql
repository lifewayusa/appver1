-- Desabilitar temporariamente RLS para testes da API de formulário
-- ATENÇÃO: Isso deve ser reabilitado em produção!

ALTER TABLE multistep_forms DISABLE ROW LEVEL SECURITY;

-- Para reabilitar depois:
-- ALTER TABLE multistep_forms ENABLE ROW LEVEL SECURITY;
