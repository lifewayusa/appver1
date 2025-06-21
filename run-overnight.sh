#!/bin/bash

# Script para execução noturna do update de imagens
# ATENÇÃO: Processará ~5000 cidades (2-3 horas estimadas)
# Uso: ./run-overnight.sh

echo "🌙 Iniciando execução noturna PESADA - $(date)"
echo "=============================================="
echo "⚠️  PROCESSANDO ~5000 CIDADES - PODE DEMORAR 2-3 HORAS!"
echo "⏱️  Recomendado deixar rodando durante a noite"
echo ""

# Criar diretório de logs se não existir
mkdir -p logs

# Nome do arquivo de log com timestamp
LOG_FILE="logs/update-5k-cities-$(date +%Y%m%d-%H%M%S).log"

echo "📁 Log será salvo em: $LOG_FILE"
echo "🚀 Iniciando script de update de 5000 cidades..."
echo "📊 Para monitorar: tail -f $LOG_FILE"
echo ""

# Executar o script e salvar log
npm run update-images > "$LOG_FILE" 2>&1

# Verificar se executou com sucesso
if [ $? -eq 0 ]; then
    echo "✅ Script de 5000 cidades executado com sucesso!"
    echo "📊 Últimas linhas do log:"
    tail -15 "$LOG_FILE"
else
    echo "❌ Erro na execução do script de 5000 cidades!"
    echo "🔍 Verificar log completo: $LOG_FILE"
fi

echo ""
echo "🌅 Execução noturna de 5000 cidades finalizada - $(date)"
echo "⏱️  Duração total registrada no log acima"
