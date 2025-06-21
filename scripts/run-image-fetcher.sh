#!/bin/bash

# Script para executar e monitorar o processo de captura de imagens
# Uso: ./run-image-fetcher.sh

echo "🚀 LifeWayUSA - Sistema de Captura de Imagens de Cidades"
echo "========================================================"
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se o diretório de imagens existe
mkdir -p public/images/cities

# Função para mostrar estatísticas do sistema
show_system_stats() {
    echo "💻 Estatísticas do Sistema:"
    echo "   CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% uso"
    echo "   Memória: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    echo "   Espaço em disco: $(df -h public/images/cities | awk 'NR==2 {print $4 " disponível"}')"
    echo ""
}

# Função para mostrar estatísticas das imagens
show_image_stats() {
    local cities_dir="public/images/cities"
    if [ -d "$cities_dir" ]; then
        local count=$(ls -1 "$cities_dir"/*.jpg 2>/dev/null | wc -l)
        local total_size=$(du -sh "$cities_dir" 2>/dev/null | cut -f1)
        echo "📷 Estatísticas de Imagens:"
        echo "   Imagens existentes: $count"
        echo "   Tamanho total: ${total_size:-0B}"
        echo ""
    fi
}

# Função para verificar APIs
check_apis() {
    echo "🔑 Verificando APIs configuradas:"
    
    if grep -q "PEXELS_API_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Pexels API configurada"
    else
        echo "   ❌ Pexels API não configurada"
    fi
    
    if grep -q "UNSPLASH_ACCESS_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Unsplash API configurada"
    else
        echo "   ❌ Unsplash API não configurada"
    fi
    
    if grep -q "PIXABAY_API_KEY=.*[^[:space:]]" .env.local 2>/dev/null; then
        echo "   ✅ Pixabay API configurada"
    else
        echo "   ❌ Pixabay API não configurada"
    fi
    echo ""
}

# Função para criar backup antes de executar
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_dir="backups/images_$timestamp"
    
    if [ -d "public/images/cities" ] && [ "$(ls -A public/images/cities 2>/dev/null)" ]; then
        echo "💾 Criando backup das imagens existentes..."
        mkdir -p "$backup_dir"
        cp -r public/images/cities/* "$backup_dir/" 2>/dev/null
        echo "   Backup salvo em: $backup_dir"
        echo ""
    fi
}

# Função para limpar arquivos temporários
cleanup() {
    echo ""
    echo "🧹 Limpando arquivos temporários..."
    # Adicionar limpeza se necessário
}

# Capturar Ctrl+C para limpeza
trap cleanup EXIT

# Mostrar informações iniciais
echo "🔍 Verificações Iniciais:"
check_apis
show_system_stats
show_image_stats

# Perguntar se deve criar backup
read -p "💾 Criar backup das imagens existentes? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    create_backup
fi

# Perguntar quantas cidades processar
read -p "🏙️  Quantas cidades processar? (padrão: 100): " city_limit
city_limit=${city_limit:-100}

echo ""
echo "🚀 Iniciando captura de imagens..."
echo "   Limite de cidades: $city_limit"
echo "   Pressione Ctrl+C para parar"
echo ""

# Executar o script principal com monitoramento
start_time=$(date +%s)

# Executar o script em background e capturar o PID
node scripts/fetch-city-images.js &
script_pid=$!

# Monitorar o progresso
monitor_progress() {
    while kill -0 $script_pid 2>/dev/null; do
        sleep 30
        echo ""
        echo "📊 Atualização de Status ($(date '+%H:%M:%S')):"
        show_image_stats
        show_system_stats
    done
}

# Iniciar monitoramento em background
monitor_progress &
monitor_pid=$!

# Aguardar o script principal terminar
wait $script_pid
script_exit_code=$?

# Parar o monitoramento
kill $monitor_pid 2>/dev/null

# Calcular tempo total
end_time=$(date +%s)
total_time=$((end_time - start_time))
minutes=$((total_time / 60))
seconds=$((total_time % 60))

echo ""
echo "🏁 Processo Finalizado!"
echo "========================================================"
echo "⏰ Tempo total: ${minutes}m ${seconds}s"
echo ""

# Mostrar estatísticas finais
show_image_stats
show_system_stats

# Verificar se houve erros
if [ $script_exit_code -eq 0 ]; then
    echo "✅ Processo concluído com sucesso!"
else
    echo "❌ Processo terminou com erros (código: $script_exit_code)"
fi

echo ""
echo "📋 Para verificar o log completo, rode:"
echo "   node scripts/fetch-city-images.js 2>&1 | tee fetch-images.log"
echo ""
