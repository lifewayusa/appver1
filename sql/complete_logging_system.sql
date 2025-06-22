-- Sistema de Logs Completo e Robusto para LifewayUSA
-- Versão aprimorada com logs granulares e analytics

-- Tabela principal de logs da API
CREATE TABLE IF NOT EXISTS api_logs (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Identificação da operação
  request_id UUID DEFAULT gen_random_uuid(),
  session_id TEXT,
  user_ip INET,
  user_agent TEXT,
  
  -- Contexto da ferramenta
  tool_name VARCHAR(100) NOT NULL,
  endpoint VARCHAR(200) NOT NULL,
  http_method VARCHAR(10) NOT NULL,
  
  -- Etapa do processo
  step VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('started', 'in_progress', 'success', 'error', 'timeout')),
  
  -- Dados do usuário (sem informações sensíveis)
  user_email TEXT,
  user_data JSONB,
  
  -- Request/Response data
  request_body JSONB,
  response_body JSONB,
  http_status_code INTEGER,
  
  -- OpenAI específico
  prompt_content TEXT,
  openai_model VARCHAR(50),
  openai_tokens_used INTEGER,
  openai_request JSONB,
  openai_response JSONB,
  openai_cost_usd DECIMAL(10,6),
  
  -- Performance metrics
  execution_time_ms INTEGER,
  memory_usage_mb DECIMAL(10,2),
  
  -- Error handling
  error_type VARCHAR(100),
  error_message TEXT,
  error_stack TEXT,
  
  -- Business metrics
  conversion_step VARCHAR(100),
  lead_quality_score INTEGER,
  
  -- Metadata adicional
  environment VARCHAR(20) DEFAULT 'production',
  version VARCHAR(20),
  metadata JSONB
);

-- Índices otimizados para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_tool_name ON api_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_api_logs_status ON api_logs(status);
CREATE INDEX IF NOT EXISTS idx_api_logs_step ON api_logs(step);
CREATE INDEX IF NOT EXISTS idx_api_logs_request_id ON api_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_email ON api_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_api_logs_error_type ON api_logs(error_type) WHERE error_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_api_logs_performance ON api_logs(execution_time_ms DESC) WHERE execution_time_ms > 1000;

-- Tabela de métricas agregadas (para performance de dashboards)
CREATE TABLE IF NOT EXISTS api_metrics_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  
  -- Contadores
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  
  -- Performance
  avg_execution_time_ms DECIMAL(10,2),
  max_execution_time_ms INTEGER,
  min_execution_time_ms INTEGER,
  
  -- OpenAI usage
  total_tokens_used INTEGER DEFAULT 0,
  total_openai_cost_usd DECIMAL(10,6) DEFAULT 0,
  
  -- Business metrics
  total_leads INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  
  -- Error analysis
  top_errors JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(date, tool_name)
);

CREATE INDEX IF NOT EXISTS idx_api_metrics_date ON api_metrics_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_api_metrics_tool ON api_metrics_daily(tool_name);

-- Tabela de sessions do usuário
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_email TEXT,
  user_ip INET,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_requests INTEGER DEFAULT 0,
  tools_used TEXT[],
  conversion_funnel JSONB,
  ended_at TIMESTAMP WITH TIME ZONE,
  session_duration_minutes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON user_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);

-- Policies para logs (somente inserção pública, leitura apenas admin)
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert logs" ON api_logs;
CREATE POLICY "Allow public insert logs" ON api_logs 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read logs" ON api_logs;
CREATE POLICY "Allow admin read logs" ON api_logs 
  FOR SELECT USING (true); -- Ajustar para apenas admins em produção

-- Policies para métricas
ALTER TABLE api_metrics_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin access metrics" ON api_metrics_daily;
CREATE POLICY "Allow admin access metrics" ON api_metrics_daily 
  FOR ALL USING (true); -- Ajustar para apenas admins em produção

-- Policies para sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert sessions" ON user_sessions;
CREATE POLICY "Allow public insert sessions" ON user_sessions 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin read sessions" ON user_sessions;
CREATE POLICY "Allow admin read sessions" ON user_sessions 
  FOR SELECT USING (true); -- Ajustar para apenas admins em produção

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_logs_updated_at 
    BEFORE UPDATE ON api_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para agregar métricas diárias (executar via cron)
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
BEGIN
    INSERT INTO api_metrics_daily (
        date, tool_name, total_requests, successful_requests, failed_requests,
        avg_execution_time_ms, max_execution_time_ms, min_execution_time_ms,
        total_tokens_used, total_openai_cost_usd, total_leads, qualified_leads, conversion_rate
    )
    SELECT 
        target_date,
        tool_name,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'success') as successful_requests,
        COUNT(*) FILTER (WHERE status = 'error') as failed_requests,
        AVG(execution_time_ms) as avg_execution_time_ms,
        MAX(execution_time_ms) as max_execution_time_ms,
        MIN(execution_time_ms) as min_execution_time_ms,
        COALESCE(SUM(openai_tokens_used), 0) as total_tokens_used,
        COALESCE(SUM(openai_cost_usd), 0) as total_openai_cost_usd,
        COUNT(*) FILTER (WHERE step = 'completed') as total_leads,
        COUNT(*) FILTER (WHERE step = 'completed' AND lead_quality_score >= 7) as qualified_leads,
        CASE 
            WHEN COUNT(*) FILTER (WHERE step = 'started') > 0 
            THEN (COUNT(*) FILTER (WHERE step = 'completed')::DECIMAL / COUNT(*) FILTER (WHERE step = 'started')) * 100 
            ELSE 0 
        END as conversion_rate
    FROM api_logs 
    WHERE DATE(created_at) = target_date
    GROUP BY tool_name
    ON CONFLICT (date, tool_name) DO UPDATE SET
        total_requests = EXCLUDED.total_requests,
        successful_requests = EXCLUDED.successful_requests,
        failed_requests = EXCLUDED.failed_requests,
        avg_execution_time_ms = EXCLUDED.avg_execution_time_ms,
        max_execution_time_ms = EXCLUDED.max_execution_time_ms,
        min_execution_time_ms = EXCLUDED.min_execution_time_ms,
        total_tokens_used = EXCLUDED.total_tokens_used,
        total_openai_cost_usd = EXCLUDED.total_openai_cost_usd,
        total_leads = EXCLUDED.total_leads,
        qualified_leads = EXCLUDED.qualified_leads,
        conversion_rate = EXCLUDED.conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE api_logs IS 'Logs detalhados e completos de todas as operações das APIs';
COMMENT ON COLUMN api_logs.step IS 'Etapa: started, prompt_loaded, openai_request, openai_response, db_save, completed, error';
COMMENT ON COLUMN api_logs.status IS 'Status: started, in_progress, success, error, timeout';
COMMENT ON COLUMN api_logs.lead_quality_score IS 'Score de 1-10 baseado na qualidade do lead';

COMMENT ON TABLE api_metrics_daily IS 'Métricas agregadas diárias para dashboards rápidos';
COMMENT ON TABLE user_sessions IS 'Sessões de usuário para análise de funil de conversão';

-- Views úteis para relatórios
CREATE OR REPLACE VIEW v_recent_errors AS
SELECT 
    created_at,
    tool_name,
    step,
    error_type,
    error_message,
    user_email,
    execution_time_ms,
    request_id
FROM api_logs 
WHERE status = 'error' 
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW v_tool_performance AS
SELECT 
    tool_name,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'success') as successful_requests,
    ROUND(AVG(execution_time_ms), 2) as avg_execution_time_ms,
    MAX(execution_time_ms) as max_execution_time_ms,
    COUNT(*) FILTER (WHERE status = 'error') as error_count,
    ROUND((COUNT(*) FILTER (WHERE status = 'success')::DECIMAL / COUNT(*)) * 100, 2) as success_rate
FROM api_logs 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY tool_name
ORDER BY total_requests DESC;

CREATE OR REPLACE VIEW v_openai_usage AS
SELECT 
    DATE(created_at) as date,
    tool_name,
    SUM(openai_tokens_used) as total_tokens,
    SUM(openai_cost_usd) as total_cost_usd,
    COUNT(*) as requests_count,
    AVG(openai_tokens_used) as avg_tokens_per_request
FROM api_logs 
WHERE openai_tokens_used > 0 
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), tool_name
ORDER BY date DESC, total_cost_usd DESC;
