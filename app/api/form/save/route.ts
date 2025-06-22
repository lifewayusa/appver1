import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '../../../../lib/conectAPI';
import { createApiLogger } from '../../../lib/ApiLogger';

const supabase = createSupabaseClient();

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
      await contextLogger.logStep('validation_failed', 'error', {
        error_message: 'Email do usuário e dados do formulário são obrigatórios'
      });
      return NextResponse.json(
        { success: false, error: 'Email do usuário e dados do formulário são obrigatórios' },
        { status: 400 }
      )
    }

    // Por enquanto, vou usar um UUID fixo baseado no email como user_id
    // Em produção, isso deve ser substituído por autenticação real
    const crypto = require('crypto')
    const userId = crypto.createHash('md5').update(user_email).digest('hex')

    await contextLogger.logStep('database_operation_started', 'in_progress', {
      user_id: userId
    });

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
      await contextLogger.logStep('database_update', result.error ? 'error' : 'success', {
        form_id: existingForm.id,
        error_message: result.error?.message
      });
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
      await contextLogger.logStep('database_insert', result.error ? 'error' : 'success', {
        form_id: insertPayload.id,
        error_message: result.error?.message
      });
    }

    if (result.error) {
      console.error('Erro ao salvar formulário:', result.error)
      await contextLogger.logStep('database_error', 'error', {
        error_message: result.error.message,
        error_details: result.error
      });
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar dados do formulário', details: result.error },
        { status: 500 }
      )
    }

    await contextLogger.logStep('database_success', 'success', {
      saved_data: result.data
    });

    // Se o formulário foi completado, gerar análise personalizada
    let dreamAnalysis = null;
    if (is_completed) {
      await contextLogger.logStep('generating_dream_analysis', 'in_progress');
      
      try {
        // Chamar a API do Criador de Sonhos para gerar análise personalizada
        const dreamResponse = await fetch(`${request.headers.get('origin') || 'http://localhost:3000'}/api/tools/criador-sonhos/process-form`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user_email,
            user_email: user_email,
            ...form_data,
            // Dados específicos para o prompt do Criador de Sonhos
            familyMembers: `${form_data.fullName}${form_data.spouse ? `, ${form_data.spouse.name}` : ''}${form_data.children ? form_data.children.map((c: any) => `, ${c.name}`).join('') : ''}`,
            adultDreams: form_data.freeFormAspirations || 'Buscar uma vida melhor nos EUA',
            usaObjectives: Array.isArray(form_data.usaObjectives) ? form_data.usaObjectives.join(', ') : form_data.usaObjectives,
            targetStates: Array.isArray(form_data.targetStates) ? form_data.targetStates.join(', ') : form_data.targetStates,
            timeline: form_data.timeline,
            currentLifestyle: `Profissão: ${form_data.profession || 'Não informado'}, Renda: ${form_data.monthlyIncome || 'Não informado'}`,
            investmentCapacity: form_data.investmentCapacity,
            currentSavings: form_data.currentSavings
          })
        });

        if (dreamResponse.ok) {
          const dreamResult = await dreamResponse.json();
          dreamAnalysis = dreamResult.analysis;
          
          await contextLogger.logStep('dream_analysis_generated', 'success', {
            analysis_length: dreamAnalysis?.length || 0
          });
        } else {
          await contextLogger.logStep('dream_analysis_failed', 'error', {
            status: dreamResponse.status,
            statusText: dreamResponse.statusText
          });
        }
      } catch (error) {
        console.error('Erro ao gerar análise do sonho:', error);
        await contextLogger.logStep('dream_analysis_error', 'error', {
          error_message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    await contextLogger.logStep('operation_completed', 'success', {
      has_dream_analysis: !!dreamAnalysis
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      dreamAnalysis: dreamAnalysis,
      message: is_completed 
        ? 'Formulário completado com sucesso! Sua análise personalizada foi gerada.'
        : 'Dados do formulário salvos com sucesso'
    })

  } catch (error) {
    console.error('Erro interno ao salvar formulário:', error)
    if (contextLogger) {
      await contextLogger.logStep('internal_error', 'error', {
        error_message: error instanceof Error ? error.message : 'Erro interno desconhecido',
        error_stack: error instanceof Error ? error.stack : undefined
      });
    }
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
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
