import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getStoreSettings, supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Verifies the payment signature Razorpay returns to the browser. The signature
// is an HMAC-SHA256 of "{razorpay_order_id}|{razorpay_payment_id}" keyed with the
// secret. Only the server knows the secret, so a valid signature proves the
// payment is genuine and untampered.
export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id, // our Supabase order id
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    const settings = await getStoreSettings()
    if (!settings.razorpay_key_secret) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 400 })
    }

    const expected = crypto
      .createHmac('sha256', settings.razorpay_key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))

    if (!valid) {
      // Mark the order as failed so it doesn't sit as a fake "pending".
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', order_id)
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'processing',
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq('id', order_id)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}