import { NextRequest, NextResponse } from 'next/server'

// API desativada: integração Supabase removida para ambiente local.
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Funcionalidade desativada para ambiente local.' }),
    { status: 501 }
  )
}
