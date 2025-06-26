'use client';

import { useState, useEffect } from 'react';
import { 
  BlogPost, 
  BlogCategory, 
  BlogTag,
  getBlogCategories, 
  getBlogPosts, 
  getFeaturedPosts,
  getBlogTags 
} from '../lib/blog';
import TemplatePages from '../components/TemplatePages';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, Clock, Tag, Search, Filter, 
  ArrowRight, BookOpen, TrendingUp, Star,
  Eye, User
} from 'lucide-react';

// Card do post de blog - Design moderno e limpo
function BlogPostCard({ post }: { post: BlogPost }) {
  const defaultImage = '/images/blog/default-post.jpg';
  const postImage = post.cover_image_url || defaultImage;

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-azul-petroleo/20 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={postImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {post.category && (
            <div 
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5" />
              <span className="font-medium">{post.author_name}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>{post.read_time} min</span>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-azul-petroleo transition-colors duration-200 leading-tight">
            {post.title}
          </h3>
          
          {post.summary && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
              {post.summary}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>
                {post.created_at ? 
                  new Date(post.created_at).toLocaleDateString('pt-BR') : 
                  'Data não disponível'
                }
              </span>
            </div>
            
            {post.view_count > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                <span>{post.view_count}</span>
              </div>
            )}
          </div>

          {/* Tags - Minimalistas */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-azul-petroleo/10 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400 px-2 py-1">+{post.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// Seção de categoria com design moderno
function CategorySection({ category, posts }: { category: BlogCategory; posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div 
            className="w-1 h-8 rounded-full mr-4"
            style={{ backgroundColor: category.color }}
          ></div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{category.name}</h2>
            {category.description && (
              <p className="text-gray-600 text-sm">{category.description}</p>
            )}
          </div>
          <span className="ml-4 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
            {posts.length}
          </span>
        </div>
        <Link 
          href={`/blog/categoria/${category.slug}`}
          className="flex items-center text-azul-petroleo hover:text-azul-petroleo/80 font-medium transition-colors group"
        >
          Ver todos 
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.slice(0, 4).map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

// Componente de filtros moderno
function FiltersSection({ 
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchTerm,
  onCategoryChange,
  onTagChange,
  onSearchChange,
  onClearFilters
}: {
  categories: BlogCategory[];
  tags: BlogTag[];
  selectedCategory: string;
  selectedTag: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azul-petroleo/20 focus:border-azul-petroleo transition-all text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Filtro por Categoria */}
        <div className="lg:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azul-petroleo/20 focus:border-azul-petroleo transition-all text-gray-900 bg-white"
          >
            <option value="">Todas as Categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Tag */}
        <div className="lg:w-48">
          <select
            value={selectedTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azul-petroleo/20 focus:border-azul-petroleo transition-all text-gray-900 bg-white"
          >
            <option value="">Todas as Tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.slug}>{tag.name}</option>
            ))}
          </select>
        </div>

        {/* Botão limpar filtros */}
        {(selectedCategory || selectedTag || searchTerm) && (
          <button
            onClick={onClearFilters}
            className="lg:w-auto px-6 py-3 text-gray-600 hover:text-gray-800 text-sm font-medium hover:bg-gray-50 rounded-xl transition-all"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categoryPosts, setCategoryPosts] = useState<{ [key: string]: BlogPost[] }>({});
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados dos filtros
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFiltered, setShowFiltered] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    async function loadBlogData() {
      try {
        const [categoriesData, tagsData, featuredData] = await Promise.all([
          getBlogCategories(),
          getBlogTags(),
          getFeaturedPosts(6)
        ]);

        setCategories(categoriesData);
        setTags(tagsData);
        setFeaturedPosts(featuredData);

        // Carregar posts por categoria (4 por categoria)
        const postsPromises = categoriesData.map(async (category) => {
          const { posts } = await getBlogPosts({ 
            categorySlug: category.slug, 
            limit: 4,
            publishedOnly: true 
          });
          return { categorySlug: category.slug, posts };
        });

        const categoryPostsResults = await Promise.all(postsPromises);
        const categoryPostsMap: { [key: string]: BlogPost[] } = {};
        
        categoryPostsResults.forEach(({ categorySlug, posts }) => {
          categoryPostsMap[categorySlug] = posts;
        });

        setCategoryPosts(categoryPostsMap);
      } catch (error) {
        console.error('Erro ao carregar dados do blog:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBlogData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    async function applyFilters() {
      if (!selectedCategory && !selectedTag && !searchTerm) {
        setShowFiltered(false);
        return;
      }

      try {
        const { posts } = await getBlogPosts({
          categorySlug: selectedCategory || undefined,
          tagSlug: selectedTag || undefined,
          searchTerm: searchTerm || undefined,
          publishedOnly: true,
          limit: 20
        });

        setFilteredPosts(posts);
        setShowFiltered(true);
      } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        setFilteredPosts([]);
        setShowFiltered(true);
      }
    }

    applyFilters();
  }, [selectedCategory, selectedTag, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setSearchTerm('');
    setShowFiltered(false);
  };

  const heroImages = [
    '/images/blog/blog-hero.jpg',
    '/images/blog/writing-desk.jpg',
    '/images/blog/usa-lifestyle.jpg'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-azul-petroleo"></div>
      </div>
    );
  }

  return (
    <TemplatePages
      title="Blog LifeWayUSA"
      subtitle="Guias, dicas e histórias para sua jornada americana"
      ctaText="Assinar Newsletter"
      ctaHref="/newsletter"
      heroImages={heroImages}
    >
      {/* Filtros */}
      <FiltersSection
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onTagChange={setSelectedTag}
        onSearchChange={setSearchTerm}
        onClearFilters={clearFilters}
      />

      {/* Estatísticas do blog - Design moderno */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Object.values(categoryPosts).reduce((total, posts) => total + posts.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Artigos</div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <Filter className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{categories.length}</div>
          <div className="text-sm text-gray-600">Categorias</div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <Tag className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{tags.length}</div>
          <div className="text-sm text-gray-600">Tags</div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{featuredPosts.length}</div>
          <div className="text-sm text-gray-600">Em Destaque</div>
        </div>
      </div>

      {/* Conteúdo principal */}
      {showFiltered ? (
        /* Resultados filtrados */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">Nenhum artigo encontrado</div>
              <button 
                onClick={clearFilters}
                className="text-azul-petroleo hover:text-azul-petroleo/80"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Layout normal por categorias */
        <div>
          {/* Posts em Destaque */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Star className="w-6 h-6 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Artigos em Destaque</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Seções por categoria */}
          {categories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              posts={categoryPosts[category.slug] || []}
            />
          ))}
        </div>
      )}

      {/* CTA Newsletter */}
      <div className="mt-12 bg-gradient-to-r from-azul-petroleo to-blue-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Não perca nenhuma novidade!</h3>
        <p className="text-lg mb-6 opacity-90">
          Receba nossos melhores artigos e guias diretamente no seu e-mail
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Assinar Grátis
          </button>
        </div>
        <p className="text-sm mt-4 opacity-75">
          Sem spam, apenas conteúdo de valor. Cancele quando quiser.
        </p>
      </div>

      {/* Links úteis */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/ferramentas" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <TrendingUp className="w-8 h-8 text-azul-petroleo mx-auto mb-3" />
            <h4 className="font-bold mb-2">Ferramentas</h4>
            <p className="text-gray-600 text-sm">Criador de Sonhos, Visa Match e Get Opportunity</p>
          </div>
        </Link>
        
        <Link href="/destinos" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <BookOpen className="w-8 h-8 text-azul-petroleo mx-auto mb-3" />
            <h4 className="font-bold mb-2">Destinos</h4>
            <p className="text-gray-600 text-sm">Explore as melhores cidades americanas</p>
          </div>
        </Link>
        
        <Link href="/contato" className="block">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <User className="w-8 h-8 text-azul-petroleo mx-auto mb-3" />
            <h4 className="font-bold mb-2">Consultoria</h4>
            <p className="text-gray-600 text-sm">Fale com nossos especialistas</p>
          </div>
        </Link>
      </div>
    </TemplatePages>
  );
}
