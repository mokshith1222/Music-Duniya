import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// A valid Supabase anon key is a JWT (starts with "eyJ" and is 100+ chars).
// If the key is present but malformed, fall back to demo mode gracefully.
const isKeyValid = supabaseAnonKey.startsWith('eyJ') && supabaseAnonKey.length > 100
const isUrlValid = supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')

export const isSupabaseConfigured = isUrlValid && isKeyValid

if (supabaseUrl && supabaseAnonKey && !isSupabaseConfigured) {
  console.warn(
    '[Music Duniya] Supabase env vars are set but the anon key appears invalid.\n' +
    'Expected a JWT starting with "eyJ..." (200+ chars).\n' +
    'Go to Supabase Dashboard → Settings → API → Copy "anon public" key.\n' +
    'Falling back to demo/local auth mode.'
  )
}

let supabaseClient = null
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  } catch (err) {
    console.error('[Music Duniya] Failed to create Supabase client:', err)
  }
}

export const supabase = supabaseClient
