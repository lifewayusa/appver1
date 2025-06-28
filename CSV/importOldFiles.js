require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Log para verificar URL e KEY
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);

// Função para limpar e adaptar campos do CSV de cidades
function cleanCityRow(obj) {
  const {
    description, // removido
    imagem, // renomeado
    ...rest
  } = obj;
  // Remove chaves com nome vazio
  const noEmpty = Object.fromEntries(Object.entries(rest).filter(([k]) => k && k.trim() !== ''));
  // Adiciona image_url se houver imagem
  if (imagem) noEmpty.image_url = imagem;
  // Sempre define country como 'USA'
  noEmpty.country = 'USA';
  // Permitir todos os campos do CSV, exceto description, e renomear imagem para image_url
  const allowed = [
    'id',
    'name',
    'state',
    'country',
    'population',
    'image_url',
    'average_temperature',
    'cost_of_living_index',
    'job_market_score',
    'education_score',
    'business_opportunity_score'
  ];
  return Object.fromEntries(Object.entries(noEmpty).filter(([k]) => allowed.includes(k)));
}

// Função utilitária para inserir e logar erros detalhados
async function insertWithLog(table, row) {
  const { error } = await supabase.from(table).insert([row]);
  if (error) {
    console.error(`Erro ao inserir em ${table}:`, error.message, '\nPayload:', row);
  } else {
    console.log(`Inserido em ${table}:`, row.name || row.id || JSON.stringify(row));
  }
}

// Importar cidades
//async function importarCities() {
 // const results = [];
 // let firstRowLogged = false;
 // fs.createReadStream('cities_rows.csv')
  //  .pipe(csv())
   // .on('headers', (headers) => {
  //    console.log('Cabeçalho do CSV de cidades:', headers);
  //  })
  //  .on('data', (data) => results.push(data))
  //  .on('end', async () => {
   //   for (const row of results) {
  //      const rowLimpo = cleanCityRow(row);
 //       if (!firstRowLogged) {
 //         console.log('Primeiro objeto enviado para insert em cities:', rowLimpo);
 //         firstRowLogged = true;
  //      }
 //       await insertWithLog('cities', rowLimpo);
 //     }
 //     console.log('Importação de cidades finalizada!');
 //   });
//}



// Importar universidades

// Importar cursos profissionais


// Importar cursos de inglês
async function importarCursosIngles() {
  const results = [];
  fs.createReadStream('english_courses_rows.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await insertWithLog('english_courses', row);
      }
      console.log('Importação de cursos de inglês finalizada!');
    });
}

// Executar as importações em sequência para facilitar debug
debugImport();

async function debugImport() {
  
  await new Promise((resolve) => importarCursosIngles().then(resolve));
  console.log('Todas as importações finalizadas!');
}

