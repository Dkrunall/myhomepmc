import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')
    // Verify caller is an authenticated admin
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, registrationId, reportUrl, coverMessage } = body as {
      userId: string
      registrationId: string
      reportUrl: string
      coverMessage: string
    }

    if (!userId || !registrationId || !reportUrl || !coverMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user email via service role
    const adminClient = createAdminSupabaseClient()
    const { data: { user: targetUser }, error: userError } = await adminClient.auth.admin.getUserById(userId)
    if (userError || !targetUser?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get society name for email context
    const { data: reg } = await adminClient
      .from('society_registrations')
      .select('society_name')
      .eq('id', registrationId)
      .single()

    const societyName = reg?.society_name ?? 'your project'

    const { error: emailError } = await resend.emails.send({
      from: 'NestVault <noreply@nestvault.in>',
      to: [targetUser.email],
      subject: `Your Feasibility Report is Ready — ${societyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0B0F1A; color: #F8F9FA; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <div style="width: 36px; height: 36px; background: linear-gradient(135deg,#D4AF37,#A6892C); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; vertical-align: middle;">N</div>
                  <span style="font-size: 22px; font-weight: 700; vertical-align: middle;">Nest<span style="color: #D4AF37;">Vault</span></span>
                </div>
              </div>

              <!-- Card -->
              <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.2); border-radius: 20px; padding: 36px;">
                <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px; color: #fff;">
                  Your Feasibility Report is Ready
                </h1>
                <p style="font-size: 14px; color: #94a3b8; margin: 0 0 24px;">
                  Project: <strong style="color: #D4AF37;">${societyName}</strong>
                </p>

                <p style="font-size: 15px; color: #cbd5e1; line-height: 1.7; margin: 0 0 24px;">
                  ${coverMessage.replace(/\n/g, '<br/>')}
                </p>

                <div style="margin: 28px 0; padding: 20px; background: rgba(212,175,55,0.06); border: 1px solid rgba(212,175,55,0.15); border-radius: 14px;">
                  <p style="margin: 0 0 14px; font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Your Report</p>
                  <a
                    href="${reportUrl}"
                    style="display: inline-block; background: linear-gradient(135deg,#D4AF37,#A6892C); color: #0B0F1A; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none;"
                  >
                    Download Report
                  </a>
                </div>

                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  You can also view this report anytime in your
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nestvault.in'}/documents" style="color: #D4AF37; text-decoration: none;">NestVault Documents</a>
                  section.
                </p>
              </div>

              <p style="text-align: center; font-size: 12px; color: #334155; margin-top: 28px;">
                © ${new Date().getFullYear()} NestVault. You received this because you have a registered project.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('send-report route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
