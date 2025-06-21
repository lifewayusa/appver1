#!/bin/bash

# Script avançado para executar o fetch de imagens com diferentes opções
# Uso: ./image-fetcher-cli.sh [opcoes]

echo "🚀 LifeWayUSA - CLI Avançado para Imagens de Cidades"
echo "===================================================="

# Função para mostrar ajuda
show_help() {
    echo ""
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "OPÇÕES:"
    echo "  -h, --help              Mostrar esta ajuda"
    echo "  -q, --quick-report      Gerar relatório rápido"
    echo "  -r, --report            Gerar relatório completo"
    echo "  -f, --fetch             Executar fetch de imagens"
    echo "  -m, --main-only         Focar apenas em destinos principais"
    echo "  -b, --batch SIZE        Tamanho do lote (padrão: 50)"
    echo "  -s, --start INDEX       Índice para começar (padrão: 0)"
    echo "  --monitor               Monitorar progresso em tempo real"
    echo "  --backup                Criar backup antes de executar"
    echo ""
    echo "EXEMPLOS:"
    echo "  $0 -r                   # Relatório completo"
    echo "  $0 -q                   # Relatório rápido"
    echo "  $0 -f                   # Fetch normal (50 cidades)"
    echo "  $0 -f -b 100            # Fetch com lote de 100"
    echo "  $0 -f -s 200 -b 50      # Começar do índice 200"
    echo "  $0 -m -f                # Apenas destinos principais"
    echo "  $0 --backup -f          # Backup + fetch"
    echo ""
}

# Função para verificar dependências
check_dependencies() {
    echo "🔍 Verificando dependências..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
        exit 1
    fi

    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
        exit 1
    fi

    if [ ! -f ".env.local" ]; then
        echo "❌ Arquivo .env.local não encontrado"
        exit 1
    fi

    if [ ! -f "scripts/fetch-city-images.js" ]; then
        echo "❌ Script fetch-city-images.js não encontrado"
        exit 1
    fi
    
    echo "✅ Dependências verificadas"
}

# Função para verificar APIs
check_apis() {
    echo "🔑 Verificando configuração das APIs..."
    
    local api_count=0
    
    if grep -q "PEXELS_API_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Pexels API configurada"
        api_count=$((api_count + 1))
    else
        echo "   ❌ Pexels API não configurada"
    fi
    
    if grep -q "UNSPLASH_ACCESS_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Unsplash API configurada"
        api_count=$((api_count + 1))
    else
        echo "   ❌ Unsplash API não configurada"
    fi
    
    if grep -q "PIXABAY_API_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Pixabay API configurada"
        api_count=$((api_count + 1))
    else
        echo "   ❌ Pixabay API não configurada"
    fi
    
    echo "   📊 Total de APIs configuradas: $api_count/3"
    
    if [ $api_count -eq 0 ]; then
        echo "⚠️  AVISO: Nenhuma API configurada! O fetch não funcionará."
        exit 1
    fi
}

# Função para relatório rápido
quick_report() {
    echo "📊 Gerando relatório rápido..."
    if [ -f "scripts/image-report-paginated.js" ]; then
        node scripts/image-report-paginated.js quick
    else
        echo "❌ Script de relatório não encontrado"
        exit 1
    fi
}

# Função para relatório completo
full_report() {
    echo "📊 Gerando relatório completo..."
    if [ -f "scripts/image-report-paginated.js" ]; then
        node scripts/image-report-paginated.js full
    else
        echo "❌ Script de relatório não encontrado"
        exit 1
    fi
}

# Função para fetch de imagens
fetch_images() {
    local batch_size=${1:-50}
    local start_from=${2:-0}
    local main_only=${3:-false}
    
    echo "🎯 Configuração do fetch:"
    echo "   Tamanho do lote: $batch_size"
    echo "   Começar do índice: $start_from"
    echo "   Apenas principais: $main_only"
    echo ""
    
    # Verificar APIs antes de executar
    check_apis
    
    # Criar diretório se não existir
    mkdir -p public/images/cities
    
    if [ "$main_only" = "true" ]; then
        echo "🎯 Executando fetch apenas para destinos principais..."
        MAIN_DESTINY_ONLY=true BATCH_SIZE=$batch_size START_FROM=$start_from node scripts/fetch-city-images.js
    else
        echo "🏙️  Executando fetch para todas as cidades..."
        BATCH_SIZE=$batch_size START_FROM=$start_from node scripts/fetch-city-images.js
    fi
}

# Função para monitorar progresso
monitor_progress() {
    echo "📈 Monitorando progresso a cada 30 segundos..."
    echo "Pressione Ctrl+C para parar o monitoramento"
    echo ""
    
    while true; do
        clear
        echo "🕒 $(date '+%H:%M:%S') - Status em tempo real:"
        echo "=================================="
        
        if [ -f "scripts/image-report-paginated.js" ]; then
            node scripts/image-report-paginated.js quick
        fi
        
        # Mostrar estatísticas do sistema
        echo ""
        echo "💻 Sistema:"
        echo "   Memória: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
        echo "   Espaço: $(df -h public/images/cities 2>/dev/null | awk 'NR==2 {print $4 " disponível"}' || echo "N/A")"
        
        echo ""
        echo "Próxima atualização em 30s... (Ctrl+C para sair)"
        sleep 30
    done
}

# Função para backup
create_backup() {
    local backup_dir="backups/$(date '+%Y%m%d_%H%M%S')"
    echo "💾 Criando backup em $backup_dir..."
    
    mkdir -p "$backup_dir"
    
    # Backup dos logs se existirem
    if [ -f "fetch-images.log" ]; then
        cp fetch-images.log "$backup_dir/"
        echo "   ✅ Log backup criado"
    fi
    
    # Backup do diretório de imagens
    if [ -d "public/images/cities" ] && [ "$(ls -A public/images/cities 2>/dev/null)" ]; then
        cp -r public/images/cities "$backup_dir/"
        local count=$(ls -1 "$backup_dir/cities"/*.{jpg,jpeg,png,webp} 2>/dev/null | wc -l)
        echo "   ✅ $count imagens backup criadas"
    else
        echo "   ⚠️  Nenhuma imagem encontrada para backup"
    fi
    
    echo "   📁 Backup salvo em: $backup_dir"
}

# Parse dos argumentos
BATCH_SIZE=50
START_FROM=0
MAIN_ONLY=false
ACTION=""
DO_BACKUP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -q|--quick-report)
            ACTION="quick_report"
            shift
            ;;
        -r|--report)
            ACTION="full_report"
            shift
            ;;
        -f|--fetch)
            ACTION="fetch_images"
            shift
            ;;
        -m|--main-only)
            MAIN_ONLY=true
            shift
            ;;
        -b|--batch)
            BATCH_SIZE="$2"
            if ! [[ "$BATCH_SIZE" =~ ^[0-9]+$ ]] || [ "$BATCH_SIZE" -lt 1 ]; then
                echo "❌ Tamanho do lote deve ser um número positivo"
                exit 1
            fi
            shift 2
            ;;
        -s|--start)
            START_FROM="$2"
            if ! [[ "$START_FROM" =~ ^[0-9]+$ ]]; then
                echo "❌ Índice de início deve ser um número"
                exit 1
            fi
            shift 2
            ;;
        --monitor)
            ACTION="monitor_progress"
            shift
            ;;
        --backup)
            DO_BACKUP=true
            shift
            ;;
        *)
            echo "❌ Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Verificar dependências
check_dependencies

# Criar backup se solicitado
if [ "$DO_BACKUP" = "true" ]; then
    create_backup
    echo ""
fi

# Executar ação
case $ACTION in
    "quick_report")
        quick_report
        ;;
    "full_report")
        full_report
        ;;
    "fetch_images")
        fetch_images $BATCH_SIZE $START_FROM $MAIN_ONLY
        ;;
    "monitor_progress")
        monitor_progress
        ;;
    "")
        echo "🤔 Nenhuma ação especificada. Use -h para ajuda."
        echo ""
        echo "Ações rápidas:"
        echo "  $0 -q              # Relatório rápido"
        echo "  $0 -r              # Relatório completo"
        echo "  $0 -f              # Fetch de imagens"
        echo "  $0 -f -m           # Fetch apenas principais"
        echo "  $0 --monitor       # Monitorar progresso"
        echo ""
        ;;
esac
