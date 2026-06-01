import { createClient } from '@supabase/supabase-js'

// ⚠️ SERVER ONLY. Never import this file in a client component.
// Uses the service-role key, which bypasses RLS. The service-role key and the
// Razorpay secret must never reach the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

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
// Returns the user on success, or null if unauthorized.
export async function requireAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data.user) return null
  if (data.user.app_metadata?.role !== 'admin') return null
  return data.user
}