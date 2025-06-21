#!/bin/bash

# Script para executar o fetcher de imagens de cidades
# Captura imagens para TODAS as cidades sem imagem no banco de dados

echo "🚀 ===== LIFEWAY USA - CAPTURA DE IMAGENS DE CIDADES ====="
echo ""
echo "📊 Este script irá:"
echo "   • Buscar TODAS as cidades sem imagem no Supabase"
echo "   • Priorizar destinos principais (main_destiny=true)"
echo "   • Baixar imagens do Pexels, Unsplash e Pixabay"
echo "   • Salvar em /public/images/cities/"
echo "   • Atualizar o banco de dados"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo "❌ Arquivo .env.local não encontrado."
    echo "   Configure as APIs: PEXELS_API_KEY, UNSPLASH_ACCESS_KEY, PIXABAY_API_KEY"
    exit 1
fi

# Navegar para o diretório do projeto
cd "$(dirname "$0")/.."

echo "📁 Diretório de trabalho: $(pwd)"
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Criar diretório de imagens se não existir
mkdir -p public/images/cities

# Mostrar opções
echo "🎯 OPÇÕES DE EXECUÇÃO:"
echo ""
echo "1. Processar TODAS as cidades (recomendado)"
echo "2. Processar apenas as próximas 50 cidades"
echo "3. Processar apenas destinos principais"
echo "4. Continuar de onde parou (usar START_FROM)"
echo "5. Gerar relatório de status"
echo ""

read -p "Escolha uma opção (1-5): " option

case $option in
    1)
        echo "🚀 Processando TODAS as cidades..."
        node scripts/fetch-city-images.js
        ;;
    2)
        echo "🚀 Processando próximas 50 cidades..."
        BATCH_SIZE=50 node scripts/fetch-city-images.js
        ;;
    3)
        echo "🎯 Processando apenas destinos principais..."
        echo "⚠️  ATENÇÃO: Esta opção foi removida. O script agora processa TODAS as cidades."
        echo "   Destinos principais serão priorizados na ordem de processamento."
        node scripts/fetch-city-images.js
        ;;
    4)
        read -p "Começar do índice: " start_index
        echo "🚀 Continuando do índice $start_index..."
        START_FROM=$start_index BATCH_SIZE=50 node scripts/fetch-city-images.js
        ;;
    5)
        echo "📊 Gerando relatório..."
        node scripts/image-report-paginated.js
        ;;
    *)
        echo "❌ Opção inválida. Executando opção padrão (TODAS as cidades)..."
        node scripts/fetch-city-images.js
        ;;
esac

echo ""
echo "✅ Execução finalizada!"
echo ""
echo "💡 DICAS:"
echo "   • Execute o relatório: node scripts/image-report-paginated.js"
echo "   • Para continuar em lotes: START_FROM=100 BATCH_SIZE=50 node scripts/fetch-city-images.js"
echo "   • Para debug: DEBUG=true node scripts/fetch-city-images.js"
echo ""
