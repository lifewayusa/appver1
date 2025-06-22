import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oaxkqqamnppkeavunlgo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heGtxcWFtbnBwa2VhdnVubGdvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2OTQ0MCwiZXhwIjoyMDY1OTQ1NDQwfQ.wcL5r6CIh5Kt1wMmOG6w1FZUv4LKf_EgKlpLfOjh_9g'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    try {
        console.log('Testando conexão com Supabase...')
        
        // Verificar estrutura da tabela
        const { data, error } = await supabase
            .from('multistep_forms')
            .select('*')
            .limit(1)
        
        if (error) {
            console.error('Erro na query:', error.message)
        } else {
            console.log('Conexão OK! Registros encontrados:', data.length)
            if (data.length > 0) {
                console.log('Estrutura do primeiro registro:', Object.keys(data[0]))
                console.log('Dados:', data[0])
            }
        }
        
        // Testar inserção com estrutura correta
        const crypto = await import('crypto')
        const userId = crypto.createHash('md5').update('test@example.com').digest('hex')
        
        const testData = {
            id: crypto.randomUUID(),
            user_id: userId,
            data: { 
                test: true, 
                freeFormAspirations: 'Teste do campo de aspirações livres' 
            },
            is_completed: false,
            qualify: null,
            updated_at: new Date().toISOString()
        }
        
        console.log('\nTestando inserção...')
        const { data: insertData, error: insertError } = await supabase
            .from('multistep_forms')
            .insert(testData)
            .select()
        
        if (insertError) {
            console.error('Erro ao inserir:', insertError.message)
            console.log('Detalhes:', insertError)
        } else {
            console.log('Inserção OK:', insertData)
            
            // Verificar se o campo freeFormAspirations foi salvo
            if (insertData && insertData[0] && insertData[0].data) {
                console.log('Campo freeFormAspirations salvo:', insertData[0].data.freeFormAspirations)
            }
        }
        
    } catch (err) {
        console.error('Erro geral:', err.message)
    }
}

testConnection()
