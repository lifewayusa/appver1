#!/usr/bin/env node

// Teste rápido de conexão e inserção no Supabase após correção de FK
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
    console.log('🧪 Testando conexão Supabase após correção FK...\n');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Variáveis de ambiente não encontradas');
        return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        // 1. Teste de conexão básica
        console.log('1️⃣ Testando conexão básica...');
        const { data, error } = await supabase
            .from('multistep_forms')
            .select('count', { count: 'exact', head: true });
            
        if (error) {
            console.error('❌ Erro na conexão:', error);
            return;
        }
        console.log('✅ Conexão OK');
        
        // 2. Teste de inserção (o que estava falhando com erro 500)
        console.log('\n2️⃣ Testando inserção de formulário...');
        const testData = {
            id: `test-${Date.now()}`,
            user_id: `test-user-${Date.now()}`,
            data: {
                name: 'Teste Correção FK',
                age: 25,
                freeFormAspirations: 'Teste após correção da foreign key'
            },
            is_completed: false,
            qualify: null,
            updated_at: new Date().toISOString()
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('multistep_forms')
            .insert(testData)
            .select();
            
        if (insertError) {
            console.error('❌ Erro na inserção:', insertError);
            console.error('Código:', insertError.code);
            console.error('Detalhes:', insertError.details);
            console.error('Hint:', insertError.hint);
            return;
        }
        
        console.log('✅ Inserção bem-sucedida!');
        console.log('Dados inseridos:', insertData);
        
        // 3. Limpar teste
        console.log('\n3️⃣ Limpando dados de teste...');
        await supabase
            .from('multistep_forms')
            .delete()
            .eq('id', testData.id);
            
        console.log('✅ Limpeza concluída');
        console.log('\n🎉 Todos os testes passaram! O erro 500 foi corrigido.');
        
    } catch (error) {
        console.error('❌ Erro inesperado:', error);
    }
}

testSupabaseConnection();
