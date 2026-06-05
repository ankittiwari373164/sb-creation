import { createClient } from '@supabase/supabase-js'

// ⚠️ SERVER ONLY. Never import this file in a client component.
// Uses the service-role key, which bypasses RLS. The service-role key and the
// Razorpay secret must never reach the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Use placeholders if env is missing so importing this module never throws.
// requireAdmin()/getStoreSettings() surface a clear error instead.
export const supabaseAdmin = createClient(
  supabaseUrl || 'http://localhost',
  serviceRoleKey || 'missing-service-role-key',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
)

export type StoreSettings = {
  id: number
  razorpay_enabled: boolean
  cod_enabled: boolean
  razorpay_key_id: string
  razorpay_key_secret: string
  updated_at: string
}

// Reads the single settings row, creating it with safe defaults if missing.
export async function getStoreSettings(): Promise<StoreSettings> {
  const { data, error } = await supabaseAdmin
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const defaults = {
      id: 1,
      razorpay_enabled: false,
      cod_enabled: true,
      razorpay_key_id: '',
      razorpay_key_secret: '',
    }
    const { data: created, error: insErr } = await supabaseAdmin
      .from('store_settings')
      .insert(defaults)
      .select('*')
      .single()
    if (insErr) throw insErr
    return created as StoreSettings
  }

  return data as StoreSettings
}

// Validates the caller's Supabase access token and confirms they are an admin.
// Returns { user } on success, or { error, status } describing what failed so
// the client can show a useful message instead of a blanket "Unauthorized".
export async function requireAdmin(authHeader: string | null) {
  if (!serviceRoleKey) {
    return {
      error:
        'Server is missing SUPABASE_SERVICE_ROLE_KEY. Add it to your hosting environment variables and redeploy.',
      status: 500 as const,
    }
  }

  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) {
    return { error: 'You are signed out. Please log in again.', status: 401 as const }
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) {
    // Surface the real reason so we can tell apart an expired token, a bad
    // service-role key / project mismatch, etc.
    const detail = error?.message || 'no user returned'
    return {
      error: `Could not verify session: ${detail}. Please log in again.`,
      status: 401 as const,
    }
  }

  // Accept the role wherever it might live (app_metadata is the standard spot).
  const role =
    (data.user.app_metadata as any)?.role ??
    (data.user.user_metadata as any)?.role ??
    (data.user as any)?.role

  if (role !== 'admin') {
    return {
      error: 'This account is not an admin. Sign in with your admin account.',
      status: 403 as const,
    }
  }

  return { user: data.user }
}