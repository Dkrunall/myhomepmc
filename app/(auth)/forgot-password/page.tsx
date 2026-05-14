'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="animate-fade-in w-full mx-auto">
        <div className="mb-14">
          <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
            Check Your <br/> <em className="italic font-light">Inbox.</em>
          </h1>
          <p className="text-black/50 font-serif text-lg leading-relaxed">
            A password reset link has been sent to{' '}
            <span className="text-black font-medium">{email}</span>
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-black/40 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full mx-auto">
      <div className="mb-14">
        <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
          Recover <br/> <em className="italic font-light">Access.</em>
        </h1>
        <p className="text-black/50 font-serif text-lg">Enter your email to receive a reset link.</p>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-[#FAFAFA] border border-black text-black text-[10px] uppercase tracking-label font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Registered Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. name@company.com"
            className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center justify-center gap-4 disabled:opacity-30 mt-8"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Send Reset Link <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-16 pt-8 border-t border-black/10">
        <Link
          href="/login"
          className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-black/40 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>
    </div>
  )
}
