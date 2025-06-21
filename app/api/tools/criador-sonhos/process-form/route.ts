import { NextRequest, NextResponse } from 'next/server'

// OpenAI config (ajuste para seu ambiente)
const openaiApiKey = process.env.OPENAI_API_KEY
const openaiUrl = 'https://api.openai.com/v1/chat/completions'

// API desativada: integração Supabase removida para ambiente local.
export async function POST() {
  return new Response(JSON.stringify({ error: 'Funcionalidade desativada para ambiente local.' }), { status: 501 });
}
