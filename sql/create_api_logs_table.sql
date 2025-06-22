-- Tabela para logs detalhados das APIs
CREATE TABLE IF NOT EXISTS api_logs (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  tool_name VARCHAR(100) NOT NULL,
  step VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  user_data JSONB,
  prompt_content TEXT,
  openai_request JSONB,
  openai_response JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_tool_name ON api_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_api_logs_status ON api_logs(status);

-- Comentários para documentação
COMMENT ON TABLE api_logs IS 'Logs detalhados de todas as chamadas das APIs das ferramentas';
COMMENT ON COLUMN api_logs.step IS 'Etapa do processo: prompt_loaded, openai_request, openai_response, db_save, completed, error';
COMMENT ON COLUMN api_logs.status IS 'Status: success, error, in_progress';
