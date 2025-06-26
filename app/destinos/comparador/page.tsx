'use client';

import { useState, useEffect } from 'react';
import { City, getMainDestinyCities } from '../../lib/cities-real';
import TemplatePages from '../../components/TemplatePages';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Users, Thermometer, DollarSign, Briefcase, 
  GraduationCap, TrendingUp, Star, ArrowLeft, X, Plus,
  BarChart3, Zap, Target
} from 'lucide-react';

// Componente para card de cidade no comparador
function CompareCard({ city, onRemove }: { city: City; onRemove: () => void }) {
  const defaultImage = '/images/cities/default-city.jpg';
  const cityImage = city.imagem || defaultImage;
  const overallRating = ((city.job_market_score || 0) + (city.education_score || 0) + (city.business_opportunity_score || 0)) / 3;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
      {/* Botão remover */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Imagem da cidade */}
      <div className="relative h-40">
        <Image
          src={cityImage}
          alt={city.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <h3 className="font-bold text-white text-lg">{city.name}</h3>
          <span className="text-sm text-gray-200 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {city.state}
          </span>
        </div>
      </div>

      {/* Dados da cidade */}
      <div className="p-4 space-y-4">
        {/* Rating geral */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Rating Geral</span>
          <div className="flex items-center">
            <Star className="text-yellow-500 w-4 h-4 mr-1" />
            <span className="font-bold">{overallRating > 0 ? overallRating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>

        {/* População */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">População</span>
          <span className="font-medium">
            {city.population ? city.population.toLocaleString('pt-BR') : 'N/A'}
          </span>
        </div>

        {/* Temperatura */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Temperatura Média</span>
          <span className="font-medium">
            {city.average_temperature ? `${city.average_temperature.celsius.toFixed(0)}°C` : 'N/A'}
          </span>
        </div>

        {/* Custo de vida */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Custo de Vida</span>
          <span className="font-medium">
            {city.cost_of_living_index ? `${Number(city.cost_of_living_index).toFixed(0)}/100` : 'N/A'}
          </span>
        </div>

        {/* Indicadores com barras */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Trabalho</span>
              <span className="text-xs font-medium">{city.job_market_score ? city.job_market_score.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${(city.job_market_score || 0) * 10}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Educação</span>
              <span className="text-xs font-medium">{city.education_score ? city.education_score.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${(city.education_score || 0) * 10}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Negócios</span>
              <span className="text-xs font-medium">{city.business_opportunity_score ? city.business_opportunity_score.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-500 rounded-full" 
                style={{ width: `${(city.business_opportunity_score || 0) * 10}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Link para detalhes */}
        <Link 
          href={`/destinos/${city.id}`}
          className="block w-full text-center bg-azul-petroleo text-white py-2 rounded-lg text-sm font-medium hover:bg-azul-petroleo/90 transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}

// Componente para adicionar nova cidade
function AddCityCard({ onSelect, availableCities }: { 
  onSelect: (city: City) => void; 
  availableCities: City[] 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = availableCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city: City) => {
    onSelect(city);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center p-8 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Plus className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-gray-600 font-medium">Adicionar Cidade</span>
          <span className="text-gray-400 text-sm">Compare até 4 cidades</span>
        </button>
      ) : (
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Selecionar Cidade</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Buscar cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-sm"
            autoFocus
          />
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredCities.map(city => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-sm text-gray-600">{city.state}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparadorPage() {
  const [allCities, setAllCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const cities = await getMainDestinyCities();
        setAllCities(cities);
        
        // Inicializar com 2 cidades populares
        if (cities.length >= 2) {
          setSelectedCities([cities[0], cities[1]]);
        }
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  const addCity = (city: City) => {
    if (selectedCities.length < 4 && !selectedCities.find(c => c.id === city.id)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const removeCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
  };

  const availableCities = allCities.filter(city => 
    !selectedCities.find(selected => selected.id === city.id)
  );

  const heroImages = [
    '/images/cities/5bfb3e1a-58d6-4a75-9da9-a482cbdcab6d.jpg', // Chicago
    '/images/cities/a8064db4-085c-45a3-9e58-4811fafbc7da.jpg', // Miami
    '/images/cities/009ad6d2-23f0-437e-8163-7370009e7d1b.jpg'  // Seattle
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-azul-petroleo"></div>
      </div>
    );
  }

  return (
    <TemplatePages
      title="Comparador de Cidades"
      subtitle="Compare até 4 cidades lado a lado e tome a melhor decisão para seu futuro"
      ctaText="Ver Todas as Cidades"
      ctaHref="/destinos"
      heroImages={heroImages}
    >
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

      {/* Instruções */}
      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <div className="flex items-start">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Como usar o comparador</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Compare até 4 cidades simultaneamente</li>
              <li>• Analise dados como população, custo de vida e oportunidades</li>
              <li>• Use as avaliações para tomar decisões informadas</li>
              <li>• Clique em "Ver Detalhes" para informações completas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grid de comparação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Cidades selecionadas */}
        {selectedCities.map(city => (
          <CompareCard
            key={city.id}
            city={city}
            onRemove={() => removeCity(city.id)}
          />
        ))}
        
        {/* Cards para adicionar mais cidades */}
        {selectedCities.length < 4 && Array.from({ length: 4 - selectedCities.length }).map((_, index) => (
          <AddCityCard
            key={`add-${index}`}
            onSelect={addCity}
            availableCities={availableCities}
          />
        ))}
      </div>

      {/* Análise comparativa */}
      {selectedCities.length >= 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Análise Comparativa</h3>
          
          {/* Melhor em cada categoria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Melhor mercado de trabalho */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="font-bold text-blue-900">Melhor Mercado de Trabalho</div>
              {(() => {
                const best = selectedCities.reduce((prev, current) => 
                  (current.job_market_score || 0) > (prev.job_market_score || 0) ? current : prev
                );
                return (
                  <div>
                    <div className="text-lg font-bold text-blue-700">{best.name}</div>
                    <div className="text-sm text-blue-600">Nota: {best.job_market_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                );
              })()}
            </div>

            {/* Melhor educação */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="font-bold text-green-900">Melhor Educação</div>
              {(() => {
                const best = selectedCities.reduce((prev, current) => 
                  (current.education_score || 0) > (prev.education_score || 0) ? current : prev
                );
                return (
                  <div>
                    <div className="text-lg font-bold text-green-700">{best.name}</div>
                    <div className="text-sm text-green-600">Nota: {best.education_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                );
              })()}
            </div>

            {/* Melhor custo-benefício */}
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="font-bold text-yellow-900">Menor Custo de Vida</div>
              {(() => {
                const best = selectedCities.reduce((prev, current) => 
                  (current.cost_of_living_index || 999) < (prev.cost_of_living_index || 999) ? current : prev
                );
                return (
                  <div>
                    <div className="text-lg font-bold text-yellow-700">{best.name}</div>
                    <div className="text-sm text-yellow-600">
                      Índice: {best.cost_of_living_index?.toFixed(0) || 'N/A'}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Recomendação personalizada */}
          <div className="bg-gradient-to-r from-azul-petroleo to-blue-600 rounded-xl p-6 text-white text-center">
            <Target className="w-8 h-8 mx-auto mb-3" />
            <h4 className="text-xl font-bold mb-3">Precisa de uma Recomendação Personalizada?</h4>
            <p className="mb-4 opacity-90">
              Use nosso Criador de Sonhos para descobrir qual cidade combina perfeitamente com seu perfil
            </p>
            <Link
              href="/ferramentas/criador-sonhos"
              className="inline-flex items-center bg-white text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Fazer Análise Personalizada
            </Link>
          </div>
        </div>
      )}

      {/* CTA para mais informações */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Precisa de Mais Informações?</h3>
        <p className="text-gray-600 mb-6">
          Nossos especialistas podem ajudar você a entender melhor cada destino e criar um plano personalizado
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/contato" 
            className="bg-azul-petroleo text-white px-6 py-3 rounded-lg font-semibold hover:bg-azul-petroleo/90 transition-colors"
          >
            Falar com Especialista
          </Link>
          <Link 
            href="/blog" 
            className="border-2 border-azul-petroleo text-azul-petroleo px-6 py-3 rounded-lg font-semibold hover:bg-azul-petroleo hover:text-white transition-colors"
          >
            Ler Guias no Blog
          </Link>
        </div>
      </div>
    </TemplatePages>
  );
}
