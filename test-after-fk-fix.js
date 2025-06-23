require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testAfterFKFix() {
    console.log('🧪 Teste após correção da Foreign Key Constraint\n');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_KEY
    );
    
    console.log('📝 Testando cenários do mundo real...\n');
    
    // Teste 1: Usuário não autenticado (user_id personalizado)
    try {
        console.log('1️⃣ Teste: Usuário não autenticado com ID personalizado');
        const { data: test1, error: error1 } = await supabase
            .from('multistep_forms')
            .insert({
                user_id: `guest-${Date.now()}`,
                data: {
                    name: 'João Silva',
                    age: 28,
                    freeFormAspirations: 'Quero trabalhar no exterior como desenvolvedor'
                },
                is_completed: false
            })
            .select();
            
        if (error1) {
            console.error('❌ Falhou:', error1.message);
        } else {
            console.log('✅ Sucesso! ID:', test1[0].id);
            // Limpar
            await supabase.from('multistep_forms').delete().eq('id', test1[0].id);
        }
    } catch (e) {
        console.error('❌ Exceção:', e.message);
    }
    
    // Teste 2: Usuário não autenticado (user_id NULL)
    try {
        console.log('\n2️⃣ Teste: Usuário não autenticado com user_id NULL');
        const { data: test2, error: error2 } = await supabase
            .from('multistep_forms')
            .insert({
                user_id: null,
                data: {
                    name: 'Maria Santos',
                    age: 32,
                    freeFormAspirations: 'Sonho em empreender na área de tecnologia'
                },
                is_completed: false
            })
            .select();
            
        if (error2) {
            console.error('❌ Falhou:', error2.message);
        } else {
            console.log('✅ Sucesso! ID:', test2[0].id);
            // Limpar
            await supabase.from('multistep_forms').delete().eq('id', test2[0].id);
        }
    } catch (e) {
        console.error('❌ Exceção:', e.message);
    }
    
    // Teste 3: Simulação do fluxo real da aplicação
    try {
        console.log('\n3️⃣ Teste: Simulação do fluxo real da aplicação');
        const formData = {
            name: 'Carlos Oliveira',
            age: 25,
            email: 'carlos@email.com',
            phone: '+5511999999999',
            education: 'Ensino Superior',
            budget: '$5,000 - $10,000',
            timeline: '6-12 meses',
            objectives: ['conseguir-trabalho-exterior'],
            freeFormAspirations: 'Meu maior sonho é trabalhar como engenheiro de software em uma empresa inovadora no Canadá.'
        };
        
        const { data: test3, error: error3 } = await supabase
            .from('multistep_forms')
            .insert({
                user_id: `session-${Date.now()}`,
                data: formData,
                is_completed: true
            })
            .select();
            
        if (error3) {
            console.error('❌ Falhou:', error3.message);
        } else {
            console.log('✅ Sucesso! Fluxo completo funcionando');
            console.log('   - Aspirações salvas:', test3[0].data.freeFormAspirations?.substring(0, 50) + '...');
            // Limpar
            await supabase.from('multistep_forms').delete().eq('id', test3[0].id);
        }
    } catch (e) {
        console.error('❌ Exceção:', e.message);
    }
    
    console.log('\n🎯 Resultado: Se todos os testes passaram, o erro 500 foi resolvido!');
}

testAfterFKFix();
