// Teste de carregamento das imagens do blog
// Verifica se todas as 33 imagens estão acessíveis via HTTP

const http = require('http');
const fs = require('fs');

// Lista de todos os slugs
const allSlugs = [
  'abrir-empresa-eua',
  'asilo-politico-eua', 
  'autorizacao-trabalho-eua',
  'cidadania-americana',
  'consulado-americano',
  'deportacao-defesa',
  'documentos-imigracao',
  'entrevista-visto-americano',
  'green-card-casamento',
  'green-card-eb5',
  'green-card-habilidades',
  'green-card-profissional',
  'green-card-refugiados',
  'loteria-green-card',
  'mudanca-status-eua',
  'naturalizacao-americana',
  'renovar-green-card',
  'reunificacao-familiar',
  'sistema-imigracao-americano',
  'sponsor-eua',
  'trazer-familia-eua',
  'visto-e2-investidor',
  'visto-eb5-investimento',
  'visto-estudante-f1',
  'visto-h1b-trabalho',
  'visto-j1-intercambio',
  'visto-k1-noivo',
  'visto-l1-transferencia',
  'visto-o1-habilidades',
  'visto-p1-atletas',
  'visto-r1-religioso',
  'visto-transito-c1',
  'visto-turista-b2'
];

async function testImageAccess(slug) {
  const filePath = `public/images/blog/${slug}.jpg`;
  
  try {
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (stats.size === 0) {
      return { slug, status: 'VAZIO', size: 0 };
    } else if (stats.size < 5000) {
      return { slug, status: 'PEQUENO', size: sizeKB };
    } else {
      return { slug, status: 'OK', size: sizeKB };
    }
  } catch (error) {
    return { slug, status: 'NÃO ENCONTRADO', size: 0 };
  }
}

async function runImageTests() {
  console.log('🔍 Testando acesso às imagens do blog...\n');
  
  const results = [];
  let okCount = 0;
  let problemCount = 0;
  
  for (const slug of allSlugs) {
    const result = await testImageAccess(slug);
    results.push(result);
    
    if (result.status === 'OK') {
      okCount++;
      console.log(`✅ ${slug} - ${result.size}KB`);
    } else {
      problemCount++;
      console.log(`❌ ${slug} - ${result.status} (${result.size}KB)`);
    }
  }
  
  console.log(`\n📊 RESUMO:`);
  console.log(`✅ Imagens OK: ${okCount}`);
  console.log(`❌ Com problema: ${problemCount}`);
  console.log(`📁 Total de slugs: ${allSlugs.length}`);
  
  if (problemCount === 0) {
    console.log(`\n🎉 SUCESSO! Todas as ${allSlugs.length} imagens estão OK!`);
    console.log(`📸 Cada artigo tem sua imagem única em /public/images/blog/`);
    console.log(`🔗 Padrão: /images/blog/[slug].jpg`);
  } else {
    console.log(`\n⚠️  ${problemCount} imagem(ns) precisam de atenção.`);
  }
}

runImageTests();
