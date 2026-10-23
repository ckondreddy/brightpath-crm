import React, { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { UserProfile, UserRole } from '../types'
import { AuthContext } from './auth-types'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured() && Boolean(supabase))

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.warn('Could not load profile:', error.message)
        return null
      }
      return data as UserProfile | null
    } catch (err) {
      console.error('Failed to query user profile:', err)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id)
      setProfile(p)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      return
    }

    let isMounted = true

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          if (!isMounted) return
          setProfile(p)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        if (!isMounted) return
        setProfile(p)
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

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client is not configured.') }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) {
      return { error: new Error('Supabase client is not configured.'), user: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (!error && data.user) {
      const p = await fetchProfile(data.user.id)
      setProfile(p)
    }

    return { error, user: data.user }
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const role: UserRole | null = profile?.role ?? null

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        role,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
