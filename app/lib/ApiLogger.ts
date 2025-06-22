import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export interface LogEntry {
  tool_name: string;
  endpoint: string;
  http_method: string;
  step: string;
  status: 'started' | 'in_progress' | 'success' | 'error' | 'timeout';
  user_email?: string;
  user_data?: any;
  request_body?: any;
  response_body?: any;
  http_status_code?: number;
  prompt_content?: string;
  openai_model?: string;
  openai_tokens_used?: number;
  openai_request?: any;
  openai_response?: any;
  openai_cost_usd?: number;
  execution_time_ms?: number;
  memory_usage_mb?: number;
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  conversion_step?: string;
  lead_quality_score?: number;
  session_id?: string;
  user_ip?: string;
  user_agent?: string;
  metadata?: any;
}

export class ApiLogger {
  private supabase;
  private startTime: number = 0;
  private memoryStart: number = 0;
  private requestId: string;
  private sessionId: string;
  private baseLog: Partial<LogEntry>;

  constructor(
    toolName: string, 
    endpoint: string, 
    httpMethod: string, 
    request?: NextRequest,
    userEmail?: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.startTime = Date.now();
    this.memoryStart = this.getMemoryUsage();
    this.requestId = this.generateRequestId();
    this.sessionId = this.extractSessionId(request);

    this.baseLog = {
      tool_name: toolName,
      endpoint: endpoint,
      http_method: httpMethod,
      user_email: userEmail,
      session_id: this.sessionId,
      user_ip: this.extractIP(request),
      user_agent: request?.headers.get('user-agent') || undefined,
    };

    // Log inicial
    this.logStep('started', 'started');
  }

  /**
   * Log de uma etapa específica do processo
   */
  async logStep(
    step: string, 
    status: LogEntry['status'], 
    additionalData: Partial<LogEntry> = {}
  ): Promise<void> {
    try {
      const logEntry: LogEntry = {
        ...this.baseLog,
        step,
        status,
        execution_time_ms: Date.now() - this.startTime,
        memory_usage_mb: this.getMemoryUsage() - this.memoryStart,
        ...additionalData,
      } as LogEntry;

      const { error } = await this.supabase
        .from('api_logs')
        .insert([logEntry]);

      if (error) {
        console.error('Erro ao salvar log:', error);
        // Fallback para console em caso de erro no banco
        console.log('LOG_FALLBACK:', JSON.stringify(logEntry, null, 2));
      }
    } catch (err) {
      console.error('Erro crítico no sistema de logs:', err);
      console.log('LOG_CRITICAL_FALLBACK:', { step, status, ...additionalData });
    }
  }

  /**
   * Log específico para requisições OpenAI
   */
  async logOpenAI(
    prompt: string,
    model: string,
    request: any,
    response: any,
    tokensUsed?: number,
    costUsd?: number
  ): Promise<void> {
    await this.logStep('openai_request', 'in_progress', {
      prompt_content: prompt,
      openai_model: model,
      openai_request: request,
      openai_response: response,
      openai_tokens_used: tokensUsed,
      openai_cost_usd: costUsd,
    });
  }

  /**
   * Log de erro com stack trace completo
   */
  async logError(
    step: string,
    error: Error | string,
    additionalContext: any = {}
  ): Promise<void> {
    const errorObj = error instanceof Error ? error : new Error(error);
    
    await this.logStep(step, 'error', {
      error_type: errorObj.name,
      error_message: errorObj.message,
      error_stack: errorObj.stack,
      metadata: additionalContext,
    });
  }

  /**
   * Log de sucesso com dados de resposta
   */
  async logSuccess(
    step: string,
    responseData: any,
    qualityScore?: number
  ): Promise<void> {
    await this.logStep(step, 'success', {
      response_body: responseData,
      lead_quality_score: qualityScore,
      conversion_step: step === 'completed' ? 'conversion' : undefined,
    });
  }

  /**
   * Log de request HTTP completo
   */
  async logRequest(requestBody: any, httpStatusCode?: number): Promise<void> {
    await this.logStep('request_received', 'in_progress', {
      request_body: requestBody,
      http_status_code: httpStatusCode,
    });
  }

  /**
   * Log de response HTTP completo
   */
  async logResponse(responseBody: any, httpStatusCode: number): Promise<void> {
    await this.logStep('response_sent', 'success', {
      response_body: responseBody,
      http_status_code: httpStatusCode,
    });
  }

  /**
   * Finalizar logging da operação
   */
  async finish(status: 'success' | 'error' = 'success', finalData: any = {}): Promise<void> {
    await this.logStep('completed', status, {
      ...finalData,
      execution_time_ms: Date.now() - this.startTime,
      memory_usage_mb: this.getMemoryUsage() - this.memoryStart,
    });

    // Atualizar sessão do usuário se existir
    if (this.sessionId && this.baseLog.user_email) {
      await this.updateUserSession();
    }
  }

  /**
   * Métodos utilitários privados
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractSessionId(request?: NextRequest): string {
    if (!request) return `session_${Date.now()}`;
    
    // Tentar extrair de cookie ou header personalizado
    const sessionFromCookie = request.cookies.get('session_id')?.value;
    const sessionFromHeader = request.headers.get('x-session-id');
    
    return sessionFromCookie || sessionFromHeader || `session_${Date.now()}`;
  }

  private extractIP(request?: NextRequest): string | undefined {
    if (!request) return undefined;
    
    // Tentar várias fontes de IP (considerando proxies)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const remoteAddr = request.headers.get('x-remote-addr');
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    
    return realIP || remoteAddr || undefined;
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    return 0;
  }

  private async updateUserSession(): Promise<void> {
    try {
      const { data: existingSession } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('session_id', this.sessionId)
        .single();

      if (existingSession) {
        // Atualizar sessão existente
        await this.supabase
          .from('user_sessions')
          .update({
            last_activity: new Date().toISOString(),
            total_requests: (existingSession.total_requests || 0) + 1,
            tools_used: Array.from(new Set([
              ...(existingSession.tools_used || []),
              this.baseLog.tool_name
            ])),
          })
          .eq('session_id', this.sessionId);
      } else {
        // Criar nova sessão
        await this.supabase
          .from('user_sessions')
          .insert([{
            session_id: this.sessionId,
            user_email: this.baseLog.user_email,
            user_ip: this.baseLog.user_ip,
            user_agent: this.baseLog.user_agent,
            total_requests: 1,
            tools_used: [this.baseLog.tool_name],
          }]);
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão do usuário:', error);
    }
  }
}

/**
 * Factory function para criar logger facilmente
 */
export function createApiLogger(
  toolName: string,
  endpoint: string,
  httpMethod: string,
  request?: NextRequest,
  userEmail?: string
): ApiLogger {
  return new ApiLogger(toolName, endpoint, httpMethod, request, userEmail);
}

/**
 * Decorator para automatizar logging em APIs
 */
export function withLogging(
  toolName: string,
  endpoint: string
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (request: NextRequest, ...args: any[]) {
      const logger = createApiLogger(toolName, endpoint, 'POST', request);
      
      try {
        const body = await request.json();
        await logger.logRequest(body);
        
        const result = await originalMethod.call(this, request, ...args);
        
        await logger.logResponse(result, 200);
        await logger.finish('success');
        
        return result;
      } catch (error) {
        await logger.logError('execution', error as Error);
        await logger.finish('error');
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Utilitário para logs quick sem instanciar classe
 */
export async function quickLog(
  toolName: string,
  step: string,
  status: LogEntry['status'],
  data: Partial<LogEntry> = {}
): Promise<void> {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const logEntry: LogEntry = {
      tool_name: toolName,
      endpoint: '/quick-log',
      http_method: 'INTERNAL',
      step,
      status,
      ...data,
    } as LogEntry;

    await supabase.from('api_logs').insert([logEntry]);
  } catch (error) {
    console.error('Quick log failed:', error);
  }
}

export default ApiLogger;
