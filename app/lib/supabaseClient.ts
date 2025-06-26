import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

declare global {
  // eslint-disable-next-line no-var
  var __supabase: SupabaseClient | undefined;
}

let supabase: SupabaseClient;

if (typeof window !== 'undefined') {
  // @ts-ignore
  if (!window.__supabase) {
    // @ts-ignore
    window.__supabase = createClient(supabaseUrl, supabaseKey);
  }
  // @ts-ignore
  supabase = window.__supabase;
} else {
  if (!global.__supabase) {
    global.__supabase = createClient(supabaseUrl, supabaseKey);
  }
  supabase = global.__supabase;
}

export default supabase;
