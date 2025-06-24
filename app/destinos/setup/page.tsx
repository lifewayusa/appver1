'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

interface City {
  id: string;
  name: string;
  state: string;
  imagem: string | null;
  main_destiny: boolean;
}

export default function DestinosSetupPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, state, imagem, main_destiny')
        .eq('main_destiny', true)
        .order('name');

      if (error) throw error;
      setCities(data || []);
    } catch (err) {
      console.error('Erro ao carregar cidades:', err);
      setMessage('Erro ao carregar cidades');
    } finally {
      setLoading(false);
    }
  }

  async function updateCityImage(cityId: string, newImageUrl: string) {
    setSaving(cityId);
    try {
      const { error } = await supabase
        .from('cities')
        .update({ imagem: newImageUrl })
        .eq('id', cityId);

      if (error) throw error;
      
      setCities(cities.map(city => 
        city.id === cityId ? { ...city, imagem: newImageUrl } : city
      ));
      setMessage(`✅ Imagem de ${cities.find(c => c.id === cityId)?.name} atualizada!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err);
      setMessage('❌ Erro ao atualizar imagem');
    } finally {
      setSaving(null);
    }
  }

  async function fixAllImageUrls() {
    setSaving('all');
    setMessage('🔄 Corrigindo todas as URLs...');
    
    try {
      for (const city of cities) {
        const correctUrl = `/images/cities/${city.id}.jpg`;
        await supabase
          .from('cities')
          .update({ imagem: correctUrl })
          .eq('id', city.id);
      }
      
      await loadCities();
      setMessage('✅ Todas as URLs foram corrigidas!');
    } catch (err) {
      console.error('Erro ao corrigir URLs:', err);
      setMessage('❌ Erro ao corrigir URLs');
    } finally {
      setSaving(null);
    }
  }

  function getImageStatus(city: City) {
    const correctUrl = `/images/cities/${city.id}.jpg`;
    const hasCorrectUrl = city.imagem === correctUrl;
    
    return {
      hasCorrectUrl,
      correctUrl,
      currentUrl: city.imagem || 'Sem imagem'
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🛠️ Setup de Imagens - Destinos
          </h1>
          <p className="text-gray-600 mb-6">
            Gerencie as imagens das cidades principais. As imagens devem estar em 
            <code className="bg-gray-100 px-2 py-1 rounded mx-1">/public/images/cities/</code>
          </p>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={fixAllImageUrls}
              disabled={saving === 'all'}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving === 'all' ? '🔄 Corrigindo...' : '🔧 Corrigir Todas as URLs'}
            </button>
            <button
              onClick={loadCities}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              🔄 Recarregar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const status = getImageStatus(city);
            
            return (
              <div key={city.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={status.currentUrl}
                    alt={`${city.name}, ${city.state}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cities/default-city.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      status.hasCorrectUrl 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {status.hasCorrectUrl ? '✅ OK' : '❌ Corrigir'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {city.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{city.state}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">ID:</span>
                      <br />
                      <code className="bg-gray-100 px-1 rounded text-xs">{city.id}</code>
                    </div>
                    
                    <div>
                      <span className="font-medium">URL Atual:</span>
                      <br />
                      <code className={`px-1 rounded text-xs ${
                        status.hasCorrectUrl ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {status.currentUrl}
                      </code>
                    </div>

                    {!status.hasCorrectUrl && (
                      <div>
                        <span className="font-medium">URL Correta:</span>
                        <br />
                        <code className="bg-blue-100 px-1 rounded text-xs">
                          {status.correctUrl}
                        </code>
                      </div>
                    )}
                  </div>

                  {!status.hasCorrectUrl && (
                    <button
                      onClick={() => updateCityImage(city.id, status.correctUrl)}
                      disabled={saving === city.id}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {saving === city.id ? '🔄 Salvando...' : '🔧 Corrigir URL'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Relatório</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {cities.length}
              </div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {cities.filter(c => getImageStatus(c).hasCorrectUrl).length}
              </div>
              <div className="text-sm text-green-800">URLs Corretas</div>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <div className="text-2xl font-bold text-red-600">
                {cities.filter(c => !getImageStatus(c).hasCorrectUrl).length}
              </div>
              <div className="text-sm text-red-800">Precisam Correção</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-2xl font-bold text-gray-600">
                {Math.round((cities.filter(c => getImageStatus(c).hasCorrectUrl).length / cities.length) * 100)}%
              </div>
              <div className="text-sm text-gray-800">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
