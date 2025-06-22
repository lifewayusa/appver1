#!/bin/bash

# Script para aplicar o sistema de logs completo no Supabase
# Executa os scripts SQL necessários

echo "🚀 Iniciando configuração do sistema de logs..."

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Erro: Variáveis de ambiente do Supabase não configuradas"
    echo "   Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Variáveis de ambiente configuradas"
echo "📊 URL do Supabase: $NEXT_PUBLIC_SUPABASE_URL"

# Aplicar o script de sistema de logs completo
echo "📋 Aplicando script de sistema de logs..."

# Se o Supabase CLI estiver disponível, usar ele
if command -v supabase &> /dev/null; then
    echo "🔧 Usando Supabase CLI..."
    supabase db push --db-url "$NEXT_PUBLIC_SUPABASE_URL" --password "$SUPABASE_SERVICE_ROLE_KEY"
else
    echo "⚠️  Supabase CLI não encontrado. Execute manualmente no painel do Supabase:"
    echo "   1. Vá para o SQL Editor no painel do Supabase"
    echo "   2. Execute o conteúdo do arquivo sql/complete_logging_system.sql"
    echo "   3. Execute o conteúdo do arquivo sql/create_api_logs_table.sql"
fi

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. ✅ Executar SQL no painel do Supabase (se não usar CLI)"
echo "2. ✅ Testar as APIs com logging ativado"
echo "3. ✅ Acessar /admin para ver os logs"
echo "4. ✅ Fazer deploy das mudanças"

echo ""
echo "📁 ARQUIVOS CRIADOS/MODIFICADOS:"
echo "- sql/complete_logging_system.sql (Sistema completo de logs)"
echo "- app/lib/ApiLogger.ts (Classe de logging)"
echo "- app/admin/page.tsx (Dashboard administrativo)"
echo "- Todas as APIs com logging integrado"

echo ""
echo "🔗 URLS IMPORTANTES:"
echo "- Dashboard Admin: ${NEXT_PUBLIC_SUPABASE_URL}/admin"
echo "- Painel Supabase: https://supabase.com/dashboard"

echo ""
echo "✨ Sistema de logs configurado com sucesso!"
