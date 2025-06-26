'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TemplatePages from '../../../components/TemplatePages'
import { Upload, Link as LinkIcon, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AddBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    author_name: 'LifeWay USA',
    read_time: 5,
    published: false
  })
  const [imageMethod, setImageMethod] = useState<'upload' | 'url'>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  // Gerar slug automaticamente do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreview(url)
  }

  const savePost = async (publish: boolean = false) => {
    if (!formData.title.trim() || !formData.body.trim()) {
      alert('Título e conteúdo são obrigatórios!')
      return
    }

    setSaving(true)
    
    try {
      // 1. Salvar o post
      const postData = {
        ...formData,
        published: publish
      }

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar post')
      }

      const savedPost = await response.json()

      // 2. Upload da imagem se necessário
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('slug', savedPost.slug)

        await fetch('/api/blog/upload', {
          method: 'POST',
          body: formData
        })
      } else if (imageUrl) {
        // Download da imagem da URL
        await fetch('/api/blog/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: imageUrl,
            slug: savedPost.slug
          })
        })
      }

      alert(publish ? 'Post publicado com sucesso!' : 'Post salvo como rascunho!')
      router.push('/admin/blog')
      
    } catch (error) {
      console.error('Erro ao salvar post:', error)
      alert('Erro ao salvar post. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <TemplatePages
      title="Novo Post do Blog"
      subtitle="Crie um novo artigo para o blog LifeWay USA"
      ctaText="Voltar"
      ctaHref="/admin/blog"
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Título e Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Como conseguir o visto americano"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="como-conseguir-visto-americano"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL do post: /blog/{formData.slug}
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resumo
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            rows={3}
            placeholder="Breve descrição do que o artigo aborda..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Conteúdo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo *
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            rows={15}
            placeholder="Escreva o conteúdo completo do artigo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Imagem do Post
          </label>
          
          {/* Método de imagem */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setImageMethod('upload')}
              className={`px-4 py-2 rounded-lg font-medium ${
                imageMethod === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4 mr-2 inline" />
              Upload
            </button>
            <button
              type="button"
              onClick={() => setImageMethod('url')}
              className={`px-4 py-2 rounded-lg font-medium ${
                imageMethod === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <LinkIcon className="w-4 h-4 mr-2 inline" />
              URL
            </button>
          </div>

          {/* Upload */}
          {imageMethod === 'upload' && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
              </p>
            </div>
          )}

          {/* URL */}
          {imageMethod === 'url' && (
            <div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole a URL de uma imagem externa
              </p>
            </div>
          )}

          {/* Preview da imagem */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Autor
            </label>
            <input
              type="text"
              value={formData.author_name}
              onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tempo de Leitura (min)
            </label>
            <input
              type="number"
              min="1"
              value={formData.read_time}
              onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Link
            href="/admin/blog"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </Link>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => savePost(false)}
              disabled={saving}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Rascunho'}
            </button>
            
            <button
              type="button"
              onClick={() => savePost(true)}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              {saving ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </form>
    </TemplatePages>
  )
}
