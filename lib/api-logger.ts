import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://oaxkqqamnppkeavunlgo.supabase.co',
  process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface LogEntry {
  tool_name: string;
  step: 'prompt_loaded' | 'openai_request' | 'openai_response' | 'db_save' | 'completed' | 'error';
  status: 'success' | 'error' | 'in_progress';
  user_data?: any;
  prompt_content?: string;
  openai_request?: any;
  openai_response?: any;
  error_message?: string;
  execution_time_ms?: number;
  ip_address?: string;
  user_agent?: string;
}

export class ApiLogger {
  private static async log(entry: LogEntry) {
    try {
      const { error } = await supabase
        .from('api_logs')
        .insert([entry]);

      if (error) {
        console.error('Error logging to database:', error);
      }
    } catch (err) {
      console.error('Error in ApiLogger:', err);
    }
  }

  static async logPromptLoaded(toolName: string, promptContent: string, userData: any, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: 'prompt_loaded',
      status: 'success',
      user_data: userData,
      prompt_content: promptContent,
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  static async logOpenAIRequest(toolName: string, openaiRequest: any, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: 'openai_request',
      status: 'in_progress',
      openai_request: openaiRequest,
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  static async logOpenAIResponse(toolName: string, openaiResponse: any, executionTime: number, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: 'openai_response',
      status: 'success',
      openai_response: {
        content: openaiResponse.choices?.[0]?.message?.content || 'No content',
        usage: openaiResponse.usage,
        model: openaiResponse.model
      },
      execution_time_ms: executionTime,
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  static async logDatabaseSave(toolName: string, reportData: any, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: 'db_save',
      status: 'success',
      user_data: { report_id: reportData.id },
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  static async logCompleted(toolName: string, totalTime: number, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: 'completed',
      status: 'success',
      execution_time_ms: totalTime,
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  static async logError(toolName: string, step: string, error: any, request?: Request) {
    await this.log({
      tool_name: toolName,
      step: step as any,
      status: 'error',
      error_message: error.message || String(error),
      ip_address: this.getIpAddress(request),
      user_agent: this.getUserAgent(request)
    });
  }

  private static getIpAddress(request?: Request): string | undefined {
    if (!request) return undefined;
    
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIp || undefined;
  }

  private static getUserAgent(request?: Request): string | undefined {
    return request?.headers.get('user-agent') || undefined;
  }
}
