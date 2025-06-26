import supabase from './supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  author_name: string;
  published: boolean;
  read_time: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  category_id?: string;
  category?: BlogCategory;
  tags?: BlogTag[];
}

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

// Buscar todos os posts publicados com categorias e tags
export async function getAllBlogPosts(): Promise<BlogPost[]> {
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
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }

    // Transformar dados para formato esperado
    return (data || []).map(post => ({
      ...post,
      tags: post.tags?.map((t: any) => t.tag).filter(Boolean) || []
    }));
  } catch (error) {
    console.error('Erro na função getAllBlogPosts:', error);
    return [];
  }
}

// Buscar post por slug com categoria e tags
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
      console.error('Erro ao buscar post:', error);
      return null;
    }

    // Transformar dados para formato esperado
    return {
      ...data,
      tags: data.tags?.map((t: any) => t.tag).filter(Boolean) || []
    };
  } catch (error) {
    console.error('Erro na função getBlogPostBySlug:', error);
    return null;
  }
}

// Buscar todas as categorias
export async function getAllBlogCategories(): Promise<BlogCategory[]> {
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
  } catch (error) {
    console.error('Erro na função getAllBlogCategories:', error);
    return [];
  }
}

// Buscar todas as tags
export async function getAllBlogTags(): Promise<BlogTag[]> {
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
  } catch (error) {
    console.error('Erro na função getAllBlogTags:', error);
    return [];
  }
}

// Incrementar view count
export async function incrementViewCount(slug: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_post_views', { 
      post_slug: slug 
    });

    if (error) {
      console.error('Erro ao incrementar views:', error);
    }
  } catch (error) {
    console.error('Erro na função incrementViewCount:', error);
  }
}

// Função helper para obter categoria de um post (compatibilidade)
export function getCategoryFromContent(title: string, summary: string): BlogCategory {
  // Esta função agora é apenas para compatibilidade
  // Os dados reais vêm do banco
  return {
    id: '1',
    name: 'Vistos',
    slug: 'vistos',
    description: null,
    color: '#1E40AF',
    created_at: new Date().toISOString()
  };
}
