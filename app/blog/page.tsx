'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogImage from './BlogImage'
import TemplatePages from '../components/TemplatePages'
import { 
  getAllBlogPosts, 
  getAllBlogCategories, 
  getAllBlogTags, 
  BlogPost, 
  BlogCategory, 
  BlogTag 
} from '../lib/blog'
import { Search, Filter, Tag } from 'lucide-react'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [blogPosts, blogCategories, blogTags] = await Promise.all([
          getAllBlogPosts(),
          getAllBlogCategories(),
          getAllBlogTags()
        ])
        
        setPosts(blogPosts)
        setFilteredPosts(blogPosts)
        setCategories(blogCategories)
        setTags(blogTags)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar posts
  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category?.slug === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags?.some(tag => tag.slug === selectedTag)
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm, selectedCategory, selectedTag])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedTag('')
  }

  if (loading) {
    return (
      <TemplatePages
        title="Blog LifeWay USA"
        subtitle="Guias completos sobre imigração, vistos e vida nos Estados Unidos"
        ctaText="Explorar Blog"
        ctaHref="/blog"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando posts...</p>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="Blog LifeWay USA"
      subtitle="Guias completos sobre imigração, vistos e vida nos Estados Unidos"
      ctaText="Explorar Blog"
      ctaHref="/blog"
    >
      {/* Filtros e Busca */}
      <div className="mb-8 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Categoria */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.slug}>{tag.name}</option>
              ))}
            </select>
          </div>

          {/* Limpar filtros */}
          {(searchTerm || selectedCategory || selectedTag) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-600">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
        </div>
      </div>

      {/* Grid de Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
            <p>Tente ajustar seus filtros ou buscar por outros termos.</p>
          </div>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos os artigos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-48">
                  <BlogImage 
                    slug={post.slug} 
                    title={post.title}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                  {post.category && (
                    <div className="absolute top-4 right-4">
                      <span 
                        className="px-3 py-1 text-xs font-medium text-white rounded-full"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {post.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author_name}</span>
                    <span>{post.read_time} min</span>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag.id}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <time className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </time>
                      {post.view_count > 0 && (
                        <span className="text-xs text-gray-400">
                          {post.view_count} visualizações
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Link para configuração (admin) */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <Link 
          href="/admin/blog"
          className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          ⚙️ Configurar Blog
        </Link>
      </div>
    </TemplatePages>
  )
}
