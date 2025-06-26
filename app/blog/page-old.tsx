'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogImage from './BlogImage'
import TemplatePages from '../components/TemplatePages'
import { getAllBlogPosts, getCategoryFromContent, BlogPost } from '../lib/blog'
import { Search, Filter, Tag } from 'lucide-react'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // Extrair categorias e tags únicas
  const categories = Array.from(new Set(posts.map(post => getCategoryFromContent(post.title, post.summary || '').name).filter(Boolean)))
  const tags = Array.from(new Set(posts.flatMap(post => {
    const category = getCategoryFromContent(post.title, post.summary || '')
    return [category.name.toLowerCase().replace(' ', '-')]
  })))

  useEffect(() => {
    async function loadPosts() {
      try {
        const blogPosts = await getAllBlogPosts()
        setPosts(blogPosts)
        setFilteredPosts(blogPosts)
      } catch (error) {
        console.error('Erro ao carregar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
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
      filtered = filtered.filter(post => getCategoryFromContent(post.title, post.summary || '').name === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter(post => {
        const category = getCategoryFromContent(post.title, post.summary || '')
        return category.name.toLowerCase().replace(' ', '-') === selectedTag
      })
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando posts do blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog LifeWay USA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guias completos sobre imigração, vistos e vida nos Estados Unidos
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {posts.length} artigos publicados
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum post encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const category = getCategoryFromContent(post.title, post.summary || '')
              
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                    {/* Image */}
                    <div className="relative h-48">
                      <BlogImage 
                        slug={post.slug} 
                        title={post.title}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span 
                          className="px-3 py-1 text-xs font-medium text-white rounded-full"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                      </div>
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

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <time className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </time>
                        {post.view_count > 0 && (
                          <span className="text-sm text-gray-500">
                            {post.view_count} visualizações
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
