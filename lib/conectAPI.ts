/**
 * 🌐 ConectAPI - Centralizador de Conexões com APIs Externas
 * 
 * Este componente centraliza todas as conexões com APIs externas usadas no projeto,
 * seguindo as documentações oficiais e melhores práticas de cada serviço.
 * 
 * APIs Suportadas:
 * - Supabase (Database)
 * - OpenAI (IA/LLM) 
 * - Stripe (Pagamentos)
 * - Pixabay (Imagens)
 * - Unsplash (Imagens)
 * - Pexels (Imagens)
 * - Google (Maps, Analytics, etc)
 * - Meta (Facebook/Instagram)
 * - Twitter (X)
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import Stripe from 'stripe';

// ========================
// 🗄️ SUPABASE (Database)
// ========================
export const createSupabaseClient = () => {
  const supabaseUrl = 'https://oaxkqqamnppkeavunlgo.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseKey);
};

// ========================
// 🤖 OPENAI (IA/LLM)
// ========================
export const createOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
};

// ========================
// 💳 STRIPE (Pagamentos)
// ========================
export const createStripeClient = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });
};

// ========================
// 🖼️ PIXABAY (Imagens)
// ========================
export const createPixabayClient = () => {
  const apiKey = process.env.PIXABAY_API_KEY!;
  
  return {
    search: async (query: string, options: any = {}) => {
      const params = new URLSearchParams({
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        category: 'places',
        min_width: 1920,
        min_height: 1080,
        per_page: options.per_page || '20',
        ...options
      });
      
      const response = await fetch(`https://pixabay.com/api/?${params}`);
      return response.json();
    }
  };
};

// ========================
// 📸 UNSPLASH (Imagens)
// ========================
export const createUnsplashClient = () => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY!;
  
  return {
    search: async (query: string, options: any = {}) => {
      const params = new URLSearchParams({
        query,
        per_page: options.per_page || '20',
        orientation: options.orientation || 'landscape',
        ...options
      });
      
      const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      });
      return response.json();
    }
  };
};

// ========================
// 📷 PEXELS (Imagens)
// ========================
export const createPexelsClient = () => {
  const apiKey = process.env.PEXELS_API_KEY!;
  
  return {
    search: async (query: string, options: any = {}) => {
      const params = new URLSearchParams({
        query,
        per_page: options.per_page || '20',
        orientation: options.orientation || 'landscape',
        ...options
      });
      
      const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
        headers: {
          'Authorization': apiKey
        }
      });
      return response.json();
    }
  };
};

// ========================
// 🗺️ GOOGLE MAPS
// ========================
export const createGoogleMapsClient = () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  
  return {
    geocode: async (address: string) => {
      const params = new URLSearchParams({
        address,
        key: apiKey
      });
      
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
      return response.json();
    },
    
    places: async (query: string, location?: string) => {
      const params = new URLSearchParams({
        query,
        key: apiKey,
        ...(location && { location })
      });
      
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`);
      return response.json();
    }
  };
};

// ========================
// 📊 GOOGLE ANALYTICS
// ========================
export const createGoogleAnalyticsClient = () => {
  const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID!;
  const apiSecret = process.env.GOOGLE_ANALYTICS_API_SECRET!;
  
  return {
    track: async (eventName: string, parameters: any = {}) => {
      const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: parameters.client_id || 'anonymous',
          events: [{
            name: eventName,
            parameters
          }]
        })
      });
      return response.ok;
    }
  };
};

// ========================
// 📘 META (Facebook/Instagram)
// ========================
export const createMetaClient = () => {
  const accessToken = process.env.META_ACCESS_TOKEN!;
  const appId = process.env.META_APP_ID!;
  
  return {
    post: async (message: string, pageId?: string) => {
      const url = pageId 
        ? `https://graph.facebook.com/v18.0/${pageId}/feed`
        : `https://graph.facebook.com/v18.0/me/feed`;
        
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          access_token: accessToken
        })
      });
      return response.json();
    },
    
    getProfile: async (userId = 'me') => {
      const response = await fetch(`https://graph.facebook.com/v18.0/${userId}?access_token=${accessToken}`);
      return response.json();
    }
  };
};

// ========================
// 🐦 TWITTER (X)
// ========================
export const createTwitterClient = () => {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN!;
  const apiKey = process.env.TWITTER_API_KEY!;
  const apiSecret = process.env.TWITTER_API_SECRET!;
  
  return {
    post: async (text: string) => {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });
      return response.json();
    },
    
    search: async (query: string, maxResults = 10) => {
      const params = new URLSearchParams({
        query,
        'max_results': maxResults.toString()
      });
      
      const response = await fetch(`https://api.twitter.com/2/tweets/search/recent?${params}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      return response.json();
    }
  };
};

// ========================
// 🚀 HELPER FUNCTIONS
// ========================

/**
 * Cria todos os clientes de uma vez
 */
export const createAllClients = () => {
  return {
    supabase: createSupabaseClient(),
    openai: createOpenAIClient(),
    stripe: createStripeClient(),
    pixabay: createPixabayClient(),
    unsplash: createUnsplashClient(),
    pexels: createPexelsClient(),
    googleMaps: createGoogleMapsClient(),
    googleAnalytics: createGoogleAnalyticsClient(),
    meta: createMetaClient(),
    twitter: createTwitterClient(),
  };
};

/**
 * Configurações padrão para cada API
 */
export const API_CONFIGS = {
  openai: {
    model: 'gpt-4o',
    max_tokens: 4000,
    temperature: 0.8,
  },
  
  images: {
    pixabay: {
      per_page: 20,
      orientation: 'horizontal',
      category: 'places',
      min_width: 1920,
      min_height: 1080,
    },
    unsplash: {
      per_page: 20,
      orientation: 'landscape',
    },
    pexels: {
      per_page: 20,
      orientation: 'landscape',
    }
  },
  
  stripe: {
    currency: 'usd',
    payment_method_types: ['card'],
  }
};

export default {
  createSupabaseClient,
  createOpenAIClient,
  createStripeClient,
  createPixabayClient,
  createUnsplashClient,
  createPexelsClient,
  createGoogleMapsClient,
  createGoogleAnalyticsClient,
  createMetaClient,
  createTwitterClient,
  createAllClients,
  API_CONFIGS
};
