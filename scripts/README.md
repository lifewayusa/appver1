# Scripts do LifeWayUSA

## Update de Caminhos de Imagens

Scripts para atualizar os caminhos das imagens das cidades no banco de dados Supabase.

### Arquivos Disponíveis:
- `update-image-paths.ts` - Versão TypeScript (recomendada)
- `update-image-paths.js` - Versão JavaScript

### Como Executar:

#### Via npm (recomendado):
```bash
# Versão JavaScript
npm run update-images

# Versão TypeScript
npm run update-images-ts
```

#### Diretamente:
```bash
# Versão JavaScript
node scripts/update-image-paths.js

# Versão TypeScript
npx ts-node scripts/update-image-paths.ts
```

### Pré-requisitos:

1. **Arquivo .env.local** deve existir na raiz do projeto com:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
   ```

2. **Dependências instaladas**:
   ```bash
   npm install
   ```

### O que o script faz:

1. ✅ Busca apenas cidades principais (`main_destiny = true`)
2. ✅ Normaliza caminhos para o formato `/images/cities/nome.jpg`
3. ✅ Verifica se as imagens existem fisicamente antes de atualizar
4. ✅ Pula cidades que já têm caminhos corretos
5. ✅ Fornece relatório detalhado com estatísticas
6. ✅ Trata erros graciosamente

### Exemplo de Output:

```
🚀 Iniciando atualização de caminhos de imagens...
================================================
📊 Encontradas 15 cidades principais para verificar.

✅ [ID: 1] New York: Caminho já correto e imagem existe (/images/cities/new-york.jpg)
🔄 [ID: 2] Los Angeles: Atualizado "los-angeles.jpg" → "/images/cities/los-angeles.jpg"
⚠️  [ID: 3] Chicago: Nova imagem não existe (/images/cities/chicago.jpg), mantendo caminho atual

📊 === RESUMO DA ATUALIZAÇÃO ===
================================
📋 Total de cidades principais verificadas: 15
🔄 Cidades atualizadas: 5
✅ Cidades puladas (já corretas): 8
⚠️  Imagens não encontradas: 2
❌ Erros de atualização: 0

✅ Atualização concluída com sucesso!
```

### Para Execução Noturna:

Use o script com nohup para deixar rodando em background:

```bash
# Redireciona output para arquivo de log
nohup npm run update-images > logs/update-images-$(date +%Y%m%d-%H%M%S).log 2>&1 &

# Ou com ts-node
nohup npm run update-images-ts > logs/update-images-$(date +%Y%m%d-%H%M%S).log 2>&1 &
```

### Monitoramento:

Para acompanhar o progresso:
```bash
# Ver últimas linhas do log
tail -f logs/update-images-*.log

# Ver processos rodando
ps aux | grep "update-image"
```
