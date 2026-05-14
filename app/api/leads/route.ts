import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { leadSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const supabase = createAdminSupabaseClient()
    const { error } = await supabase.from('leads').insert({
      ...parsed.data,
      status: 'new',
    })

    if (error) {
      console.error('leads insert error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('leads route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
