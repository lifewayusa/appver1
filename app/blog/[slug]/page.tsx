"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getBlogPostBySlug } from "../../lib/blog";
import TemplatePages from "../../components/TemplatePages";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      const data = await getBlogPostBySlug(slug);
      if (!data) {
        notFound();
        return;
      }
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-azul-petroleo mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do artigo */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-azul-petroleo hover:text-azul-petroleo/80 font-medium mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao Blog
          </Link>
          
          {/* Categoria */}
          {post.category && (
            <div className="inline-flex items-center mb-4">
              <span 
                className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {post.summary && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.summary}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-azul-petroleo" />
              <span className="font-medium">{post.author_name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-azul-petroleo" />
              <span>
                {post.created_at ? 
                  new Date(post.created_at).toLocaleDateString("pt-BR", {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 
                  'Data não disponível'
                }
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-azul-petroleo" />
              <span>{post.read_time} min de leitura</span>
            </div>
            {post.view_count > 0 && (
              <div className="flex items-center">
                <span className="text-sm">{post.view_count} visualizações</span>
              </div>
            )}
          </div>

          {/* Botão de compartilhar */}
          <button className="flex items-center text-gray-600 hover:text-azul-petroleo transition-colors">
            <Share2 className="w-5 h-5 mr-2" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Imagem de capa */}
      {post.cover_image_url && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src={post.cover_image_url} 
              alt={post.title} 
              width={1200} 
              height={600} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Conteúdo do artigo */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-azul-petroleo prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-azul-petroleo prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content_html || post.body }} 
          />
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <Link 
                    key={tag.id} 
                    href={`/blog?tag=${tag.slug}`}
                    className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-azul-petroleo/10 text-gray-700 hover:text-azul-petroleo rounded-lg text-sm font-medium transition-colors"
                  >
                    <Tag className="w-3 h-3 mr-1.5" />
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Call to action */}
        <div className="mt-12 bg-gradient-to-r from-azul-petroleo to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Gostou do conteúdo?</h3>
          <p className="text-blue-100 mb-6">
            Explore nossas ferramentas para planejar sua mudança para os EUA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Acessar Dashboard
            </Link>
            <Link 
              href="/blog" 
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Mais Artigos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
