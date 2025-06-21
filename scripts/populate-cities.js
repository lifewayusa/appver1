// Script to populate cities table with sample data
import { supabase } from './lib/supabase';

const sampleCities = [
  {
    name: 'Miami',
    state: 'Florida',
    country: 'United States',
    population: 467963,
    imagem: '/images/cities/miami.jpg',
    cost_of_living_index: 105.5,
    job_market_score: 8.5,
    education_score: 7.8,
    business_opportunity_score: 9.2,
    description: 'Miami é uma cidade vibrante na Flórida, conhecida por suas praias, vida noturna e diversidade cultural. É um importante centro financeiro e de negócios internacionais.',
    latitude: '25.7617',
    longitude: '-80.1918',
    main_destiny: true,
    text_education: 'Miami oferece excelentes universidades como a University of Miami e Florida International University.',
    text_attractions: 'South Beach, Art Deco District, Wynwood Walls, Little Havana.',
    text_neighborhood: 'Brickell, Coral Gables, Coconut Grove, South Beach.'
  },
  {
    name: 'Austin',
    state: 'Texas',
    country: 'United States',
    population: 964254,
    imagem: '/images/cities/austin.jpg',
    cost_of_living_index: 98.2,
    job_market_score: 9.1,
    education_score: 8.7,
    business_opportunity_score: 9.5,
    description: 'Austin é a capital do Texas e um importante hub de tecnologia. Conhecida por sua cultura musical, universidades de prestígio e ambiente empreendedor.',
    latitude: '30.2672',
    longitude: '-97.7431',
    main_destiny: true,
    text_education: 'University of Texas at Austin é uma das principais universidades públicas dos EUA.',
    text_attractions: 'South by Southwest (SXSW), Lady Bird Lake, Zilker Park, 6th Street.',
    text_neighborhood: 'Downtown, South Austin, East Austin, Westlake.'
  },
  {
    name: 'Atlanta',
    state: 'Georgia',
    country: 'United States',
    population: 498715,
    imagem: '/images/cities/atlanta.jpg',
    cost_of_living_index: 89.3,
    job_market_score: 8.2,
    education_score: 8.5,
    business_opportunity_score: 8.8,
    description: 'Atlanta é um importante centro de negócios do sudeste americano, sede de grandes corporações e com excelente infraestrutura de transporte.',
    latitude: '33.7490',
    longitude: '-84.3880',
    main_destiny: true,
    text_education: 'Georgia Tech, Emory University, Georgia State University.',
    text_attractions: 'Georgia Aquarium, World of Coca-Cola, Atlanta Botanical Garden.',
    text_neighborhood: 'Midtown, Buckhead, Virginia-Highland, Inman Park.'
  },
  {
    name: 'Boston',
    state: 'Massachusetts',
    country: 'United States',
    population: 685094,
    imagem: '/images/cities/boston.jpg',
    cost_of_living_index: 118.7,
    job_market_score: 9.3,
    education_score: 9.8,
    business_opportunity_score: 9.0,
    description: 'Boston é considerada a capital da educação americana, com universidades mundialmente reconhecidas como Harvard e MIT.',
    latitude: '42.3601',
    longitude: '-71.0589',
    main_destiny: true,
    text_education: 'Harvard University, MIT, Boston University, Northeastern University.',
    text_attractions: 'Freedom Trail, Harvard Square, Fenway Park, USS Constitution.',
    text_neighborhood: 'Back Bay, Beacon Hill, Cambridge, Somerville.'
  },
  {
    name: 'Chicago',
    state: 'Illinois',
    country: 'United States',
    population: 2746388,
    imagem: '/images/cities/chicago.jpg',
    cost_of_living_index: 95.1,
    job_market_score: 8.7,
    education_score: 8.3,
    business_opportunity_score: 8.9,
    description: 'Chicago é a terceira maior cidade dos EUA, um importante centro financeiro e industrial com arquitetura icônica.',
    latitude: '41.8781',
    longitude: '-87.6298',
    main_destiny: true,
    text_education: 'University of Chicago, Northwestern University, DePaul University.',
    text_attractions: 'Millennium Park, Navy Pier, Art Institute of Chicago, Willis Tower.',
    text_neighborhood: 'The Loop, Lincoln Park, Wicker Park, River North.'
  },
  {
    name: 'Denver',
    state: 'Colorado',
    country: 'United States',
    population: 715522,
    imagem: '/images/cities/denver.jpg',
    cost_of_living_index: 102.8,
    job_market_score: 8.4,
    education_score: 7.9,
    business_opportunity_score: 8.6,
    description: 'Denver oferece qualidade de vida excepcional com proximidade às Montanhas Rochosas e uma economia em crescimento.',
    latitude: '39.7392',
    longitude: '-104.9903',
    main_destiny: false,
    text_education: 'University of Colorado Denver, Denver University, Colorado State University.',
    text_attractions: 'Red Rocks Amphitheatre, Denver Art Museum, 16th Street Mall.',
    text_neighborhood: 'LoDo, Capitol Hill, Highlands, Cherry Creek.'
  }
];

async function populateCities() {
  try {
    console.log('Starting to populate cities...');
    
    for (const city of sampleCities) {
      const { data, error } = await supabase
        .from('cities')
        .insert(city)
        .select();
      
      if (error) {
        console.error(`Error inserting ${city.name}:`, error);
      } else {
        console.log(`✅ Successfully inserted ${city.name}`);
      }
    }
    
    console.log('Finished populating cities!');
  } catch (error) {
    console.error('Error in populateCities:', error);
  }
}

// Run the script
populateCities();
