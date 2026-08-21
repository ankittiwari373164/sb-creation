import { NextResponse } from 'next/server'
import { getStoreSettings, DEFAULT_HERO_DESKTOP, DEFAULT_HERO_MOBILE, DEFAULT_COLLECTIONS } from '../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public — returns ONLY the fields the storefront/checkout is allowed to see.
// The Razorpay secret is intentionally never included here. COD was removed
// entirely, so there's no cod_enabled field anymore — Razorpay is the only
// payment method.
export async function GET() {
  try {
    const s = await getStoreSettings()
    return NextResponse.json({
      razorpay_enabled: s.razorpay_enabled && !!s.razorpay_key_id && !!s.razorpay_key_secret,
      razorpay_key_id: s.razorpay_enabled ? s.razorpay_key_id : '',
      hero_desktop_image: s.hero_desktop_image,
      hero_mobile_image: s.hero_mobile_image,
      collections: s.collections,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        razorpay_enabled: false,
        razorpay_key_id: '',
        hero_desktop_image: DEFAULT_HERO_DESKTOP,
        hero_mobile_image: DEFAULT_HERO_MOBILE,
        collections: DEFAULT_COLLECTIONS,
      },
      { status: 200 }
    )
  }
}