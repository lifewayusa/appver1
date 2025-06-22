'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LogEntry {
  id: number;
  created_at: string;
  tool_name: string;
  step: string;
  status: string;
  user_email?: string;
  execution_time_ms?: number;
  error_message?: string;
  openai_tokens_used?: number;
  openai_cost_usd?: number;
  lead_quality_score?: number;
}

interface MetricsSummary {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_execution_time: number;
  total_openai_cost: number;
  total_tokens: number;
  success_rate: number;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24h');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tools = ['all', 'get-opportunity', 'criador-sonhos', 'visa-match', 'multistep-form'];
  const timeframes = [
    { value: '1h', label: 'Última Hora' },
    { value: '24h', label: 'Últimas 24h' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' }
  ];

  useEffect(() => {
    loadData();
  }, [selectedTool, selectedTimeframe]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadLogs(),
        loadMetrics()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    let query = supabase
      .from('api_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    // Filtro por ferramenta
    if (selectedTool !== 'all') {
      query = query.eq('tool_name', selectedTool);
    }

    // Filtro por timeframe
    const timeframeDates = getTimeframeDate(selectedTimeframe);
    if (timeframeDates) {
      query = query.gte('created_at', timeframeDates.toISOString());
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar logs:', error);
      return;
    }

    setLogs(data || []);
  };

  const loadMetrics = async () => {
    let query = supabase
      .from('api_logs')
      .select('*');

    if (selectedTool !== 'all') {
      query = query.eq('tool_name', selectedTool);
    }

    const timeframeDates = getTimeframeDate(selectedTimeframe);
    if (timeframeDates) {
      query = query.gte('created_at', timeframeDates.toISOString());
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar métricas:', error);
      return;
    }

    if (data) {
      const summary: MetricsSummary = {
        total_requests: data.length,
        successful_requests: data.filter(log => log.status === 'success').length,
        failed_requests: data.filter(log => log.status === 'error').length,
        avg_execution_time: data.reduce((acc, log) => acc + (log.execution_time_ms || 0), 0) / data.length || 0,
        total_openai_cost: data.reduce((acc, log) => acc + (log.openai_cost_usd || 0), 0),
        total_tokens: data.reduce((acc, log) => acc + (log.openai_tokens_used || 0), 0),
        success_rate: data.length > 0 ? (data.filter(log => log.status === 'success').length / data.length) * 100 : 0
      };
      setMetrics(summary);
    }
  };

  const getTimeframeDate = (timeframe: string): Date | null => {
    const now = new Date();
    switch (timeframe) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      started: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getToolIcon = (toolName: string) => {
    const icons = {
      'get-opportunity': '🎯',
      'criador-sonhos': '💭',
      'visa-match': '🛂',
      'multistep-form': '📋'
    };
    return icons[toolName as keyof typeof icons] || '⚡';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              🚀 LifewayUSA - Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ferramenta</label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {tools.map(tool => (
                  <option key={tool} value={tool}>
                    {tool === 'all' ? '🔍 Todas as Ferramentas' : `${getToolIcon(tool)} ${tool}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={loadData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { id: 'overview', label: '📊 Visão Geral' },
                { id: 'logs', label: '📋 Logs Detalhados' },
                { id: 'errors', label: '🚨 Erros' },
                { id: 'performance', label: '⚡ Performance' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && metrics && (
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-3xl text-blue-600">📊</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total de Requests</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.total_requests}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-3xl text-green-600">✅</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.success_rate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-3xl text-yellow-600">⚡</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(metrics.avg_execution_time)}ms</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-3xl text-purple-600">💰</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Custo OpenAI</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.total_openai_cost)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Estatísticas OpenAI</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total de Tokens Usados:</span>
                        <span className="font-medium">{metrics.total_tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custo Total:</span>
                        <span className="font-medium">{formatCurrency(metrics.total_openai_cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custo por Request:</span>
                        <span className="font-medium">
                          {formatCurrency(metrics.total_requests > 0 ? metrics.total_openai_cost / metrics.total_requests : 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requests com Sucesso:</span>
                        <span className="font-medium text-green-600">{metrics.successful_requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requests com Erro:</span>
                        <span className="font-medium text-red-600">{metrics.failed_requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tempo Médio de Execução:</span>
                        <span className="font-medium">{Math.round(metrics.avg_execution_time)}ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ferramenta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Etapa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tempo (ms)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tokens
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateTime(log.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="mr-2">{getToolIcon(log.tool_name)}</span>
                              <span className="text-sm font-medium text-gray-900">{log.tool_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.step}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(log.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.user_email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.execution_time_ms || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.openai_tokens_used || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div>
                <div className="space-y-4">
                  {logs.filter(log => log.status === 'error').map((errorLog) => (
                    <div key={errorLog.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-red-600 mr-2">🚨</span>
                          <span className="font-medium text-red-800">
                            {errorLog.tool_name} - {errorLog.step}
                          </span>
                        </div>
                        <span className="text-sm text-red-600">
                          {formatDateTime(errorLog.created_at)}
                        </span>
                      </div>
                      <p className="text-red-700 text-sm">
                        {errorLog.error_message || 'Erro não especificado'}
                      </p>
                      {errorLog.user_email && (
                        <p className="text-red-600 text-xs mt-1">
                          Usuário: {errorLog.user_email}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {logs.filter(log => log.status === 'error').length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-gray-500">Nenhum erro encontrado no período selecionado!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requests mais lentos */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🐌 Requests Mais Lentos</h3>
                    <div className="space-y-2">
                      {logs
                        .filter(log => log.execution_time_ms)
                        .sort((a, b) => (b.execution_time_ms || 0) - (a.execution_time_ms || 0))
                        .slice(0, 5)
                        .map((log) => (
                          <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div>
                              <span className="font-medium">{log.tool_name}</span>
                              <span className="text-gray-500 text-sm ml-2">({log.step})</span>
                            </div>
                            <span className="font-mono text-sm">{log.execution_time_ms}ms</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Uso de tokens */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🔥 Maior Uso de Tokens</h3>
                    <div className="space-y-2">
                      {logs
                        .filter(log => log.openai_tokens_used)
                        .sort((a, b) => (b.openai_tokens_used || 0) - (a.openai_tokens_used || 0))
                        .slice(0, 5)
                        .map((log) => (
                          <div key={log.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div>
                              <span className="font-medium">{log.tool_name}</span>
                              <span className="text-gray-500 text-sm ml-2">
                                {log.user_email ? log.user_email.substring(0, 10) + '...' : 'N/A'}
                              </span>
                            </div>
                            <span className="font-mono text-sm">{log.openai_tokens_used?.toLocaleString()} tokens</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
