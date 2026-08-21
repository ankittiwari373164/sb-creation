import { NextRequest, NextResponse } from 'next/server'
import { getStoreSettings, requireAdmin, supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Admin reads the full settings (including the secret) to display in the panel.
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req.headers.get('authorization'))
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const s = await getStoreSettings()
    return NextResponse.json({
      razorpay_enabled: s.razorpay_enabled,
      razorpay_key_id: s.razorpay_key_id || '',
      razorpay_key_secret: s.razorpay_key_secret || '',
      hero_desktop_image: s.hero_desktop_image || '',
      hero_mobile_image: s.hero_mobile_image || '',
      collections: s.collections || [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Admin saves settings.
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req.headers.get('authorization'))
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const body = await req.json()

    // COD was removed entirely — the `cod_enabled` column no longer exists
    // in store_settings, so it must never be sent in a payload written to
    // that table (writing an unknown column is what caused "Could not find
    // the 'cod_enabled' column of 'store_settings'" on every settings save,
    // including unrelated ones like saving storefront images).
    const payload: Record<string, any> = {
      id: 1,
      razorpay_enabled: !!body.razorpay_enabled,
      razorpay_key_id: String(body.razorpay_key_id ?? '').trim(),
      updated_at: new Date().toISOString(),
    }

    // Hero + collection cover images (optional — only overwrite when sent)
    if (typeof body.hero_desktop_image === 'string') {
      payload.hero_desktop_image = body.hero_desktop_image.trim()
    }
    if (typeof body.hero_mobile_image === 'string') {
      payload.hero_mobile_image = body.hero_mobile_image.trim()
    }
    if (Array.isArray(body.collections)) {
      payload.collections = body.collections.map((c: any) => ({
        title: String(c.title ?? ''),
        subtitle: String(c.subtitle ?? ''),
        image: String(c.image ?? ''),
        link: String(c.link ?? '/shop'),
      }))
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