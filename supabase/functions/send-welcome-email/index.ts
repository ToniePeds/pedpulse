// supabase/functions/send-welcome-email/index.ts
// Sends a welcome email to new newsletter subscribers via Resend.
// Deploy: supabase functions deploy send-welcome-email
// Set secret: supabase secrets set RESEND_API_KEY=re_xxxxx

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'PedsPulse <onboarding@resend.dev>' // Use resend.dev domain until you add a custom domain

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { email } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: 'email required' }), { status: 400 })
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set')
      return new Response(JSON.stringify({ error: 'email service not configured' }), { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Welcome to PedsPulse!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#050A12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:24px;font-weight:800;color:#5EEAD4;">PedsPulse</span>
    </div>

    <!-- Card -->
    <div style="background:#0F172A;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:32px;">
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#FFFFFF;">
        You're in! Welcome to the ward.
      </h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#94A3B8;">
        Thanks for subscribing to PedsPulse. You'll get a short email whenever we
        drop a new episode, blog post, or clinical tool — and nothing else.
      </p>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#94A3B8;">
        In the meantime, here's what's waiting for you:
      </p>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#94A3B8;">
        <li><strong style="color:#FFFFFF;">Episodes</strong> — bite-sized pediatric deep-dives</li>
        <li><strong style="color:#FFFFFF;">Blog</strong> — long-form clinical takes</li>
        <li><strong style="color:#FFFFFF;">Tools</strong> — bedside calculators & simulators</li>
      </ul>

      <a href="https://pedspulse.vercel.app"
         style="display:inline-block;padding:12px 28px;background:linear-gradient(to right,#2DD4BF,#34D399);color:#04131A;font-weight:700;font-size:14px;text-decoration:none;border-radius:12px;">
        Explore PedsPulse
      </a>
    </div>

    <!-- Footer -->
    <p style="margin-top:32px;text-align:center;font-size:12px;color:#475569;">
      You received this because you subscribed at PedsPulse.<br>
      No spam, ever. Just pediatrics.
    </p>
  </div>
</body>
</html>
        `.trim(),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend error:', data)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
})
