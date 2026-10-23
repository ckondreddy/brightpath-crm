import { createContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { UserProfile, UserRole } from '../types'

export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; user: User | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
