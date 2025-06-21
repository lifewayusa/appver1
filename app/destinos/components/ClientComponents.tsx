'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomImage } from '../../lib/utils';
import { City, calculateCityRating, formatCostOfLiving, formatPopulation } from '../../lib/cities';
import { MapPin, DollarSign, Users, Briefcase, School, Star, Info, TrendingUp, Palmtree, Search } from 'lucide-react';
import Link from 'next/link';

// Hero Background component with hydration handling
export function HeroBackground({ seedId }: { seedId: string }) {
  const [heroImage, setHeroImage] = useState('/images/hero/home-hero-mobile.webp');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHeroImage(getRandomImage('hero', seedId));
  }, [seedId]);

  return (
    <div 
      className="relative h-[400px] flex flex-col justify-center items-center text-white mt-10"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-azul-petroleo opacity-95"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="font-baskerville text-3xl md:text-5xl mb-6 leading-tight">
          Descubra Seu Destino Ideal nos EUA
        </h1>
        <p className="text-lg md:text-xl font-figtree mb-8">
          Explore cidades americanas e encontre o local perfeito para sua nova vida
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="#cidades"
            className="bg-white text-azul-petroleo px-6 py-3 rounded-lg font-figtree font-semibold hover:bg-gray-100 transition-colors"
          >
            Explorar Cidades
          </Link>
        </div>
      </div>
    </div>
  );
}

// City Card component with hydration handling
export function CityCard({ city }: { city: City }) {
  const [cityImage, setCityImage] = useState<string>(city.image || '/images/cities/default-city.jpg');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!city.image) {
      setCityImage(getRandomImage('cities', `city-${city.id}`));
    }
  }, [city.id, city.image]);

  // Renderizar card elegante para cada cidade
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-56">
        <Image
          src={cityImage}
          alt={city.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1.5 flex items-center">
          <Star className="text-yellow-500 w-4 h-4 mr-1.5" />
          <span className="text-sm font-semibold">{calculateCityRating(city).toFixed(1)}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="font-baskerville text-2xl text-white mb-1">{city.name}</h3>
          <span className="text-sm text-gray-200 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {city.state}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-azul-petroleo" />
            <span>{formatPopulation(city.population)}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-azul-petroleo" />
            <span>{formatCostOfLiving(city.costOfLiving)}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-azul-petroleo" />
            <span className="text-xs">Emprego: {city.job_market_score?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <School className="w-4 h-4 mr-2 text-azul-petroleo" />
            <span className="text-xs">Educação: {city.education_score?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-azul-petroleo" />
            Sobre {city.name}
          </h4>
          <p className="text-gray-600 text-sm line-clamp-3 font-figtree">
            {city.description || `${city.name} é uma excelente cidade para brasileiros que desejam morar nos EUA.`}
          </p>
        </div>
        
        {city.text_attractions && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1 flex items-center">
              <Palmtree className="w-4 h-4 mr-1.5 text-azul-petroleo" />
              Atrações
            </h4>
            <p className="text-gray-600 text-xs line-clamp-2">
              {city.text_attractions}
            </p>
          </div>
        )}

        <button className="w-full bg-azul-petroleo text-white py-2 rounded-lg font-figtree font-semibold hover:bg-opacity-90 transition-colors mt-2">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}

// Search component
export function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar cidade..."
        className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-petroleo font-figtree"
      />
      <div className="absolute right-3 top-2.5 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
    </div>
  );
}
