import { NextRequest, NextResponse } from 'next/server'
import { getStoreSettings, requireAdmin, supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Admin reads the full settings (including the secret) to display in the panel.
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req.headers.get('authorization'))
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const s = await getStoreSettings()
    return NextResponse.json({
      razorpay_enabled: s.razorpay_enabled,
      cod_enabled: s.cod_enabled,
      razorpay_key_id: s.razorpay_key_id || '',
      razorpay_key_secret: s.razorpay_key_secret || '',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Admin saves settings.
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req.headers.get('authorization'))
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    const payload: Record<string, any> = {
      id: 1,
      razorpay_enabled: !!body.razorpay_enabled,
      cod_enabled: !!body.cod_enabled,
      razorpay_key_id: String(body.razorpay_key_id ?? '').trim(),
      updated_at: new Date().toISOString(),
    }

    // Only overwrite the secret when a non-masked value is sent, so re-saving the
    // form without re-typing the secret won't wipe it.
    const secret = String(body.razorpay_key_secret ?? '').trim()
    if (secret && !secret.includes('•')) {
      payload.razorpay_key_secret = secret
    }

    // Guard: can't enable Razorpay without both keys present.
    if (payload.razorpay_enabled) {
      const existing = await getStoreSettings()
      const effectiveSecret = payload.razorpay_key_secret ?? existing.razorpay_key_secret
      if (!payload.razorpay_key_id || !effectiveSecret) {
        return NextResponse.json(
          { error: 'Both Key ID and Key Secret are required to enable Razorpay.' },
          { status: 400 }
        )
      }
    }

    const { error } = await supabaseAdmin.from('store_settings').upsert(payload, { onConflict: 'id' })
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}