'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { City, getMainDestinyCities } from '../lib/cities-real';
import TemplatePages from '../components/TemplatePages';
import { Icons } from '../components/icons';

// Função auxiliar para renderizar indicador de comparação com média nacional
function NationalComparisonIndicator({ 
  value, 
  label, 
  type 
}: { 
  value: number | null; 
  label: string;
  type: 'cost' | 'score';
}) {
  if (!value || typeof value !== 'number') {
    return (
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs text-gray-400">N/A</span>
      </div>
    );
  }

  const percentage = Math.round((value - 1) * 100);
  const isAboveAverage = value > 1.0;
  const isNearAverage = Math.abs(value - 1.0) < 0.1;

  let statusText = '';
  let statusColor = '';
  let barColor = '';

  if (isNearAverage) {
    statusText = 'Na média';
    statusColor = 'text-gray-600';
    barColor = 'bg-gray-400';
  } else if (isAboveAverage) {
    statusText = type === 'cost' ? `${percentage}% mais caro` : `${percentage}% melhor`;
    statusColor = type === 'cost' ? 'text-red-600' : 'text-green-600';
    barColor = type === 'cost' ? 'bg-red-500' : 'bg-green-500';
  } else {
    statusText = type === 'cost' ? `${Math.abs(percentage)}% mais barato` : `${Math.abs(percentage)}% abaixo`;
    statusColor = type === 'cost' ? 'text-green-600' : 'text-red-600';
    barColor = type === 'cost' ? 'bg-green-500' : 'bg-red-500';
  }

  // Normalizar para visualização (0.5 a 1.5 = 0% a 100%)
  const displayWidth = Math.min(Math.max((value - 0.5) * 100, 0), 100);

  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="w-16 h-1.5 bg-gray-200 rounded-full">
          <div 
            className={`h-1.5 ${barColor} rounded-full transition-all`} 
            style={{ width: `${displayWidth}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
}

// Abreviação de números
function abbreviateNumber(value: number | null): string {
  if (!value || isNaN(value)) return 'N/A';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2).replace('.', ',') + 'Mi';
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace('.', ',') + 'K';
  return value.toString();
}

// City Card component 
function CityCard({ city, priority = false }: { city: City, priority?: boolean }) {
  // Usar chamada ao mapeamento de imagens
  const [imageError, setImageError] = useState(false);
  const [imageMap, setImageMap] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetch('/images/cities/image-mapping.json')
      .then((res) => res.json())
      .then((data) => setImageMap(data));
  }, []);

  let imageUrl = '';
  if (imageMap && imageMap[city.id]) {
    imageUrl = `/images/cities/${imageMap[city.id]}`;
  } else {
    imageUrl = `/images/cities/${city.id}.jpg`;
  }

  const handleImageError = () => {
    setImageError(true);
  };

  const finalImageUrl = imageError ? '/images/cities/default-city.jpg' : imageUrl;

  console.log(`🖼️ ${city.name} - URL da imagem: ${finalImageUrl}`);

  return (
    <Link href={`/destinos/${city.id}`}>
      <div className="bg-white rounded-2xl shadow-lg drop-shadow-md overflow-visible hover:shadow-xl hover:drop-shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" style={{ width: 250, marginTop: -16, marginBottom: -16 }}>
        <div className="relative h-48 rounded-t-2xl overflow-hidden">
          {/* Temperatura e ícone no canto superior esquerdo */}
          <div className="absolute top-2 left-2 z-10 flex items-center bg-white/80 rounded-full px-2 py-1 shadow">
            <Icons.temperature className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-xs text-gray-800 font-semibold">
              {city.average_temperature && typeof city.average_temperature === 'object' && typeof city.average_temperature.celsius === 'number' && !isNaN(city.average_temperature.celsius)
                ? `${city.average_temperature.celsius.toFixed(1)}°C / ${city.average_temperature.fahrenheit?.toFixed(1)}°F`
                : 'N/A'}
            </span>
          </div>
          <Image
            src={finalImageUrl}
            alt={`${city.name}, ${city.state}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            onError={handleImageError}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold drop-shadow">{city.name}</h3>
            <p className="text-sm opacity-90 drop-shadow">{city.state}</p>
          </div>
        </div>
        <div className="bg-white p-[25px] pt-4 pb-4 rounded-b-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Icons.population className="w-4 h-4 text-blue-400" />
              <span className="font-medium">População:</span>
              <span className="ml-1">{abbreviateNumber(city.population)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Icons.employability className="w-4 h-4 text-green-500" />
              <span className="font-medium">Empregabilidade:</span>
              <span className="ml-1">{city.job_market_score ? `${(city.job_market_score * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Icons.cost className="w-4 h-4 text-red-500" />
              <span className="font-medium">Custo de Vida:</span>
              <span className="ml-1">{city.cost_of_living_index ? `${(city.cost_of_living_index * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Icons.business className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Negócios:</span>
              <span className="ml-1">{city.business_opportunity_score ? `${(city.business_opportunity_score * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Icons.education className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Educação:</span>
              <span className="ml-1">{city.education_score ? `${(city.education_score * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
          </div>
          {city.description && (
            <p className="text-xs text-gray-600 mt-3 line-clamp-2">{city.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Legenda visual dos ícones
function CardLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-12 mb-8">
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.population className="w-4 h-4 text-blue-400" />População</div>
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.temperature className="w-4 h-4 text-blue-500" />Temperatura Média</div>
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.employability className="w-4 h-4 text-green-500" />Empregabilidade</div>
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.cost className="w-4 h-4 text-red-500" />Custo de Vida</div>
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.business className="w-4 h-4 text-yellow-500" />Negócios</div>
      <div className="flex items-center gap-2 text-gray-700 text-sm"><Icons.education className="w-4 h-4 text-purple-500" />Educação</div>
    </div>
  );
}

// Componente principal da página
export default function DestinosPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoading(true);
        const mainCities = await getMainDestinyCities();
        setCities(mainCities);
      } catch (err) {
        console.error('Erro ao carregar cidades:', err);
        setError('Erro ao carregar as cidades. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  const heroImages = [
    '/images/cities/a8064db4-085c-45a3-9e58-4811fafbc7da.jpg', // Miami
    '/images/cities/01f472cf-0f8c-4255-977a-c60a99bd580e.jpg', // New York
    '/images/cities/55faf34f-e5e5-444a-a0db-92fedba0ec2c.jpg', // San Francisco
    '/images/cities/5bfb3e1a-58d6-4a75-9da9-a482cbdcab6d.jpg'  // Chicago
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando destinos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <TemplatePages
      title="Destinos nos EUA"
      subtitle="Explore as melhores cidades americanas para viver, trabalhar e investir. Encontre seu destino ideal com base em dados reais."
      ctaText="Comparar Cidades"
      ctaHref="/destinos/comparador"
      heroImages={heroImages}
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Principais Destinos
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Descubra as cidades com melhor qualidade de vida, oportunidades de negócio 
            e mercado de trabalho dos Estados Unidos. Todos os índices são comparados 
            à média nacional americana.
          </p>
        </div>

        {cities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma cidade encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 justify-items-center">
            {cities.map((city, idx) => (
              <CityCard key={city.id} city={city} priority={idx < 4} />
            ))}
          </div>
        )}

        {cities.length > 0 && <CardLegend />}

        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto mt-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Como interpretar os índices
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>MÉDIA NACIONAL = 100%</strong></p>
              <p>🟢 Acima da média = Melhor que a média nacional</p>
              <p>🔴 Abaixo da média = Pior que a média nacional</p>
              <p>⚪ Na média = Próximo à média nacional</p>
            </div>
          </div>
        </div>
      </div>
    </TemplatePages>
  );
}
