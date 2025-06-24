// Biblioteca para gerenciar dados do blog do Supabase
// Sistema completo de posts, categorias e tags

import supabase from './supabaseClient';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  cover_image_url: string | null;
  author_id: string | null;
  author_name: string;
  category_id: string | null;
  published: boolean;
  read_time: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  
  // Relações
  category?: BlogCategory;
  tags?: BlogTag[];
}

export interface BlogFilters {
  categorySlug?: string;
  tagSlug?: string;
  searchTerm?: string;
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Busca todos os posts do blog com filtros
 */
export async function getBlogPosts(filters: BlogFilters = {}): Promise<{
  posts: BlogPost[];
  totalCount: number;
}> {
  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `, { count: 'exact' });

    // Aplicar filtros
    if (filters.publishedOnly !== false) {
      query = query.eq('published', true);
    }

    if (filters.categorySlug) {
      query = query.eq('blog_categories.slug', filters.categorySlug);
    }

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,summary.ilike.%${filters.searchTerm}%,body.ilike.%${filters.searchTerm}%`);
    }

    // Paginação
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    // Ordenação por data de criação (se published_at não existir)
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar posts do blog:', error);
      return { posts: [], totalCount: 0 };
    }

    // Formatar tags
    const formattedPosts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || []
    })) || [];

    return {
      posts: formattedPosts,
      totalCount: count || 0
    };
  } catch (err) {
    console.error('Erro inesperado ao buscar posts:', err);
    return { posts: [], totalCount: 0 };
  }
}

/**
 * Busca posts em destaque
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const { posts } = await getBlogPosts({
    featuredOnly: true,
    limit,
    publishedOnly: true
  });
  return posts;
}

/**
 * Busca posts recentes
 */
export async function getRecentPosts(limit: number = 6): Promise<BlogPost[]> {
  const { posts } = await getBlogPosts({
    limit,
    publishedOnly: true
  });
  return posts;
}

/**
 * Busca um post por slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Erro ao buscar post por slug:', error);
      return null;
    }

    // Formatar tags
    const formattedPost = {
      ...data,
      tags: data.tags?.map((tagRelation: any) => tagRelation.tag) || []
    };

    return formattedPost;
  } catch (err) {
    console.error('Erro inesperado ao buscar post por slug:', err);
    return null;
  }
}

/**
 * Busca posts por categoria
 */
export async function getBlogPostsByCategory(categorySlug: string, limit?: number): Promise<BlogPost[]> {
  const { posts } = await getBlogPosts({
    categorySlug,
    limit,
    publishedOnly: true
  });
  return posts;
}

/**
 * Busca posts por tag
 */
export async function getBlogPostsByTag(tagSlug: string, limit?: number): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags!inner(
          tag:blog_tags!inner(*)
        )
      `)
      .eq('published', true)
      .eq('blog_post_tags.blog_tags.slug', tagSlug)
      .order('published_at', { ascending: false })
      .limit(limit || 10);

    if (error) {
      console.error('Erro ao buscar posts por tag:', error);
      return [];
    }

    // Formatar tags
    const formattedPosts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || []
    })) || [];

    return formattedPosts;
  } catch (err) {
    console.error('Erro inesperado ao buscar posts por tag:', err);
    return [];
  }
}

/**
 * Busca todas as categorias
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar categorias:', err);
    return [];
  }
}

/**
 * Busca uma categoria por slug
 */
export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Erro ao buscar categoria por slug:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Erro inesperado ao buscar categoria por slug:', err);
    return null;
  }
}

/**
 * Busca todas as tags
 */
export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

    if (error) {
      console.error('Erro ao buscar tags:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Erro inesperado ao buscar tags:', err);
    return [];
  }
}

/**
 * Busca posts relacionados
 */
export async function getRelatedPosts(currentPostId: string, limit: number = 3): Promise<BlogPost[]> {
  try {
    // Primeiro busca o post atual para pegar a categoria
    const currentPost = await supabase
      .from('blog_posts')
      .select('category_id')
      .eq('id', currentPostId)
      .single();

    if (currentPost.error || !currentPost.data?.category_id) {
      return [];
    }

    // Busca posts da mesma categoria
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*),
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('published', true)
      .eq('category_id', currentPost.data.category_id)
      .neq('id', currentPostId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar posts relacionados:', error);
      return [];
    }

    // Formatar tags
    const formattedPosts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((tagRelation: any) => tagRelation.tag) || []
    })) || [];

    return formattedPosts;
  } catch (err) {
    console.error('Erro inesperado ao buscar posts relacionados:', err);
    return [];
  }
}

/**
 * Incrementa view count de um post
 */
export async function incrementPostViewCount(slug: string): Promise<void> {
  try {
    await supabase.rpc('increment_post_view_count', { post_slug: slug });
  } catch (err) {
    console.error('Erro ao incrementar view count:', err);
  }
}

/**
 * Utilidades para formatação
 */
export function formatReadTime(minutes: number): string {
  return `${minutes} min de leitura`;
}

export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generatePostSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .trim();
}

export function extractExcerpt(body: string, maxLength: number = 150): string {
  // Remove HTML tags se houver
  const plainText = body.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}
