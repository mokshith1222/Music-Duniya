import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './authContextCore'

const demoUserKey = 'md_demo_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(demoUserKey))
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async ({ email, password, remember = true }) => {
    if (supabase) {
      if (!remember) await supabase.auth.signOut()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { mode: 'signed-in' }
    }

    const demoUser = { id: 'demo-user', email }
    localStorage.setItem(demoUserKey, JSON.stringify(demoUser))
    setUser(demoUser)
    return { mode: 'demo' }
  }

  const signUp = async ({ email, password, fullName = '' }) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      })
      if (error) throw error
      return { mode: data.user?.identities?.length ? 'signed-up' : 'existing-user' }
    }

    const demoUser = { id: 'demo-user', email }
    localStorage.setItem(demoUserKey, JSON.stringify(demoUser))
    setUser(demoUser)
    return { mode: 'demo' }
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    localStorage.removeItem(demoUserKey)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
