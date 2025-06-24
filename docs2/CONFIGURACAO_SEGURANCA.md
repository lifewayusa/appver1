# 🔐 Configuração de Variáveis de Ambiente

## Arquivos Sensíveis

Este projeto contém arquivos sensíveis que NÃO devem ser versionados:

### vercel.json
- **Status**: Ignorado pelo git (ver .gitignore)
- **Exemplo**: `vercel.json.example`
- **Como usar**: Copie o exemplo e configure com suas chaves reais

```bash
cp vercel.json.example vercel.json
```

Então edite `vercel.json` com suas chaves:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_KEY`: Chave de serviço do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de service role do Supabase
- `OPENAI_API_KEY`: Sua chave da API OpenAI

### .env.local
- **Status**: Ignorado pelo git
- **Variáveis necessárias**: Mesmo conjunto do vercel.json

## ⚠️ Segurança

**NUNCA** faça commit de arquivos contendo:
- Chaves de API
- Tokens de acesso
- Senhas
- URLs com credenciais

O GitHub push protection irá bloquear pushes contendo segredos detectados.
