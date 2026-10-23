import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/**
 * Validates whether the Supabase credentials are configured and not placeholder values.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false
  }

  // Reject initial template placeholders
  if (
    supabaseUrl.includes('your-project-id') ||
    supabaseUrl.includes('placeholder') ||
    !supabaseUrl.startsWith('https://')
  ) {
    return false
  }

  if (
    supabaseAnonKey.includes('your-anon-public-key') ||
    supabaseAnonKey.includes('placeholder') ||
    supabaseAnonKey.length < 20
  ) {
    return false
  }

  return true
}

export interface HealthCheckResult {
  configured: boolean
  healthy: boolean
  message: string
  latencyMs?: number
}

// Singleton client instance initialized if valid configuration exists
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/**
 * Live diagnostic probe that tests actual cloud reachability to Supabase.
 */
export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const startTime = performance.now()

  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      healthy: false,
      message: 'Supabase URL or Anon Key is missing or using placeholders in .env.',
    }
  }

  if (!supabase) {
    return {
      configured: false,
      healthy: false,
      message: 'Supabase client failed to initialize.',
    }
  }

  try {
    // Perform a lightweight probe to the REST endpoint
    const { error } = await supabase.from('profiles').select('id', { count: 'exact', head: true })
    const latency = Math.round(performance.now() - startTime)

    if (error) {
      // Table doesn't exist yet (PGRST205 / 42P01) means credentials are valid, schema migration pending
      if (
        error.code === '42P01' || 
        error.code === 'PGRST205' || 
        error.message.includes('relation "profiles" does not exist') ||
        error.message.includes('Could not find the table')
      ) {
        return {
          configured: true,
          healthy: true,
          message: `Connected to Supabase (${latency}ms). Phase 03 schema migrations pending.`,
          latencyMs: latency,
        }
      }
      return {
        configured: true,
        healthy: false,
        message: `Connected, but received: ${error.message}`,
        latencyMs: latency,
      }
    }

    return {
      configured: true,
      healthy: true,
      message: `Successfully connected to Supabase PostgreSQL (${latency}ms).`,
      latencyMs: latency,
    }
  } catch (err: unknown) {
    const latency = Math.round(performance.now() - startTime)
    const errMessage = err instanceof Error ? err.message : 'Unknown network failure'
    return {
      configured: true,
      healthy: false,
      message: `Failed to reach Supabase: ${errMessage}`,
      latencyMs: latency,
    }
  }
}
