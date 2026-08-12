import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentProfile } from '../lib/auth'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      if (!supabase) {
        setSession(null)
        setProfile(null)
        setLoading(false)
        return
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!isMounted) return

      setSession(currentSession)

      if (currentSession?.user) {
        try {
          const currentProfile = await getCurrentProfile()
          setProfile(currentProfile)
        } catch (error) {
          console.error('Failed to load profile', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!isMounted) return

      setSession(nextSession)

      if (nextSession?.user) {
        try {
          const currentProfile = await getCurrentProfile()
          setProfile(currentProfile)
        } catch (error) {
          console.error('Failed to sync profile', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      profile,
      loading,
      isAuthenticated: Boolean(session?.user),
      isAdmin: profile?.role === 'admin',
      isCustomer: profile?.role === 'customer' || !profile,
    }),
    [profile, session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
