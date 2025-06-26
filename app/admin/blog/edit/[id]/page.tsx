'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, ArrowLeft, Upload, X, Eye } from 'lucide-react'
import TemplatePages from '../../../../components/TemplatePages'
import Link from 'next/link'
import Image from 'next/image'

interface BlogCategory {
  id: string
  name: string
  slug: string
}

interface BlogTag {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  body: string // Campo real da API
  summary: string | null
  image_url: string | null
  author_name?: string // Pode não existir no banco
  read_time?: number
  published: boolean
  category_id: string | null
  tags?: BlogTag[]
  created_at: string
  updated_at: string
}

export default function EditBlogPost() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [allTags, setAllTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form data - inicializar com valores padrão para evitar inputs não controlados
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [readTime, setReadTime] = useState(5)
  const [published, setPublished] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    loadData()
  }, [postId])

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.body) // Usar 'body' que vem da API
      setSummary(post.summary || '')
      setImageUrl(post.image_url || '')
      setAuthorName(post.author_name || 'LifeWay USA') // Valor padrão se não houver
      setReadTime(post.read_time || 5)
      setPublished(post.published)
      setCategoryId(post.category_id || '')
      setSelectedTags(post.tags?.map(tag => tag.id) || [])
      setImagePreview(post.image_url || '')
    }
  }, [post])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar post
      const postResponse = await fetch(`/api/blog/${postId}`)
      if (!postResponse.ok) {
        throw new Error('Post não encontrado')
      }
      const postData = await postResponse.json()
      setPost(postData)

      // Carregar categorias
      const categoriesResponse = await fetch('/api/blog/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }

      // Carregar tags
      const tagsResponse = await fetch('/api/blog/tags')
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        setAllTags(tagsData)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar post para edição')
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageUrl('') // Limpar URL se arquivo foi selecionado
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    if (url) {
      setImagePreview(url)
      setImageFile(null) // Limpar arquivo se URL foi inserida
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('slug', slug || 'temp-image') // Usar o slug do post

      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no upload')
      }

      const result = await response.json()
      return result.path // A API retorna 'path', não 'url'
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem: ' + (error as Error).message)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !content || !authorName) {
      alert('Título, conteúdo e autor são obrigatórios')
      return
    }

    try {
      setSaving(true)

      // Upload da imagem se necessário
      let finalImageUrl = imageUrl
      if (imageFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) return
        finalImageUrl = uploadedUrl
      }

      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          summary,
          image_url: finalImageUrl,
          author_name: authorName,
          read_time: readTime,
          published,
          category_id: categoryId || null,
          tag_ids: selectedTags
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar post')
      }

      alert('Post atualizado com sucesso!')
      router.push('/admin/blog')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao atualizar post')
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  if (loading) {
    return (
      <TemplatePages
        title="Editar Post"
        subtitle="Edite as informações do artigo do blog"
        ctaText="Voltar ao Admin"
        ctaHref="/admin/blog"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando post...</p>
        </div>
      </TemplatePages>
    )
  }

  if (!post) {
    return (
      <TemplatePages
        title="Post não encontrado"
        subtitle="O post que você está tentando editar não foi encontrado"
        ctaText="Voltar ao Admin"
        ctaHref="/admin/blog"
      >
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Post não encontrado</p>
          <Link
            href="/admin/blog"
            className="text-blue-600 hover:text-blue-800"
          >
            Voltar ao painel administrativo
          </Link>
        </div>
      </TemplatePages>
    )
  }

  return (
    <TemplatePages
      title="Editar Post"
      subtitle="Edite as informações do artigo do blog"
      ctaText="Voltar ao Admin"
      ctaHref="/admin/blog"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/blog"
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Post: {post.title}
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título e Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sera-gerado-automaticamente"
              />
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumo
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descrição do artigo..."
            />
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Post
            </label>
            
            <div className="space-y-4">
              {/* Upload de arquivo */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Upload de arquivo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* OU */}
              <div className="text-center text-gray-500 text-sm">— OU —</div>

              {/* URL da imagem */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  URL da imagem:
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              {/* Preview */}
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setImageUrl('')
                      setImageFile(null)
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escreva o conteúdo do artigo..."
              required
            />
          </div>

          {/* Autor e Tempo de Leitura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de Leitura (minutos)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status de Publicação */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Publicar artigo imediatamente
            </label>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-between pt-6">
            <Link
              href="/admin/blog"
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </TemplatePages>
  )
}
