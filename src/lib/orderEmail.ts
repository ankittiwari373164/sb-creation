import { supabaseAdmin } from './supabaseAdmin'
import { sendEmail, STORE_NOTIFY_EMAIL } from './email'

// Sends the customer an order-confirmation email, and (if configured) a copy
// to the store owner too. Called right after an order is successfully
// created (COD) or successfully verified as paid (Razorpay).
//
// Deliberately swallows its own errors — a failed email should never break
// the checkout flow or make the customer think their order didn't go
// through. Failures are just logged.
export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('[order-email] Could not load order', orderId, orderError?.message)
      return
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('quantity, price, size, color, products ( name, image_url )')
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('[order-email] Could not load order items', itemsError.message)
    }

    const shipping = order.shipping_address || {}
    const customerEmail: string | undefined = shipping.email
    const customerName: string = shipping.fullName || 'there'

    if (!customerEmail) {
      console.warn('[order-email] Order has no customer email on file, skipping:', orderId)
      return
    }

    const itemRows = (items || [])
      .map((it: any) => {
        const name = it.products?.name || 'Item'
        const variantBits = [it.size ? `Size: ${it.size}` : '', it.color ? `Color: ${it.color}` : ''].filter(Boolean)
        const variantLabel = variantBits.length ? ` <span style="color:#999;font-size:12px;">(${variantBits.join(', ')})</span>` : ''
        const lineTotal = (Number(it.price) * Number(it.quantity)).toLocaleString('en-IN')
        return `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#2d2416;">${name}${variantLabel} × ${it.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#2d2416;text-align:right;">₹${lineTotal}</td>
          </tr>`
      })
      .join('')

    const addressLines = [
      shipping.address,
      [shipping.city, shipping.state].filter(Boolean).join(', '),
      [shipping.country, shipping.pincode].filter(Boolean).join(' - '),
    ]
      .filter(Boolean)
      .join('<br/>')

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;background:#FFF0F5;padding:32px 24px;">
        <h1 style="color:#0F2C3E;font-size:22px;margin:0 0 4px;">Thank you for your order, ${customerName}! 🎉</h1>
        <p style="color:#5a4a42;font-size:14px;margin:0 0 24px;">
          We've received your order <strong>#${String(order.id).slice(0, 8).toUpperCase()}</strong> and we're getting it ready.
        </p>

        <div style="background:#fff;border-radius:16px;padding:20px 24px;margin-bottom:20px;">
          <table style="width:100%;border-collapse:collapse;">
            ${itemRows || '<tr><td style="padding:10px 0;font-size:14px;color:#999;">Order details unavailable</td></tr>'}
            <tr>
              <td style="padding:14px 0 0;font-size:15px;font-weight:bold;color:#0F2C3E;">Total</td>
              <td style="padding:14px 0 0;font-size:15px;font-weight:bold;color:#db2777;text-align:right;">₹${Number(order.total_amount).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="background:#fff;border-radius:16px;padding:20px 24px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;color:#0F5A7E;">Shipping to</p>
          <p style="margin:0;font-size:14px;color:#2d2416;line-height:1.6;">${shipping.fullName || ''}<br/>${addressLines}</p>
          <p style="margin:10px 0 0;font-size:13px;color:#5a4a42;">📞 ${shipping.phone || '—'}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#5a4a42;">✉️ ${shipping.email || customerEmail}</p>
        </div>

        <p style="font-size:13px;color:#5a4a42;margin:0 0 4px;">Order ID: <strong>${order.id}</strong></p>
        <p style="font-size:13px;color:#5a4a42;margin:0 0 4px;">Payment method: <strong>${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</strong></p>
        <p style="font-size:13px;color:#5a4a42;margin:0 0 24px;">Payment status: <strong>${order.payment_status}</strong></p>

        <p style="font-size:13px;color:#999;text-align:center;margin-top:32px;">SB Creation — Handcrafted Firozabad Bangles</p>
      </div>
    `

    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmed — #${String(order.id).slice(0, 8).toUpperCase()} | SB Creation`,
      html,
      bcc: STORE_NOTIFY_EMAIL ? [STORE_NOTIFY_EMAIL] : undefined,
    })
  } catch (err: any) {
    console.error('[order-email] Unexpected error sending confirmation:', err.message)
  }
}