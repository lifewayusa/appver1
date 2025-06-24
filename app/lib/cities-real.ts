// Biblioteca para gerenciar dados de cidades do Supabase
// Substitui as funções mock por integrações reais

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export interface AverageTemperature {
  celsius: number;
  fahrenheit: number;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  population: number | null;
  average_temperature: AverageTemperature | null;
  cost_of_living_index: number | null;
  job_market_score: number | null;
  education_score: number | null;
  business_opportunity_score: number | null;
  latitude: number | null;
  longitude: number | null;
  imagem: string | null;
  description: string | null;
  education_highlights: string | null;
  attractions: string | null;
  neighborhoods: string | null;
  main_destiny: boolean;
  created_at: string;
  updated_at: string;
  // Novos campos para informações educacionais
  universities?: string[];
  english_schools?: string[];
  vocational_schools?: string[];
  regular_schools?: string[];
}

/**
 * Gera URL da imagem da cidade baseada no ID
 * Todas as imagens seguem o padrão {id}.jpg após o download das APIs
 */
export function getCityImageUrl(city: City): string {
  // Primeiro tenta usar o campo imagem se existir
  if (city.imagem) {
    return city.imagem;
  }
  
  // Fallback para o padrão {id}.jpg (usado pelo sistema de download)
  return `/images/cities/${city.id}.jpg`;
}

/**
 * Gera URL da imagem da cidade com fallback para imagem padrão
 */
export function getCityImageUrlWithFallback(city: City): string {
  const primaryUrl = getCityImageUrl(city);
  return primaryUrl;
}

export interface CityFilters {
  state?: string;
  searchTerm?: string;
  mainDestinyOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Busca todas as cidades principais (main_destiny = true)
 */
export async function getMainDestinyCities(): Promise<City[]> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('main_destiny', true)
      .order('population', { ascending: false });

    if (error) {
      console.error('Erro ao buscar cidades principais:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar cidades:', err);
    return [];
  }
}

/**
 * Busca cidades com filtros
 */
export async function getCities(filters: CityFilters = {}): Promise<{
  cities: City[];
  totalCount: number;
}> {
  try {
    let query = supabase.from('cities').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters.state && filters.state !== 'Todos os Estados') {
      query = query.eq('state', filters.state);
    }

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    if (filters.mainDestinyOnly) {
      query = query.eq('main_destiny', true);
    }

    // Paginação
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Ordenação
    query = query.order('main_destiny', { ascending: false })
                 .order('population', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar cidades:', error);
      return { cities: [], totalCount: 0 };
    }

    return {
      cities: data || [],
      totalCount: count || 0
    };
  } catch (err) {
    console.error('Erro inesperado ao buscar cidades:', err);
    return { cities: [], totalCount: 0 };
  }
}

/**
 * Busca uma cidade por ID
 */
export async function getCityById(id: string): Promise<City | null> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar cidade:', error);
      return null;
    }

    if (data) {
      // Corrige o campo average_temperature
      data.average_temperature = parseAverageTemperature(data.average_temperature);
    }

    return data;
  } catch (err) {
    console.error('Erro inesperado ao buscar cidade:', err);
    return null;
  }
}

/**
 * Busca uma cidade por slug (name-state)
 */
export async function getCityBySlug(slug: string): Promise<City | null> {
  try {
    const [name, state] = slug.split('-').map(s => 
      s.replace(/\b\w/g, l => l.toUpperCase())
    );

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', name)
      .ilike('state', state)
      .single();

    if (error) {
      console.error('Erro ao buscar cidade por slug:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro inesperado ao buscar cidade por slug:', err);
    return null;
  }
}

/**
 * Busca cidades por estado
 */
export async function getCitiesByState(state: string): Promise<City[]> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('state', state)
      .order('population', { ascending: false });

    if (error) {
      console.error('Erro ao buscar cidades por estado:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar cidades por estado:', err);
    return [];
  }
}

/**
 * Busca todos os estados únicos
 */
export async function getStates(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('state')
      .order('state');

    if (error) {
      console.error('Erro ao buscar estados:', error);
      return [];
    }

    // Remover duplicatas
    const states = data?.map(item => item.state) || [];
    const uniqueStates = Array.from(new Set(states));
    return uniqueStates;
  } catch (err) {
    console.error('Erro inesperado ao buscar estados:', err);
    return [];
  }
}

/**
 * Utilidades para formatação
 */
export function calculateCityRating(city: City): number {
  const scores = [
    city.job_market_score || 0,
    city.education_score || 0,
    city.business_opportunity_score || 0
  ];
  
  const validScores = scores.filter(score => score > 0);
  if (validScores.length === 0) return 0;
  
  return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length * 10) / 10;
}

export function formatPopulation(population: number | null): string {
  if (!population) return 'N/A';
  return population.toLocaleString('pt-BR') + ' habitantes';
}

export function formatCostOfLiving(cost: number | null): string {
  if (!cost) return 'N/A';
  return `${cost}/100`;
}

export function generateCitySlug(name: string, state: string): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Busca cidades relacionadas
 */
export async function getRelatedCities(currentCityId: string, limit: number = 4): Promise<City[]> {
  try {
    const currentCity = await getCityById(currentCityId);
    if (!currentCity) return [];

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('state', currentCity.state)
      .neq('id', currentCityId)
      .limit(limit)
      .order('population', { ascending: false });

    if (error) {
      console.error('Erro ao buscar cidades relacionadas:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar cidades relacionadas:', err);
    return [];
  }
}

// Função utilitária para garantir que average_temperature seja sempre objeto ou null
function parseAverageTemperature(raw: any): AverageTemperature | null {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.celsius !== undefined && raw.fahrenheit !== undefined) {
    return { celsius: Number(raw.celsius), fahrenheit: Number(raw.fahrenheit) };
  }
  // Caso venha como string JSON
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (obj && obj.celsius !== undefined && obj.fahrenheit !== undefined) {
      return { celsius: Number(obj.celsius), fahrenheit: Number(obj.fahrenheit) };
    }
  } catch {}
  return null;
}
