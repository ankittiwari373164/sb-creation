import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { sendOrderConfirmationEmail } from '../../../lib/orderEmail'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// /api/test-email confirmed SMTP itself works. This route tests the OTHER
// half — the actual order-confirmation path (loading the order + items from
// Supabase, building the email, sending it) — against a real order id, and
// returns the precise reason if it doesn't send, instead of that reason
// only being visible in a server log you can't easily check.
//
// Usage: /api/test-order-email?order_id=<a real order id from Admin → Orders>
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('order_id')

  if (!orderId) {
    // No id given — list the 5 most recent orders so you can copy one.
    const { data: recentOrders, error } = await supabaseAdmin
      .from('orders')
      .select('id, created_at, payment_status, shipping_address')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      message: 'Add ?order_id=<id> to actually test-send for that order. Here are your 5 most recent orders to pick from:',
      recent_orders: error
        ? []
        : recentOrders?.map((o: any) => ({
            id: o.id,
            created_at: o.created_at,
            payment_status: o.payment_status,
            customer_email: o.shipping_address?.email || null,
          })),
    })
  }

  // Load the order the same way sendOrderConfirmationEmail does, so we can
  // report exactly what it would see (missing email, missing items, etc)
  // before even trying to send.
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ ok: false, stage: 'load_order', error: orderError?.message || 'Order not found' }, { status: 404 })
  }

  const customerEmail = order.shipping_address?.email
  if (!customerEmail) {
    return NextResponse.json({
      ok: false,
      stage: 'check_email',
      error: 'This order has no customer email saved in shipping_address — that is why no email was sent for it.',
      shipping_address: order.shipping_address,
    })
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('quantity, price, size, color, products ( name, image_url )')
    .eq('order_id', orderId)

  // Actually attempt the real send now, using the real function — not a
  // simulation — so success/failure here reflects exactly what the live
  // order flow does.
  await sendOrderConfirmationEmail(orderId)

  return NextResponse.json({
    ok: true,
    message: `Attempted to send confirmation for order ${orderId} to ${customerEmail}. Check that inbox (and spam folder).`,
    order_items_query_error: itemsError?.message || null,
    order_items_found: items?.length ?? 0,
  })
}