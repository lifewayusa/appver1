'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { City } from '../lib/cities-real';
import { getMainDestinyCities } from '../lib/cities-real';
import TemplatePages from '../components/TemplatePages';

// Versão de teste com tag img normal
function TestCityCard({ city }: { city: City }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = city.imagem || `/images/cities/default-city.jpg`;

  console.log(`🏙️ ${city.name}: URL = ${imageUrl}`);

  return (
    <Link href={`/destinos/${city.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={`${city.name}, ${city.state}`}
            className="w-full h-full object-cover"
            onLoad={() => {
              setImageLoaded(true);
              console.log(`✅ ${city.name}: Imagem carregada com sucesso`);
            }}
            onError={() => {
              setImageError(true);
              console.log(`❌ ${city.name}: Erro ao carregar imagem - ${imageUrl}`);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold">{city.name}</h3>
            <p className="text-sm opacity-90">{city.state}</p>
          </div>
          
          {/* Status indicator */}
          <div className="absolute top-2 right-2">
            {imageError && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                ❌ Erro
              </span>
            )}
            {imageLoaded && !imageError && (
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                ✅ OK
              </span>
            )}
            {!imageLoaded && !imageError && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                🔄 Carregando
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">População:</span>
              <span className="ml-1">
                {city.population ? city.population.toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <div>URL: {imageUrl}</div>
            <div>Status: {imageError ? 'Erro' : imageLoaded ? 'Carregada' : 'Carregando'}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DestinosTestPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const mainCities = await getMainDestinyCities();
        console.log('🔍 Cidades carregadas:', mainCities.length);
        setCities(mainCities.slice(0, 6)); // Apenas 6 para teste
      } catch (err) {
        console.error('Erro ao carregar cidades:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

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

  return (
    <TemplatePages
      title="🧪 Teste de Imagens - Destinos"
      subtitle="Página de teste para verificar o carregamento das imagens das cidades"
      ctaText="Voltar para Destinos"
      ctaHref="/destinos"
      heroImages={['/images/cities/chicago.jpg']}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">🔍 Teste de Carregamento</h2>
          <p className="text-gray-600">
            Abra o console do navegador (F12) para ver os logs de carregamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <TestCityCard key={city.id} city={city} />
          ))}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📋 Instruções de Teste:</h3>
          <ul className="text-sm space-y-1">
            <li>• Abra o console do navegador (F12 → Console)</li>
            <li>• Observe os logs de carregamento de cada imagem</li>
            <li>• Verifique os indicadores visuais nos cards (✅❌🔄)</li>
            <li>• Note as URLs que estão sendo usadas</li>
          </ul>
        </div>
      </div>
    </TemplatePages>
  );
}
