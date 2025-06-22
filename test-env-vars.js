// Teste das variáveis de ambiente
console.log('=== TESTE DE VARIÁVEIS DE AMBIENTE ===');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINIDA' : 'UNDEFINED');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'DEFINIDA' : 'UNDEFINED');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'UNDEFINED');

console.log('\n=== VALORES (PRIMEIROS 20 CHARS) ===');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
console.log('SERVICE_ROLE:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) + '...');
console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) + '...');

// Simular a lógica da API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n=== VALORES USADOS PELA API ===');
console.log('URL usada:', supabaseUrl?.substring(0, 30) + '...');
console.log('KEY usada:', supabaseKey?.substring(0, 30) + '...');
console.log('Usando SERVICE_ROLE?', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
