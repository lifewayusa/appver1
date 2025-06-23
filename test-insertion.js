require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testInsertion() {
    console.log('🧪 Testando inserção de formulário...\n');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
    
    const testData = {
        user_id: `user-${Date.now()}`, 
        data: {
            name: 'Teste FK Fix',
            age: 28,
            freeFormAspirations: 'Verificar se FK foi corrigida'
        },
        is_completed: false,
        qualify: null,
        updated_at: new Date().toISOString()
    };
    
    try {
        console.log('📝 Tentando inserir dados...');
        const { data, error } = await supabase
            .from('multistep_forms')
            .insert(testData)
            .select();
            
        if (error) {
            console.error('❌ ERRO 500 ainda presente:');
            console.error('Código:', error.code);
            console.error('Mensagem:', error.message);
            console.error('Detalhes:', error.details);
            console.error('Hint:', error.hint);
            console.log('\n🔧 É necessário executar o script SQL para remover FK constraint');
        } else {
            console.log('✅ Inserção bem-sucedida!');
            console.log('ID inserido:', data[0].id);
            
            // Limpar
            await supabase.from('multistep_forms').delete().eq('id', testData.id);
            console.log('🧹 Dados de teste removidos');
        }
    } catch (err) {
        console.error('❌ Erro inesperado:', err.message);
    }
}

testInsertion();
