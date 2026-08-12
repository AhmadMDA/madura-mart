import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null

export const isSupabaseConfigured = Boolean(supabase)

export const getSupabaseStatus = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Missing environment variables'
  }

  return 'Configured for local or Vercel deployment'
}

export const testSupabaseConnection = async () => {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const { error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .limit(1)

  if (error && error.code !== '42P01' && error.code !== 'PGRST116') {
    throw error
  }

  return {
    ok: true,
    message: 'Supabase client connected successfully. Database tables will be created in later phases.',
  }
}
