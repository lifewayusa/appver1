import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createApiLogger } from '../../../lib/ApiLogger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  let contextLogger: any;
  let body: any;

  try {
    body = await request.json()
    const { user_email, form_data, is_completed, qualify } = body

    // Initialize logger
    contextLogger = createApiLogger(
      'multistep-form', 
      '/api/form/save', 
      'POST', 
      request,
      user_email
    );

    await contextLogger.logRequest(body);
    await contextLogger.logStep('data_received', 'success', {
      user_data: { user_email, is_completed, qualify },
      metadata: { form_data_keys: Object.keys(form_data || {}) }
    });

    if (!user_email || !form_data) {
      return NextResponse.json(
        { success: false, error: 'Email do usuário e dados do formulário são obrigatórios' },
        { status: 400 }
      )
    }

    // Por enquanto, vou usar um UUID fixo baseado no email como user_id
    // Em produção, isso deve ser substituído por autenticação real
    const crypto = require('crypto')
    const userId = crypto.createHash('md5').update(user_email).digest('hex')

    // Verificar se já existe um registro do formulário para este userId
    const { data: existingForm, error: formCheckError } = await supabase
      .from('multistep_forms')
      .select('id')
      .eq('user_id', userId)
      .single()

    let result
    const formPayload = {
      user_id: userId,
      data: form_data,
      is_completed: is_completed || false,
      qualify: qualify || null,
      updated_at: new Date().toISOString()
    }

    if (existingForm && !formCheckError) {
      // Atualizar registro existente
      const { data, error } = await supabase
        .from('multistep_forms')
        .update(formPayload)
        .eq('id', existingForm.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Criar novo registro
      const insertPayload = {
        ...formPayload,
        id: crypto.randomUUID()
      }
      const { data, error } = await supabase
        .from('multistep_forms')
        .insert([insertPayload])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Erro ao salvar formulário:', result.error)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar dados do formulário', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Dados do formulário salvos com sucesso'
    })

  } catch (error) {
    console.error('Erro interno ao salvar formulário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('user_email')

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'Email do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Gerar o mesmo userId baseado no email
    const crypto = require('crypto')
    const userId = crypto.createHash('md5').update(userEmail).digest('hex')

    // Buscar dados do formulário por userId
    const { data: formData, error: formError } = await supabase
      .from('multistep_forms')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (formError && formError.code === 'PGRST116') {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Nenhum formulário encontrado para este usuário'
      })
    }

    if (formError) {
      console.error('Erro ao buscar formulário:', formError)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar dados do formulário', details: formError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Dados do formulário recuperados com sucesso'
    })

  } catch (error) {
    console.error('Erro interno ao buscar formulário:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
