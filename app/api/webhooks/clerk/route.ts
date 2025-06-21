import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { supabaseAdmin } from '../../../lib/supabase'

export async function POST(req: NextRequest) {
  return new Response('Clerk integration removed', { status: 410 })
}
