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

// Card do post de blog
function BlogPostCard({ post }: { post: BlogPost }) {
  const defaultImage = '/images/blog/default-post.jpg';
  const postImage = post.cover_image_url || defaultImage;

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48">
          <Image
            src={postImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
          {post.featured && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Destaque
            </div>
          )}
          {post.category && (
            <div 
              className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
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
                <span>{post.view_count} visualizações</span>
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

// Seção de categoria com 4 posts
function CategorySection({ category, posts }: { category: BlogCategory; posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3"
            style={{ backgroundColor: category.color }}
          ></div>
          <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
          <span className="ml-3 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </span>
        </div>
        <Link 
          href={`/blog/categoria/${category.slug}`}
          className="flex items-center text-azul-petroleo hover:text-azul-petroleo/80 font-medium"
        >
          Ver todos <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {category.description && (
        <p className="text-gray-600 mb-6">{category.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.slice(0, 4).map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

// Componente de filtros
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
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
            />
          </div>
        </div>

        {/* Filtro por Categoria */}
        <div className="lg:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
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
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo"
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
            className="lg:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
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

      {/* Estatísticas do blog */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
          <BookOpen className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {Object.values(categoryPosts).reduce((total, posts) => total + posts.length, 0)}
          </div>
          <div className="text-sm opacity-90">Artigos</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
          <Filter className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{categories.length}</div>
          <div className="text-sm opacity-90">Categorias</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white text-center">
          <Tag className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{tags.length}</div>
          <div className="text-sm opacity-90">Tags</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white text-center">
          <Star className="w-6 h-6 mx-auto mb-2" />
          <div className="text-2xl font-bold">{featuredPosts.length}</div>
          <div className="text-sm opacity-90">Em Destaque</div>
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
