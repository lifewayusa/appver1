require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkTableStructure() {
    console.log('🔍 Verificando estrutura da tabela multistep_forms...\n');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
    
    try {
        // Tentar inserção com UUIDs válidos
        const { v4: uuidv4 } = require('uuid');
        
        const testData = {
            user_id: uuidv4(), // UUID válido
            data: {
                name: 'Teste Estrutura',
                age: 30,
                freeFormAspirations: 'Verificar estrutura da tabela'
            },
            is_completed: false
        };
        
        console.log('📝 Testando inserção com UUID válido...');
        const { data, error } = await supabase
            .from('multistep_forms')
            .insert(testData)
            .select();
            
        if (error) {
            console.error('❌ Erro:', error.code, '-', error.message);
            if (error.details) console.error('Detalhes:', error.details);
            if (error.hint) console.error('Hint:', error.hint);
        } else {
            console.log('✅ Inserção bem-sucedida!');
            console.log('Dados:', data[0]);
            
            // Limpar
            await supabase.from('multistep_forms').delete().eq('id', data[0].id);
            console.log('🧹 Teste limpo');
        }
    } catch (err) {
        console.error('❌ Erro inesperado:', err.message);
    }
}

checkTableStructure();
