import { supabase } from './supabase'

const LOCAL_USERS = {
  'admin@maduramart.test': {
    id: 'local-admin-id',
    email: 'admin@maduramart.test',
    full_name: 'Admin Madura Mart',
    username: 'adminmaduramart',
    role: 'admin',
    password: 'admin123',
  },
  'customer@maduramart.test': {
    id: 'local-customer-id',
    email: 'customer@maduramart.test',
    full_name: 'Customer Madura Mart',
    username: 'customermart',
    role: 'customer',
    password: 'customer123',
  },
}

function getLocalSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem('madura-mart-session')
  return stored ? JSON.parse(stored) : null
}

function setLocalSession(session) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem('madura-mart-session', JSON.stringify(session))
}

function clearLocalSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem('madura-mart-session')
}

export async function signUp({ email, password, fullName, username }) {
  if (!supabase) {
    const normalized = String(email || '').trim().toLowerCase()
    const user = LOCAL_USERS[normalized]

    if (!user) {
      throw new Error('Demo sign-up is only allowed for test accounts. Use admin@maduramart.test or customer@maduramart.test.')
    }

    if (password !== user.password) {
      throw new Error('Password tidak valid untuk akun demo.')
    }

    const session = {
      user: {
        id: user.id,
        email: user.email,
      },
    }

    setLocalSession(session)
    return {
      user: session.user,
      profile: {
        id: user.id,
        full_name: fullName || user.full_name,
        username: username || user.username,
        role: user.role,
      },
    }
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
  const normalized = String(email || '').trim().toLowerCase()
  const user = LOCAL_USERS[normalized]

  if (user && password === user.password) {
    const session = {
      user: {
        id: user.id,
        email: user.email,
      },
    }

    setLocalSession(session)
    return {
      user: session.user,
      profile: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        role: user.role,
      },
    }
  }

  if (!supabase) {
    throw new Error('Demo login gagal. Gunakan admin@maduramart.test / admin123 atau customer@maduramart.test / customer123.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  if (!supabase) {
    clearLocalSession()
    return
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
    const session = getLocalSession()

    if (!session?.user?.email) {
      return null
    }

    const user = LOCAL_USERS[session.user.email]
    if (!user) {
      return null
    }

    return {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      role: user.role,
      email: user.email,
    }
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
