'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BlogImage from '../BlogImage'
import { getBlogPostBySlug, incrementViewCount, getCategoryFromContent, BlogPost } from '../../lib/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const blogPost = await getBlogPostBySlug(params.slug)
        if (!blogPost) {
          notFound()
          return
        }
        
        setPost(blogPost)
        
        // Incrementar view count
        await incrementViewCount(params.slug)
      } catch (error) {
        console.error('Erro ao carregar post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  const category = getCategoryFromContent(post.title, post.summary || '')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-8">
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar ao Blog
            </Link>
          </nav>
          
          <div className="text-center">
            <div className="mb-4">
              <span 
                className="px-4 py-2 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <span>{post.author_name}</span>
              <span>•</span>
              <time>{new Date(post.created_at).toLocaleDateString('pt-BR')}</time>
              <span>•</span>
              <span>{post.read_time} min de leitura</span>
              <span>•</span>
              <span>{post.view_count} visualizações</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-96 bg-gray-200">
        <BlogImage 
          slug={post.slug} 
          title={post.title}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            {post.summary && (
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                {post.summary}
              </p>
            )}
            
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </div>

          {/* Post Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Publicado por</p>
                <p className="font-medium text-gray-900">{post.author_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Última atualização</p>
                <p className="font-medium text-gray-900">
                  {new Date(post.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
