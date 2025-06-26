'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react'
import TemplatePages from '../../components/TemplatePages'
import { getAllBlogPosts, BlogPost } from '../../lib/blog'
import Link from 'next/link'
import BlogImage from '../../blog/BlogImage'

export default function BlogConfigPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const blogPosts = await getAllBlogPosts()
      setPosts(blogPosts)
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus
        })
      })

      if (response.ok) {
        loadPosts() // Recarregar lista
      } else {
        alert('Erro ao atualizar post')
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      alert('Erro ao atualizar post')
    }
  }

  const deletePost = async (postId: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadPosts() // Recarregar lista
        alert('Post excluído com sucesso!')
      } else {
        alert('Erro ao excluir post')
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      alert('Erro ao excluir post')
    }
  }

  if (loading) {
    return (
      <TemplatePages
        title="Configuração do Blog"
        subtitle="Gerencie artigos, categorias e imagens do blog"
        ctaText="Voltar ao Blog"
        ctaHref="/blog"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="Configuração do Blog"
      subtitle="Gerencie artigos, categorias e imagens do blog"
      ctaText="Voltar ao Blog"
      ctaHref="/blog"
    >
      {/* Ações principais */}
      <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Gerenciar Posts ({posts.length})
        </h2>
        
        <div className="flex gap-3">
          <Link
            href="/admin/blog/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Link>
          
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Blog Público
          </Link>
        </div>
      </div>

      {/* Lista de Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum post encontrado</h3>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro artigo do blog.</p>
          <Link
            href="/admin/blog/add"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeiro Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Imagem do post */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <BlogImage
                    slug={post.slug}
                    title={post.title}
                    className="object-cover"
                  />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      
                      {post.summary && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {post.summary}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Por {post.author_name}</span>
                        <span>•</span>
                        <span>{post.read_time} min de leitura</span>
                        <span>•</span>
                        <span>{post.view_count} visualizações</span>
                        <span>•</span>
                        <time>
                          {new Date(post.created_at).toLocaleDateString('pt-BR')}
                        </time>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                    >
                      Ver Post
                    </Link>
                    
                    <Link
                      href={`/admin/blog/edit/${post.id}`}
                      className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Link>

                    <button
                      onClick={() => togglePublished(post.id, post.published)}
                      className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      {post.published ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Despublicar
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Publicar
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deletePost(post.id, post.title)}
                      className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload de imagens em lote */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gerenciar Imagens
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Upload de Imagens em Lote
            </h4>
            <p className="text-gray-600 mb-4">
              Faça upload de múltiplas imagens para o blog ou gerencie as existentes.
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Selecionar Imagens
            </button>
          </div>
        </div>
      </div>
    </TemplatePages>
  )
}
