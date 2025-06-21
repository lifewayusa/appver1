'use client';

import Navbar from '../components/Navbar';
import { getRandomImage } from '../lib/utils';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Mock data para os posts do blog
const blogPosts = [
  {
    id: 1,
    title: 'Guia Completo: Como se Preparar para a Entrevista do Visto Americano',
    excerpt: 'Descubra as melhores estratégias e dicas essenciais para ter sucesso na sua entrevista consular.',
    author: 'Ana Rodriguez',
    date: '2024-12-10',
    readTime: '8 min',
    category: 'Vistos',
    image: '/images/cities/default-city.jpg', // Will be replaced with consistent random image
    featured: true
  },
  {
    id: 2,
    title: 'Top 10 Cidades Americanas para Brasileiros em 2024',
    excerpt: 'Conheça as melhores cidades dos EUA para brasileiros, considerando custo de vida, oportunidades e comunidade.',
    author: 'Carlos Silva',
    date: '2024-12-08',
    readTime: '12 min',
    category: 'Destinos',
    image: '/images/cities/miami.jpg',
    featured: false
  },
  {
    id: 3,
    title: 'EB-5: Investimento para Green Card - Vale a Pena em 2024?',
    excerpt: 'Análise completa do programa EB-5, valores atualizados e mudanças recentes na legislação.',
    author: 'Pedro Santos',
    date: '2024-12-05',
    readTime: '15 min',
    category: 'Investimento',
    image: '/images/extra/opportunity.webp',
    featured: false
  },
  {
    id: 4,
    title: 'Como Validar seu Diploma Brasileiro nos Estados Unidos',
    excerpt: 'Processo passo a passo para reconhecimento de diplomas e certificações brasileiras nos EUA.',
    author: 'Maria Fernanda',
    date: '2024-12-03',
    readTime: '10 min',
    category: 'Educação',
    image: '/images/basic/education.webp',
    featured: false
  },
  {
    id: 5,
    title: 'Custo de Vida Real: Miami vs São Paulo - Comparação Detalhada',
    excerpt: 'Comparação real entre os custos de moradia, alimentação, transporte e entretenimento.',
    author: 'Roberto Lima',
    date: '2024-12-01',
    readTime: '7 min',
    category: 'Planejamento',
    image: '/images/cities/atlanta.jpg',
    featured: false
  },
  {
    id: 6,
    title: 'Visto O-1: Para Talentos Extraordinários - Guia 2024',
    excerpt: 'Como comprovar talento extraordinário e conseguir o visto O-1 para profissionais excepcionais.',
    author: 'Ana Rodriguez',
    date: '2024-11-28',
    readTime: '11 min',
    category: 'Vistos',
    image: '/images/basic/opportunity.webp',
    featured: false
  }
];

const categories = ['Todos', 'Vistos', 'Destinos', 'Investimento', 'Educação', 'Planejamento'];

export default function BlogPage() {
  const [heroImage, setHeroImage] = useState('/images/hero/home-hero-mobile.webp'); // Default SSR image
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHeroImage(getRandomImage('hero', 'blog-hero'));
  }, []);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <main className="bg-cinza-claro min-h-screen font-figtree">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[300px] flex flex-col justify-center items-center text-white mt-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-azul-petroleo opacity-95"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
            Blog LifeWayUSA
          </h1>
          <p className="text-lg md:text-xl font-figtree">
            Informações atualizadas e insights para sua jornada para os EUA
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border-2 border-azul-petroleo text-azul-petroleo hover:bg-azul-petroleo hover:text-white transition-colors font-figtree font-medium text-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-baskerville text-gray-900 mb-2">Post em Destaque</h2>
              <div className="w-20 h-1 bg-azul-petroleo"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-xl overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-azul-petroleo text-white px-3 py-1 rounded-full text-sm font-figtree font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-baskerville text-3xl mb-4 text-gray-900 leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 font-figtree text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(featuredPost.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center bg-azul-petroleo text-white px-6 py-3 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Ler Artigo Completo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-baskerville text-center text-gray-900 mb-4">
              Artigos Recentes
            </h2>
            <p className="text-center text-gray-600 font-figtree">
              Mantenha-se atualizado com as últimas informações sobre imigração para os EUA
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-azul-petroleo bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-figtree font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-baskerville text-xl mb-3 text-gray-900 leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 font-figtree text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-azul-petroleo hover:text-azul-petroleo font-figtree font-semibold text-sm group"
                  >
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-azul-petroleo text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-baskerville mb-6">
            Receba Conteúdo Exclusivo
          </h2>
          <p className="text-xl font-figtree mb-8 text-blue-100">
            Inscreva-se em nossa newsletter e receba dicas semanais sobre imigração para os EUA
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg font-figtree text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              />
              <button className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-figtree font-semibold hover:bg-gray-100 transition-colors">
                Inscrever
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Sem spam. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tags */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-baskerville text-center mb-8 text-gray-900">
            Tags Populares
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Green Card', 'Visto H1B', 'EB-5', 'Miami', 'Austin', 'Boston', 'Investimento', 'Educação', 'Família', 'Trabalho'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-figtree hover:bg-azul-petroleo hover:text-white transition-colors cursor-pointer"
              >
                <Tag className="w-3 h-3 mr-2" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
