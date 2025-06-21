# 🚀 Guia Final de Execução - Fetch de Imagens para 5000 Cidades

## ✅ Status do Projeto
- **Homepage**: 100% Concluída
- **Scripts**: Otimizados e prontos para execução
- **Database**: Configurado com 4744 cidades pendentes
- **APIs**: Configuradas com rate limiting otimizado

## 📋 Pré-requisitos para Execução

### 1. Node.js
```bash
# Verificar versão (precisa ser 18+ para usar fetch nativo)
node --version
# Se menor que 18, instalar Node.js 18+
```

### 2. Dependências
```bash
# Instalar dependências no diretório do projeto
npm install
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar e configurar arquivo de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais:
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - PEXELS_API_KEY (obrigatório)
# - UNSPLASH_ACCESS_KEY (opcional)
# - PIXABAY_API_KEY (opcional)
```

## 🔑 Como Obter as Chaves da API

### Pexels (OBRIGATÓRIO - 200 requests/hora grátis)
1. Acesse: https://www.pexels.com/api/
2. Crie conta gratuita
3. Copie a API Key
4. Adicione no .env.local: `PEXELS_API_KEY=sua_chave_aqui`

### Unsplash (OPCIONAL - 50 requests/hora demo)
1. Acesse: https://unsplash.com/developers
2. Crie aplicação demo
3. Copie o Access Key
4. Adicione no .env.local: `UNSPLASH_ACCESS_KEY=sua_chave_aqui`

### Pixabay (OPCIONAL - 100 requests/hora grátis)
1. Acesse: https://pixabay.com/api/docs/
2. Crie conta gratuita
3. Copie a API Key
4. Adicione no .env.local: `PIXABAY_API_KEY=sua_chave_aqui`

## 🚀 Execução do Script

### Teste Inicial (Recomendado)
```bash
# Testar configuração com 3 cidades apenas
cd scripts
node test-script.js
```

### Execução Completa
```bash
# Execução normal
cd scripts
node fetch-city-images-optimized.js

# OU execução em background (recomendado)
bash run-overnight.sh
```

## 📊 Performance Estimada

### Com Apenas Pexels (200 req/hora):
- **Tempo**: ~24 horas para 4744 cidades
- **Rate limit**: 1 segundo entre requests
- **Processamento**: 1 cidade por vez

### Com Todas as APIs (350 req/hora total):
- **Tempo**: ~14 horas para 4744 cidades
- **Paralelo**: 3 APIs simultâneas
- **Processamento**: 3 cidades por lote

### Configuração Otimizada:
- **Lotes**: 3 cidades processadas em paralelo
- **Delay**: 2 segundos entre lotes
- **APIs rotativas**: Distribui carga automaticamente
- **Rate limiting**: Respeitado por provider

## 📁 Estrutura de Arquivos Gerados

```
public/images/cities/
├── new-york-ny.jpg          # Imagem da cidade
├── los-angeles-ca.jpg
├── chicago-il.jpg
└── ...                      # ~4744 arquivos no total
```

## 📈 Monitoramento do Progresso

### Durante a Execução:
```
🏙️ Processando: Miami, FL (3821/4744)
🎯 API: pexels | ✅ Sucesso | 📏 2.1MB | ⏱️ 0.8s
📊 Taxa de sucesso: 94.2% | Falhas: 5.8%

📈 Progresso geral: 80.5% (3821/4744 cidades processadas)
```

### Estatísticas Detalhadas (a cada 5 lotes):
```
📊 ===== ESTATÍSTICAS DETALHADAS =====
⏰ Tempo total: 180m 45s
🏙️ Total de cidades: 4744
✅ Processadas: 3821
🎯 Sucessos: 3598 (94%)
❌ Falhas: 223 (6%)
⏭️ Puladas: 923 (já tinham imagem)

📈 Performance por Provedor:
  PEXELS: 1205/1273 (95%)
  UNSPLASH: 1156/1274 (91%)
  PIXABAY: 1237/1274 (97%)
```

## 🛠️ Resolução de Problemas

### Script Para ou Falha
```bash
# O script mantém registro do progresso
# Pode ser executado novamente que continua de onde parou
node fetch-city-images-optimized.js
```

### Erro de API Key
```bash
❌ Pexels API key inválida
# Verifique se a chave está correta no .env.local
```

### Erro de Conexão
```bash
❌ Erro de rede
# Script tentará novamente automaticamente
# 3 tentativas por cidade
```

### Espaço em Disco
```bash
# Monitorar espaço (cada imagem ~2MB)
df -h
# Total estimado: ~10GB para todas as imagens
```

## 📋 Arquivos Importantes

### Scripts Principais:
- `fetch-city-images-optimized.js` - Script principal otimizado
- `test-script.js` - Teste de configuração
- `run-overnight.sh` - Execução em background

### Logs e Documentação:
- `execution.log` - Log detalhado da execução
- `FINAL_EXECUTION_GUIDE.md` - Este guia
- `SCRIPT_5K_READY.md` - Documentação técnica

## ✅ Checklist Pré-Execução

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] .env.local configurado com credenciais Supabase
- [ ] Pelo menos PEXELS_API_KEY configurada
- [ ] Teste executado com sucesso (`node test-script.js`)
- [ ] Espaço em disco suficiente (~10GB)
- [ ] Conexão estável com internet

## 🎯 Próximos Passos Após Execução

1. **Verificar Resultados**: ~4500+ imagens baixadas
2. **Estatísticas Finais**: Taxa de sucesso esperada >90%
3. **Backup**: Fazer backup das imagens baixadas
4. **Backend Phase**: Continuar desenvolvimento

---

## 📞 Suporte

Se encontrar problemas durante a execução:

1. Verificar logs detalhados no terminal
2. Executar teste inicial primeiro
3. Verificar configurações de API
4. Script pode ser re-executado para continuar

**O script está otimizado para máxima eficiência respeitando limites das APIs!**
