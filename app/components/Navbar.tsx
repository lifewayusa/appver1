'use client'

import Link from 'next/link'
import { Settings, ChevronDown, Home as HomeIcon, Users, Info, FileText, BarChart2, DollarSign, Mail, MapPin, BookOpen, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '../lib/user-context'

const topStates = [
  { name: 'Florida', slug: 'florida' },
  { name: 'California', slug: 'california' },
  { name: 'Texas', slug: 'texas' },
  { name: 'New York', slug: 'new-york' },
  { name: 'Nevada', slug: 'nevada' }
]

export default function Navbar() {
  const { user } = useUser()
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showInfoMenu, setShowInfoMenu] = useState(false)
  const [showBlogMenu, setShowBlogMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    return pathname === href
  }

  return (
    <nav className="absolute top-8 left-0 right-0 h-24 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-baskerville font-bold text-3xl" style={{ fontWeight: 700 }}>
              LifeWayUSA
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-6 flex items-baseline space-x-3">
              {/* Home Icon */}
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-figtree font-medium transition-colors flex items-center ${
                  isActiveLink('/') 
                    ? 'text-white border-b-2 border-lilac-400' 
                    : 'text-white hover:text-lilac-300'
                }`}
                aria-label="Home"
              >
                <HomeIcon className="w-6 h-6 mr-1" />
              </Link>
              <div className="w-px h-6 bg-white bg-opacity-30"></div>
              
              {/* Destinos Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                    isActiveLink('/destinos') 
                      ? 'text-white border-b-2 border-lilac-400' 
                      : 'text-white hover:text-lilac-300'
                  }`}
                >
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>Destinos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showMegaMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-4xl bg-transparent shadow-xl border border-gray-200 border-opacity-30 rounded-b-lg mt-1 backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-8 p-8">
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          🇺🇸 Estados Unidos
                        </h3>
                        <div className="space-y-2">
                          <Link 
                            href="/destinos" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Ver todos os destinos
                          </Link>
                          <Link 
                            href="/destinos/comparar" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Comparar estados
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Por Região
                        </h3>
                        <div className="space-y-2">
                          <Link 
                            href="/destinos/regiao/costa-leste" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Costa Leste
                          </Link>
                          <Link 
                            href="/destinos/regiao/costa-oeste" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Costa Oeste
                          </Link>
                          <Link 
                            href="/destinos/regiao/sul" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Sul
                          </Link>
                          <Link 
                            href="/destinos/regiao/meio-oeste" 
                            className="block text-sm text-white hover:text-lilac-300 font-figtree"
                          >
                            Meio-Oeste
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Top 5 Estados
                        </h3>
                        <div className="space-y-2">
                          {topStates.map((state) => (
                            <Link 
                              key={state.slug}
                              href={`/destinos/${state.slug}`} 
                              className="block text-sm text-white hover:text-lilac-300 font-figtree"
                            >
                              {state.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações Úteis with Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowInfoMenu(true)}
                onMouseLeave={() => setShowInfoMenu(false)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                    isActiveLink('/informacoes-uteis') 
                      ? 'text-white border-b-2 border-lilac-400' 
                      : 'text-white hover:text-lilac-300'
                  }`}
                >
                  <Info className="w-5 h-5 mr-1" />
                  <span>Informações Úteis</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showInfoMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-2xl bg-transparent shadow-xl border border-gray-200 border-opacity-30 rounded-b-lg mt-1 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-8 p-8">
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Recursos & Institucional
                        </h3>
                        <div className="space-y-2">
                          <Link href="/quem-somos" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><Users className="w-4 h-4 mr-2" />Quem Somos</Link>
                          <Link href="/planos" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><DollarSign className="w-4 h-4 mr-2" />Planos</Link>
                          <Link href="/porque-mudar" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Por que mudar</Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-baskerville text-lg text-white border-b border-white border-opacity-30 pb-2">
                          Materiais
                        </h3>
                        <div className="space-y-2">
                          <Link href="/recursos-uteis" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><FileText className="w-4 h-4 mr-2" />Recursos Úteis</Link>
                          <Link href="/comparativo-cidades" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><BarChart2 className="w-4 h-4 mr-2" />Comparativo de Cidades</Link>
                          <Link href="/destinos/guia-completo" className="block text-sm text-white hover:text-lilac-300 font-figtree flex items-center"><Info className="w-4 h-4 mr-2" />Guia completo de mudança</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Blog Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setShowBlogMenu(true)}
                onMouseLeave={() => setShowBlogMenu(false)}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-figtree font-medium transition-colors ${
                    isActiveLink('/blog') 
                      ? 'text-white border-b-2 border-lilac-400' 
                      : 'text-white hover:text-lilac-300'
                  }`}
                  type="button"
                >
                  <BookOpen className="w-5 h-5 mr-1" />
                  <span>Blog</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showBlogMenu && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-3xl bg-transparent shadow-xl border border-gray-200 border-opacity-30 rounded-b-lg mt-1 backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-8 p-8">
                      {[1,2,3].map((i) => (
                        <div key={i} className="w-[200px] h-[240px] bg-white rounded-lg shadow flex flex-col overflow-hidden">
                          <div className="w-full h-[140px] bg-gray-200 flex items-center justify-center">
                            <img src={`/images/blog/artigo${i}.jpg`} alt={`Artigo ${i}`} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1 flex items-center justify-center p-2">
                            <span className="text-sm font-bold text-azul-petroleo text-center">Título do Artigo {i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contato */}
              <Link
                href="/contato"
                className={`px-3 py-2 text-sm font-figtree font-medium transition-colors flex items-center ${
                  isActiveLink('/contato') 
                    ? 'text-white border-b-2 border-lilac-400' 
                    : 'text-white hover:text-lilac-300'
                }`}
              >
                <Mail className="w-5 h-5 mr-1" />Contato
              </Link>
              <div className="w-px h-6 bg-white bg-opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
