-- Populate cities table with sample data for testing

INSERT INTO public.cities (
  name, state, country, population, imagem, cost_of_living_index, 
  job_market_score, education_score, business_opportunity_score, 
  description, latitude, longitude, main_destiny, text_education, 
  text_attractions, text_neighborhood
) VALUES 
(
  'Miami', 'Florida', 'United States', 467963, '/images/cities/miami.jpg',
  105.5, 8.5, 7.8, 9.2,
  'Miami é uma cidade vibrante na Flórida, conhecida por suas praias, vida noturna e diversidade cultural. É um importante centro financeiro e de negócios internacionais.',
  '25.7617', '-80.1918', true,
  'Miami oferece excelentes universidades como a University of Miami e Florida International University.',
  'South Beach, Art Deco District, Wynwood Walls, Little Havana.',
  'Brickell, Coral Gables, Coconut Grove, South Beach.'
),
(
  'Austin', 'Texas', 'United States', 964254, '/images/cities/austin.jpg',
  98.2, 9.1, 8.7, 9.5,
  'Austin é a capital do Texas e um importante hub de tecnologia. Conhecida por sua cultura musical, universidades de prestígio e ambiente empreendedor.',
  '30.2672', '-97.7431', true,
  'University of Texas at Austin é uma das principais universidades públicas dos EUA.',
  'South by Southwest (SXSW), Lady Bird Lake, Zilker Park, 6th Street.',
  'Downtown, South Austin, East Austin, Westlake.'
),
(
  'Atlanta', 'Georgia', 'United States', 498715, '/images/cities/atlanta.jpg',
  89.3, 8.2, 8.5, 8.8,
  'Atlanta é um importante centro de negócios do sudeste americano, sede de grandes corporações e com excelente infraestrutura de transporte.',
  '33.7490', '-84.3880', true,
  'Georgia Tech, Emory University, Georgia State University.',
  'Georgia Aquarium, World of Coca-Cola, Atlanta Botanical Garden.',
  'Midtown, Buckhead, Virginia-Highland, Inman Park.'
),
(
  'Boston', 'Massachusetts', 'United States', 685094, '/images/cities/boston.jpg',
  118.7, 9.3, 9.8, 9.0,
  'Boston é considerada a capital da educação americana, com universidades mundialmente reconhecidas como Harvard e MIT.',
  '42.3601', '-71.0589', true,
  'Harvard University, MIT, Boston University, Northeastern University.',
  'Freedom Trail, Harvard Square, Fenway Park, USS Constitution.',
  'Back Bay, Beacon Hill, Cambridge, Somerville.'
),
(
  'Chicago', 'Illinois', 'United States', 2746388, '/images/cities/chicago.jpg',
  95.1, 8.7, 8.3, 8.9,
  'Chicago é a terceira maior cidade dos EUA, um importante centro financeiro e industrial com arquitetura icônica.',
  '41.8781', '-87.6298', true,
  'University of Chicago, Northwestern University, DePaul University.',
  'Millennium Park, Navy Pier, Art Institute of Chicago, Willis Tower.',
  'The Loop, Lincoln Park, Wicker Park, River North.'
),
(
  'Denver', 'Colorado', 'United States', 715522, '/images/cities/denver.jpg',
  102.8, 8.4, 7.9, 8.6,
  'Denver oferece qualidade de vida excepcional com proximidade às Montanhas Rochosas e uma economia em crescimento.',
  '39.7392', '-104.9903', false,
  'University of Colorado Denver, Denver University, Colorado State University.',
  'Red Rocks Amphitheatre, Denver Art Museum, 16th Street Mall.',
  'LoDo, Capitol Hill, Highlands, Cherry Creek.'
),
(
  'Las Vegas', 'Nevada', 'United States', 651319, '/images/cities/las_vegas.jpg',
  96.8, 7.5, 6.8, 8.3,
  'Las Vegas é mundialmente conhecida pelo entretenimento, mas também oferece oportunidades de negócios e crescimento econômico.',
  '36.1699', '-115.1398', false,
  'University of Nevada Las Vegas (UNLV), Nevada State College.',
  'The Strip, Bellagio Fountains, Red Rock Canyon, Fremont Street.',
  'Summerlin, Henderson, Downtown Las Vegas.'
),
(
  'Seattle', 'Washington', 'United States', 753675, '/images/cities/seattle.jpg',
  112.3, 9.0, 8.4, 9.1,
  'Seattle é um centro de tecnologia e inovação, sede de grandes empresas como Amazon e Microsoft.',
  '47.6062', '-122.3321', true,
  'University of Washington, Seattle University, Seattle Pacific University.',
  'Space Needle, Pike Place Market, Mount Rainier, Puget Sound.',
  'Capitol Hill, Fremont, Belltown, Queen Anne.'
);
