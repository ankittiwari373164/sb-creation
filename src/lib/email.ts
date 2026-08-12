// Sends email directly through your business mailbox via SMTP (Zoho Mail,
// Google Workspace, Outlook 365, cPanel/Hostinger email, etc.) — no
// third-party email API needed.
//
// Setup (one-time):
//   1. Get your mailbox's SMTP settings from your email provider. Common ones:
//        Zoho Mail:         smtp.zoho.com        port 465 (SSL)
//        Google Workspace:  smtp.gmail.com        port 465 (SSL) or 587 (TLS)
//        Outlook / M365:    smtp.office365.com     port 587 (TLS)
//        Hostinger/cPanel:  mail.yourdomain.com    port 465 (SSL)
//   2. Most providers require an "app password" (not your normal login
//      password) for SMTP — search "<provider> app password" if unsure.
//      Google Workspace and Outlook both require this when 2FA is on.
//   3. Add to .env.local:
//        SMTP_HOST=smtp.zoho.com
//        SMTP_PORT=465
//        SMTP_SECURE=true          (true for port 465, false for port 587)
//        SMTP_USER=orders@yourdomain.com
//        SMTP_PASS=your_app_password
//        SMTP_FROM="SB Creation <orders@yourdomain.com>"
//        STORE_NOTIFY_EMAIL=you@yourdomain.com   (optional — BCC on every order)

import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false' // default true (matches port 465)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER
const STORE_NOTIFY_EMAIL = process.env.STORE_NOTIFY_EMAIL

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  if (transporter) return transporter

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE, // true for 465 (SSL), false for 587/25 (STARTTLS)
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transporter
}

export async function sendEmail({
  to,
  subject,
  html,
  bcc,
}: {
  to: string
  subject: string
  html: string
  bcc?: string[]
}): Promise<{ ok: boolean; error?: string }> {
  const t = getTransporter()
  if (!t) {
    console.warn('[email] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) — skipping email send. Add them to .env.local to enable order emails.')
    return { ok: false, error: 'SMTP not configured' }
  }
  if (!to) {
    console.warn('[email] No recipient address provided — skipping email send.')
    return { ok: false, error: 'No recipient' }
  }

  try {
    await t.sendMail({
      from: SMTP_FROM,
      to,
      bcc,
      subject,
      html,
    })
    console.log('[email] Sent:', subject, '→', to)
    return { ok: true }
  } catch (err: any) {
    console.error('[email] Failed to send:', err.message)
    return { ok: false, error: err.message }
  }
}

export { STORE_NOTIFY_EMAIL }