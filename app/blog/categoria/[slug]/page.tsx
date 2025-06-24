'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { 
  BlogPost, 
  BlogCategory, 
  getBlogPostsByCategory,
  getBlogCategoryBySlug 
} from '../../../lib/blog';
import TemplatePages from '../../../components/TemplatePages';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, Clock, Tag, ArrowLeft, Search,
  Eye, User, BookOpen, Filter
} from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
}

// Card do post
function BlogPostCard({ post }: { post: BlogPost }) {
  const defaultImage = '/images/blog/tech-market-usa.jpg';
  const postImage = post.cover_image_url || defaultImage;

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48">
          <Image
            src={postImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {post.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Destaque
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 hover:text-azul-petroleo transition-colors">
            {post.title}
          </h3>
          
          {post.summary && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.summary}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{post.read_time} min</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {post.published_at ? 
                  new Date(post.published_at).toLocaleDateString('pt-BR') : 
                  'Data não disponível'
                }
              </span>
            </div>
            {post.view_count > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="w-3 h-3 mr-1" />
                <span>{post.view_count}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {post.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const [categoryData, postsData] = await Promise.all([
          getBlogCategoryBySlug(params.slug),
          getBlogPostsByCategory(params.slug, 100) // Carregar mais posts
        ]);

        if (!categoryData) {
          notFound();
          return;
        }

        setCategory(categoryData);
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [params.slug]);

  // Filtrar posts por busca
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [searchTerm, posts]);

  // Paginação
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-azul-petroleo"></div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  const heroImages = ['/images/blog/universities-usa.jpg'];

  return (
    <TemplatePages
      title={category.name}
      subtitle={category.description || `Todos os artigos sobre ${category.name}`}
      ctaText="Ver Todas as Categorias"
      ctaHref="/blog"
      heroImages={heroImages}
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href="/blog" 
          className="flex items-center text-azul-petroleo hover:text-azul-petroleo/80 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para Blog
        </Link>
      </div>

      {/* Header da categoria */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <div 
            className="w-6 h-6 rounded-full mr-3"
            style={{ backgroundColor: category.color }}
          ></div>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <span className="ml-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo' : 'artigos'}
          </span>
        </div>
        
        {category.description && (
          <p className="text-gray-600 text-lg mb-6">{category.description}</p>
        )}

        {/* Busca dentro da categoria */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar em ${category.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
          />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
          <BookOpen className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{filteredPosts.length}</div>
          <div className="text-sm opacity-90">Artigos</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
          <Clock className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {filteredPosts.length > 0 
              ? Math.round(filteredPosts.reduce((sum, post) => sum + post.read_time, 0) / filteredPosts.length)
              : 0
            }
          </div>
          <div className="text-sm opacity-90">Min Média</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
          <Eye className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {filteredPosts.reduce((sum, post) => sum + post.view_count, 0)}
          </div>
          <div className="text-sm opacity-90">Visualizações</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white text-center">
          <Filter className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {filteredPosts.filter(post => post.featured).length}
          </div>
          <div className="text-sm opacity-90">Em Destaque</div>
        </div>
      </div>

      {/* Grid de posts */}
      {currentPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'text-white bg-azul-petroleo'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {searchTerm ? 'Nenhum artigo encontrado para sua busca' : 'Nenhum artigo nesta categoria ainda'}
          </div>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-azul-petroleo hover:text-azul-petroleo/80"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-azul-petroleo to-blue-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Explore Outras Categorias</h3>
        <p className="text-lg mb-6 opacity-90">
          Descubra mais conteúdo sobre sua jornada americana
        </p>
        <Link 
          href="/blog" 
          className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Ver Todas as Categorias
        </Link>
      </div>
    </TemplatePages>
  );
}
