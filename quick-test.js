require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Teste simples e rápido
async function quickTest() {
    console.log('🔍 Teste rápido Supabase...');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
    
    try {
        const { count, error } = await supabase
            .from('multistep_forms')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            console.error('❌ Erro:', error.message);
        } else {
            console.log('✅ Conexão OK');
        }
    } catch (e) {
        console.error('❌ Exceção:', e.message);
    }
}

quickTest();
