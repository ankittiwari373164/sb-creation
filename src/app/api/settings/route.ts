import { NextResponse } from 'next/server'
import { getStoreSettings } from '../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public — returns ONLY the fields the storefront/checkout is allowed to see.
// The Razorpay secret is intentionally never included here.
export async function GET() {
  try {
    const s = await getStoreSettings()
    return NextResponse.json({
      razorpay_enabled: s.razorpay_enabled && !!s.razorpay_key_id && !!s.razorpay_key_secret,
      cod_enabled: s.cod_enabled,
      razorpay_key_id: s.razorpay_enabled ? s.razorpay_key_id : '',
    })
  } catch (err: any) {
    // Fail safe: COD on, online off, so checkout never fully breaks.
    return NextResponse.json(
      { razorpay_enabled: false, cod_enabled: true, razorpay_key_id: '' },
      { status: 200 }
    )
  }
}