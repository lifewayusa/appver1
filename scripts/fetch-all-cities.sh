#!/bin/bash

# Script simples para processar TODAS as cidades
echo "🚀 Iniciando captura de imagens para TODAS as cidades..."
echo ""

cd "$(dirname "$0")/.."

# Executar o fetcher para TODAS as cidades
node scripts/fetch-city-images.js

echo ""
echo "✅ Processo concluído!"
