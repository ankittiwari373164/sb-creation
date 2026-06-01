import { NextRequest, NextResponse } from 'next/server'
import { getStoreSettings } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Creates a Razorpay Order. The secret stays on the server — we call Razorpay's
// REST API directly with HTTP Basic auth, so no extra npm package is needed.
export async function POST(req: NextRequest) {
  try {
    const { amount, receipt } = await req.json()

    const rupees = Number(amount)
    if (!rupees || rupees <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const settings = await getStoreSettings()
    if (!settings.razorpay_enabled || !settings.razorpay_key_id || !settings.razorpay_key_secret) {
      return NextResponse.json({ error: 'Online payment is not enabled' }, { status: 400 })
    }

    const auth = Buffer.from(
      `${settings.razorpay_key_id}:${settings.razorpay_key_secret}`
    ).toString('base64')

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(rupees * 100), // Razorpay works in paise
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
      }),
    })

    const data = await rzpRes.json()
    if (!rzpRes.ok) {
      return NextResponse.json(
        { error: data?.error?.description || 'Failed to create Razorpay order' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: settings.razorpay_key_id, // public key — safe to send to client
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}