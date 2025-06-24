'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { City, getCityById, getRelatedCities, getCityImageUrl } from '../../lib/cities-real';
import TemplatePages from '../../components/TemplatePages';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Users, Thermometer, DollarSign, Briefcase, 
  GraduationCap, TrendingUp, Star, ArrowLeft, ExternalLink,
  Home, Building, School, Car, Plane, Coffee
} from 'lucide-react';

interface CityDetailProps {
  params: { id: string };
}

export default function CityDetailPage({ params }: CityDetailProps) {
  const [city, setCity] = useState<City | null>(null);
  const [relatedCities, setRelatedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCityData() {
      try {
        const cityData = await getCityById(params.id);
        if (!cityData) {
          notFound();
          return;
        }
        
        setCity(cityData);
        
        // Carregar cidades relacionadas
        const related = await getRelatedCities(params.id, 4);
        setRelatedCities(related);
      } catch (error) {
        console.error('Erro ao carregar dados da cidade:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    loadCityData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-azul-petroleo"></div>
      </div>
    );
  }

  if (!city) {
    notFound();
  }

  const cityImage = getCityImageUrl(city);
  // Novos campos para informações educacionais
  const universities = city.universities || [];
  const englishSchools = city.english_schools || [];
  const vocationalSchools = city.vocational_schools || [];
  const regularSchools = city.regular_schools || [];
  // Temperatura média (JSON: { celsius: number, fahrenheit: number })
  let tempC = null, tempF = null;
  if (city.average_temperature && typeof city.average_temperature === 'object') {
    tempC = city.average_temperature.celsius;
    tempF = city.average_temperature.fahrenheit;
  }
  const overallRating = ((city.job_market_score || 0) + (city.education_score || 0) + (city.business_opportunity_score || 0)) / 3;

  return (
    <TemplatePages
      title={null}
      subtitle={null}
      ctaText={null}
      ctaHref={null}
      heroImages={[cityImage]}
    >
      {/* HERO SECTION */}
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg">
        <Image
          src={cityImage}
          alt={city.name}
          fill
          className="object-cover"
          onError={(e) => { e.currentTarget.src = '/images/cities/default-city.jpg'; }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-6 right-8 bg-yellow-400/90 rounded-full px-5 py-3 flex items-center shadow-xl border-4 border-white">
          <Star className="text-yellow-700 w-6 h-6 mr-2" />
          <span className="text-xl font-bold text-yellow-900">{overallRating > 0 ? overallRating.toFixed(1) : 'N/A'}</span>
        </div>
        {/* Título e subtítulo centralizados na parte inferior da imagem */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center w-full px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{city.name}</h1>
          <h2 className="text-lg md:text-xl font-medium text-white drop-shadow">{city.state}</h2>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href="/destinos" 
          className="flex items-center text-azul-petroleo hover:text-azul-petroleo/80 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para Destinos
        </Link>
      </div>

      {/* DADOS GERAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 rounded-2xl shadow p-6 flex flex-col items-center">
            <Users className="w-8 h-8 text-blue-700 mb-2" />
            <span className="font-semibold text-blue-900 text-lg">População</span>
            <span className="text-2xl font-bold text-blue-900 mt-1">{city.population ? city.population.toLocaleString('pt-BR') : 'N/A'}</span>
          </div>
          <div className="bg-green-50 rounded-2xl shadow p-6 flex flex-col items-center">
            <Thermometer className="w-8 h-8 text-green-700 mb-2" />
            <span className="font-semibold text-green-900 text-lg">Temperatura Média</span>
            <span className="text-2xl font-bold text-green-900 mt-1">
              {tempC !== null && tempF !== null ? `${tempC}°C / ${tempF}°F` : 'N/A'}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center md:items-start">
          <div className="bg-white/80 rounded-2xl shadow p-6 w-full">
            <h2 className="text-xl font-bold text-azul-petroleo mb-2">Resumo</h2>
            <p className="text-gray-700 text-base">{city.description || `Descubra tudo sobre ${city.name} e por que é ideal para brasileiros`}</p>
          </div>
        </div>
      </div>

      {/* AVALIAÇÃO DETALHADA */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h3 className="text-2xl font-bold mb-8 text-azul-petroleo text-center">Avaliação Detalhada</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Score de Trabalho */}
          <div className="flex flex-col items-center bg-blue-50 rounded-2xl p-6 shadow">
            <Briefcase className="w-10 h-10 text-blue-700 mb-2" />
            <span className="font-semibold text-blue-900 text-lg mb-1">Mercado de Trabalho</span>
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray={`${(city.job_market_score || 0) * 10}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-900">{typeof city.job_market_score === 'number' && !isNaN(city.job_market_score) ? city.job_market_score.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
            <span className="text-sm text-blue-800">Oportunidades de emprego e salários</span>
          </div>
          {/* Score de Educação */}
          <div className="flex flex-col items-center bg-purple-50 rounded-2xl p-6 shadow">
            <GraduationCap className="w-10 h-10 text-purple-700 mb-2" />
            <span className="font-semibold text-purple-900 text-lg mb-1">Educação</span>
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={`${(city.education_score || 0) * 10}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-900">{city.education_score ? city.education_score.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
            <span className="text-sm text-purple-800">Qualidade das escolas e universidades</span>
          </div>
          {/* Score de Negócios */}
          <div className="flex flex-col items-center bg-yellow-50 rounded-2xl p-6 shadow">
            <TrendingUp className="w-10 h-10 text-yellow-700 mb-2" />
            <span className="font-semibold text-yellow-900 text-lg mb-1">Oportunidades de Negócio</span>
            <div className="relative w-24 h-24 mb-2">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  strokeDasharray={`${(city.business_opportunity_score || 0) * 10}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-900">{city.business_opportunity_score ? city.business_opportunity_score.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
            <span className="text-sm text-yellow-800">Ambiente para empreendedorismo</span>
          </div>
          {/* Score de Custo de Vida */}
          <div className="flex flex-col items-center bg-red-50 rounded-2xl p-6 shadow">
            <DollarSign className="w-10 h-10 text-red-700 mb-2" />
            <span className="font-semibold text-red-900 text-lg mb-1">Custo de Vida</span>
            <div className="flex items-center justify-center h-24 mb-2">
              <span className="text-3xl font-bold text-red-900">
                {typeof city.cost_of_living_index === 'number' && !isNaN(city.cost_of_living_index) ? city.cost_of_living_index : 'N/A'}
              </span>
            </div>
            <span className="text-sm text-red-800">Média nacional = 1.0</span>
          </div>
        </div>
        {/* Legenda de interpretação dos índices */}
        <div className="text-center mt-10">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Como interpretar os índices
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>MÉDIA NACIONAL = 1.0</strong></p>
              <p>🟢 Acima de 1.0 = Acima da média nacional</p>
              <p>🔴 Abaixo de 1.0 = Abaixo da média nacional</p>
              <p>⚪ 1.0 = Igual à média nacional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções informativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Educação */}
        {city.education_highlights && (
          <div className="bg-purple-50 rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <School className="w-6 h-6 text-purple-700 mr-3" />
              <h3 className="text-xl font-bold text-purple-900">Educação</h3>
            </div>
            <p className="text-gray-800 leading-relaxed">{city.education_highlights}</p>
            {/* Universidades */}
            {universities.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-purple-800 mb-2">Universidades</h4>
                <ul className="list-disc ml-6 text-sm text-purple-900">
                  {universities.map((u: string, i: number) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            )}
            {/* Escolas de inglês */}
            {englishSchools.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-purple-800 mb-2">Escolas de Inglês</h4>
                <ul className="list-disc ml-6 text-sm text-purple-900">
                  {englishSchools.map((e: string, i: number) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
            {/* Escolas profissionais */}
            {vocationalSchools.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-purple-800 mb-2">Escolas Profissionais</h4>
                <ul className="list-disc ml-6 text-sm text-purple-900">
                  {vocationalSchools.map((v: string, i: number) => <li key={i}>{v}</li>)}
                </ul>
              </div>
            )}
            {/* Escolas regulares */}
            {regularSchools.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-purple-800 mb-2">Escolas Regulares</h4>
                <ul className="list-disc ml-6 text-sm text-purple-900">
                  {regularSchools.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Atrações */}
        {city.attractions && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Coffee className="w-6 h-6 text-azul-petroleo mr-3" />
              <h3 className="text-xl font-bold">Atrações e Lifestyle</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{city.attractions}</p>
          </div>
        )}

        {/* Bairros */}
        {city.neighborhoods && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Home className="w-6 h-6 text-azul-petroleo mr-3" />
              <h3 className="text-xl font-bold">Bairros Recomendados</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{city.neighborhoods}</p>
          </div>
        )}

        {/* Localização */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-6 h-6 text-azul-petroleo mr-3" />
            <h3 className="text-xl font-bold">Localização</h3>
          </div>
          <div className="space-y-2">
            <p><strong>Estado:</strong> {city.state}</p>
            <p><strong>País:</strong> {city.country}</p>
            <p><strong>Região:</strong> {city.region}</p>
            {typeof city.latitude === 'number' && typeof city.longitude === 'number' && !isNaN(city.latitude) && !isNaN(city.longitude) ? (
              <p><strong>Coordenadas:</strong> {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="bg-gradient-to-r from-azul-petroleo to-blue-600 rounded-xl p-8 text-white text-center mb-12">
        <h3 className="text-2xl font-bold mb-4">Interessado em {city.name}?</h3>
        <p className="text-lg mb-6 opacity-90">
          Fale com nossos especialistas para um plano personalizado para sua mudança
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/ferramentas/criador-sonhos" 
            className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Analisar Meu Perfil
          </Link>
          <Link 
            href="/contato" 
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-azul-petroleo transition-colors"
          >
            Falar com Especialista
          </Link>
        </div>
      </div>

      {/* Cidades relacionadas */}
      {relatedCities.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Outras Cidades em {city.state}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCities.map((relatedCity) => (
              <Link key={relatedCity.id} href={`/destinos/${relatedCity.id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-40">
                    <Image
                      src={getCityImageUrl(relatedCity)}
                      alt={relatedCity.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/cities/default-city.jpg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h4 className="font-bold text-white">{relatedCity.name}</h4>
                      <span className="text-sm text-gray-200">{relatedCity.state}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>População: {typeof relatedCity.population === 'number' && !isNaN(relatedCity.population) ? (relatedCity.population / 1000).toFixed(0) + 'k' : 'N/A'}</span>
                      <div className="flex items-center">
                        <Star className="text-yellow-500 w-3 h-3 mr-1" />
                        <span>
                          {typeof relatedCity.job_market_score === 'number' && typeof relatedCity.education_score === 'number' && typeof relatedCity.business_opportunity_score === 'number'
                            ? (((relatedCity.job_market_score || 0) + (relatedCity.education_score || 0) + (relatedCity.business_opportunity_score || 0)) / 3).toFixed(1)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </TemplatePages>
  );
}
