# 🤖 Sistema de Geração de Imagens com OpenAI + Unsplash

## 📋 Visão Geral

Este sistema usa **OpenAI** para gerar prompts inteligentes e busca imagens no **Unsplash** específicas para cada artigo do blog. As imagens são baixadas localmente e usadas automaticamente pelo sistema.

## 🔧 Configuração

### 1. Variáveis de Ambiente (.env.local)

```bash
# OpenAI (obrigatório)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx

# Unsplash (obrigatório) 
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxx
```

### 2. Obter Chaves de API

**OpenAI:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Adicione créditos na conta se necessário

**Unsplash:**
1. Acesse: https://unsplash.com/developers
2. Crie uma nova aplicação
3. Copie o "Access Key"

## 🚀 Como Usar

### 1. Gerar Imagem para Um Artigo

```bash
npm run generate-blog-images "Como Obter o Green Card Americano"
```

### 2. Gerar Imagens para Múltiplos Artigos

```bash
npm run generate-blog-images "Título 1" "Título 2" "Título 3"
```

### 3. Gerar Imagens de Exemplo (Teste)

```bash
npm run generate-sample-blog-images
```

## 🔄 Como Funciona

### 1. **OpenAI Gera Prompt**
- Analisa o título do artigo
- Gera 3-5 palavras-chave em inglês
- Foca em termos relacionados aos EUA e imigração
- Se não encontrar resultados, tenta novamente com palavras diferentes

### 2. **Busca no Unsplash** 
- Usa as palavras-chave para buscar imagens
- Tenta múltiplas combinações (palavra + "USA", "america", etc.)
- Seleciona imagem aleatória para variedade
- Máximo 3 tentativas por artigo

### 3. **Download Local**
- Baixa a imagem para `/public/images/blog/`
- Nome do arquivo: `slug-do-artigo-timestamp.jpg`
- Gera relatório em JSON

### 4. **Uso Automático**
- `ArticleImage` component verifica primeiro por imagem local
- Se não encontrar, usa sistema online anterior
- Prioridade: Local → API Online → Fallback

## 📁 Estrutura de Arquivos

```
/public/images/blog/
├── green-card-casamento-1703123456789.jpg
├── visto-eb5-investimento-1703123456790.jpg
├── naturalizacao-americana-1703123456791.jpg
└── download-report.json
```

## 📊 Exemplo de Prompt OpenAI

**Input:** "Como Solicitar o Green Card por Casamento"

**OpenAI Gera:** "green card, marriage, immigration, spouse, usa"

**Busca Unsplash:**
1. "green card marriage USA america"
2. "green card marriage united states" 
3. "green card marriage american"
4. "green card marriage"
5. "immigration spouse USA america"
... (e assim por diante)

## 🔍 Logs do Console

```
📝 Processando: "Como Obter o Green Card Americano"

🎯 Tentativa 1/3
🤖 OpenAI gerou palavras-chave (tentativa 1): green card, immigration, permanent residence, usa
🔍 Buscando no Unsplash: "green card usa america"
✅ Imagem encontrada: Beautiful shot of American flag
📥 Baixando imagem: green-card-americano-1703123456789.jpg
✅ Sucesso! Imagem salva em: /images/blog/green-card-americano-1703123456789.jpg
```

## 🚫 Sem Fallback = Mais Qualidade

- **Vantagem:** Todas as imagens são específicas e relevantes
- **Processo:** Se não encontrar, OpenAI tenta novas palavras-chave
- **Máximo 3 tentativas:** Evita travamentos infinitos
- **Falha apenas se:** APIs indisponíveis ou título muito específico

## 📈 Relatório de Download

Cada execução gera um `download-report.json`:

```json
{
  "timestamp": "2025-06-26T10:30:00.000Z",
  "total": 5,
  "successful": 4,
  "failed": 1,
  "results": [
    {
      "title": "Como Obter o Green Card",
      "slug": "green-card-americano",
      "success": true,
      "imageUrl": "https://images.unsplash.com/photo-...",
      "fileName": "green-card-americano-1703123456789.jpg",
      "localPath": "/images/blog/green-card-americano-1703123456789.jpg"
    }
  ]
}
```

## 🛠️ Troubleshooting

### ❌ "OPENAI_API_KEY não configurada"
- Verifique se a chave está no `.env.local`
- Reinicie o servidor (`npm run dev`)

### ❌ "UNSPLASH_ACCESS_KEY não configurada"  
- Verifique se a chave está no `.env.local`
- Certifique-se que é `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

### ❌ "Nenhuma imagem encontrada após 3 tentativas"
- Título pode ser muito específico
- APIs podem estar indisponíveis
- Tente novamente ou mude o título

### ❌ "Erro ao baixar imagem"
- Verifique permissões da pasta `/public/images/blog/`
- Espaço em disco disponível
- Conexão com internet

## 🎯 Próximos Passos

1. **Testar:** Execute `npm run generate-sample-blog-images`
2. **Verificar:** Veja se as imagens aparecem em `/public/images/blog/`
3. **Integrar:** Use títulos reais dos artigos do seu blog
4. **Monitorar:** Acompanhe os logs e relatórios

## 💡 Dicas

- **Títulos em português funcionam:** O OpenAI traduz automaticamente
- **Seja específico:** "Green Card por Casamento" > "Documentos"
- **Monitore custos:** OpenAI cobra por token, Unsplash é gratuito
- **Batch processing:** Processe vários artigos de uma vez para eficiência
