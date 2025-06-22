# 🌐 ConectAPI - Guia de Uso

## Visão Geral

O componente `conectAPI` centraliza todas as conexões com APIs externas do projeto, seguindo as documentações oficiais e melhores práticas de cada serviço.

## Como Usar

### Importação Básica

```typescript
// Importar clientes específicos
import { createSupabaseClient, createOpenAIClient } from '../lib/conectAPI';

// Importar todos os clientes
import { createAllClients } from '../lib/conectAPI';

// Importar configurações padrão
import { API_CONFIGS } from '../lib/conectAPI';
```

### Exemplos de Uso

#### 1. Supabase (Database)

```typescript
import { createSupabaseClient } from '../lib/conectAPI';

const supabase = createSupabaseClient();

// Usar normalmente
const { data, error } = await supabase
  .from('multistep_forms')
  .insert([formData]);
```

#### 2. OpenAI (IA/LLM)

```typescript
import { createOpenAIClient, API_CONFIGS } from '../lib/conectAPI';

const openai = createOpenAIClient();

const completion = await openai.chat.completions.create({
  model: API_CONFIGS.openai.model, // "gpt-4o"
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: API_CONFIGS.openai.max_tokens, // 4000
  temperature: API_CONFIGS.openai.temperature, // 0.8
});
```

#### 3. Stripe (Pagamentos)

```typescript
import { createStripeClient } from '../lib/conectAPI';

const stripe = createStripeClient();

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
});
```

#### 4. APIs de Imagens

```typescript
import { createPixabayClient, createUnsplashClient, createPexelsClient } from '../lib/conectAPI';

// Pixabay
const pixabay = createPixabayClient();
const pixabayResults = await pixabay.search('america landscape');

// Unsplash
const unsplash = createUnsplashClient();
const unsplashResults = await unsplash.search('usa cities');

// Pexels
const pexels = createPexelsClient();
const pexelsResults = await pexels.search('american dream');
```

#### 5. Google APIs

```typescript
import { createGoogleMapsClient, createGoogleAnalyticsClient } from '../lib/conectAPI';

// Google Maps
const googleMaps = createGoogleMapsClient();
const geocode = await googleMaps.geocode('New York, NY');
const places = await googleMaps.places('restaurants in Manhattan');

// Google Analytics
const ga = createGoogleAnalyticsClient();
await ga.track('form_submission', { 
  form_type: 'multistep_form',
  user_id: 'user123'
});
```

#### 6. Redes Sociais

```typescript
import { createMetaClient, createTwitterClient } from '../lib/conectAPI';

// Meta (Facebook/Instagram)
const meta = createMetaClient();
await meta.post('Confira nosso novo serviço!');
const profile = await meta.getProfile();

// Twitter (X)
const twitter = createTwitterClient();
await twitter.post('Nova funcionalidade disponível! #LifewayUSA');
const tweets = await twitter.search('#imigração');
```

#### 7. Todos os Clientes

```typescript
import { createAllClients } from '../lib/conectAPI';

const apis = createAllClients();

// Usar qualquer API
const { data } = await apis.supabase.from('users').select('*');
const completion = await apis.openai.chat.completions.create({...});
const images = await apis.pixabay.search('american landscape');
```

## Migração de APIs Existentes

### Antes (Antigo)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
```

### Depois (ConectAPI)
```typescript
import { createSupabaseClient } from '../lib/conectAPI';

const supabase = createSupabaseClient();
```

## Variáveis de Ambiente Necessárias

Adicione estas variáveis ao seu arquivo `.env.local`:

```bash
# Supabase
SUPABASE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Imagens
PIXABAY_API_KEY=your_pixabay_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key

# Google
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_ANALYTICS_MEASUREMENT_ID=your_ga_measurement_id
GOOGLE_ANALYTICS_API_SECRET=your_ga_api_secret

# Meta (Facebook/Instagram)
META_ACCESS_TOKEN=your_meta_access_token
META_APP_ID=your_meta_app_id

# Twitter (X)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
```

## Benefícios

✅ **Centralização**: Todas as APIs em um local
✅ **Padronização**: Estrutura consistente seguindo documentações oficiais
✅ **Manutenibilidade**: Fácil atualização e correção
✅ **Reutilização**: Import simples em qualquer parte do projeto
✅ **Configurações**: Valores padrão pré-definidos para cada API
✅ **TypeScript**: Tipagem completa para melhor DX

## Próximos Passos

1. Migrar todas as APIs existentes para usar `conectAPI`
2. Atualizar variáveis de ambiente conforme necessário
3. Testar cada integração
4. Documentar configurações específicas de produção
