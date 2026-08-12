import { supabase } from './supabase'

export async function signUp({ email, password, fullName, username }) {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
        username: username || '',
      },
    },
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn({ email, password }) {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function resetPassword(email) {
  if (!supabase) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    throw error
  }

  return data
}

export async function getCurrentProfile() {
  if (!supabase) {
    return null
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
