'use client';

import { useState, useEffect } from 'react';
import { City, getMainDestinyCities, getCityImageUrl } from '../lib/cities-real';

// Componente de teste simples com img HTML
function SimpleImageTest() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const mainCities = await getMainDestinyCities();
        setCities(mainCities.slice(0, 5)); // Apenas 5 para teste
      } catch (err) {
        console.error('Erro ao carregar cidades:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, []);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Teste de Imagens</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => {
          const imageUrl = getCityImageUrl(city);
          
          return (
            <div key={city.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-bold">{city.name}, {city.state}</h3>
                <p className="text-sm text-gray-600">ID: {city.id}</p>
                <p className="text-sm text-blue-600">Campo imagem: {city.imagem || 'NULL'}</p>
                <p className="text-sm text-green-600">URL calculada: {imageUrl}</p>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold mb-2">🖼️ Next.js Image:</h4>
                <div className="relative h-48 mb-4 border border-gray-200">
                  <img
                    src={imageUrl}
                    alt={city.name}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`✅ Carregou: ${city.name} - ${imageUrl}`)}
                    onError={() => console.log(`❌ Erro: ${city.name} - ${imageUrl}`)}
                  />
                </div>
                
                <h4 className="font-semibold mb-2">🔗 Link direto:</h4>
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Abrir imagem em nova aba
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">🔍 Debug Info:</h3>
        <p>Total de cidades carregadas: {cities.length}</p>
        <p>Verifique o console do navegador para logs de carregamento</p>
      </div>
    </div>
  );
}

export default SimpleImageTest;
