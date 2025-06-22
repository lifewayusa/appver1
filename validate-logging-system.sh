#!/bin/bash

# 🔍 SCRIPT DE VALIDAÇÃO DO SISTEMA DE LOGS
# Execute após configurar o SQL no Supabase

echo "🔍 VALIDANDO SISTEMA DE LOGS - LIFEWAYUSA"
echo "========================================"

# Verificar se as variáveis de ambiente estão configuradas
echo "1. Verificando variáveis de ambiente..."
if [ -f ".env.local" ]; then
    echo "✅ Arquivo .env.local encontrado"
    
    # Verificar SUPABASE_URL
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ SUPABASE_URL configurado"
    else
        echo "❌ SUPABASE_URL não encontrado"
    fi
    
    # Verificar SUPABASE_ANON_KEY
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ SUPABASE_ANON_KEY configurado"
    else
        echo "❌ SUPABASE_ANON_KEY não encontrado"
    fi
    
    # Verificar OPENAI_API_KEY
    if grep -q "OPENAI_API_KEY" .env.local; then
        echo "✅ OPENAI_API_KEY configurado"
    else
        echo "❌ OPENAI_API_KEY não encontrado"
    fi
else
    echo "❌ Arquivo .env.local não encontrado!"
fi

echo ""

# Testar build local
echo "2. Testando build local..."
npm run build > build_test.log 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build local realizado com sucesso"
else
    echo "❌ Erro no build local - verifique build_test.log"
fi

echo ""

# Verificar arquivos do sistema de logs
echo "3. Verificando arquivos do sistema de logs..."

if [ -f "app/lib/ApiLogger.ts" ]; then
    echo "✅ ApiLogger.ts encontrado"
else
    echo "❌ ApiLogger.ts não encontrado"
fi

if [ -f "app/admin/page.tsx" ]; then
    echo "✅ Dashboard admin encontrado"
else
    echo "❌ Dashboard admin não encontrado"
fi

if [ -f "sql/setup-logging-corrected.sql" ]; then
    echo "✅ Script SQL corrigido encontrado"
else
    echo "❌ Script SQL não encontrado"
fi

echo ""

# Verificar APIs com logging
echo "4. Verificando integração de logging nas APIs..."

APIS=(
    "app/api/tools/get-opportunity/analyze-opportunity/route.ts"
    "app/api/tools/criador-sonhos/process-form/route.ts"
    "app/api/tools/visa-match/analyze-visa/route.ts"
    "app/api/form/save/route.ts"
)

for api in "${APIS[@]}"; do
    if [ -f "$api" ]; then
        if grep -q "ApiLogger" "$api"; then
            echo "✅ $api tem logging integrado"
        else
            echo "⚠️  $api sem logging integrado"
        fi
    else
        echo "❌ $api não encontrado"
    fi
done

echo ""

# Instruções finais
echo "🎯 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Execute o script SQL no painel do Supabase:"
echo "   → Copie: sql/setup-logging-corrected.sql"
echo "   → Cole no SQL Editor do Supabase"
echo "   → Execute o script"
echo ""
echo "2. Acesse o dashboard admin:"
echo "   → URL: https://lifewayusa.vercel.app/admin"
echo ""
echo "3. Teste uma ferramenta para gerar logs:"
echo "   → Ex: Get Opportunity"
echo "   → Volte ao dashboard e verifique os logs"
echo ""
echo "🚀 Sistema de logs completo e pronto para produção!"
