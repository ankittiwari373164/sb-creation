import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '../../../lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Visit /api/test-email?to=your@email.com in production (or locally) to send
// a real test email and see exactly what SMTP returns — success or the real
// underlying error (auth failure, wrong host, blocked port, etc). This is
// the fastest way to confirm whether SMTP_* env vars are actually set on
// your hosting platform (Vercel etc. don't read .env.local — those vars
// must be added separately in the platform's dashboard and the site
// redeployed afterward).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to')

  const envStatus = {
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    SMTP_PASS: !!process.env.SMTP_PASS,
    SMTP_FROM: !!process.env.SMTP_FROM,
    STORE_NOTIFY_EMAIL: !!process.env.STORE_NOTIFY_EMAIL,
  }

  if (!to) {
    return NextResponse.json({
      message: 'Add ?to=your@email.com to the URL to send a real test email.',
      env_vars_present: envStatus,
    })
  }

  const result = await sendEmail({
    to,
    subject: 'SB Creation — Test Email',
    html: '<p>If you received this, SMTP is configured correctly and order emails will work.</p>',
  })

  return NextResponse.json({
    ...result,
    env_vars_present: envStatus,
  })
}