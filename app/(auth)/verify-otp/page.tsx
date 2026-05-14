'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, Loader2, RefreshCw, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    const next = [...otp]
    digits.forEach((d, i) => { next[i] = d })
    setOtp(next)
    inputRefs.current[Math.min(digits.length, 5)]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = otp.join('')
    if (token.length < 6) { setError('Please enter all 6 digits.'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function handleResend() {
    setResending(true)
    setError('')
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    if (resendError) { setError(resendError.message); return }
    setResendCooldown(60)
  }

  return (
    <div className="animate-fade-in text-center">
      <div className="w-20 h-20 rounded-[28px] bg-[var(--nv-gold)]/10 border border-[var(--nv-gold)]/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[var(--nv-gold)]/5">
        <ShieldCheck className="w-10 h-10 text-[var(--nv-gold)]" />
      </div>

      <div className="mb-10">
        <h1 className="nv-heading text-3xl mb-3">Security Verification</h1>
        <p className="text-slate-400">
          Enter the 6-digit code sent to <br/>
          <span className="text-white font-bold">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-16 sm:w-14 sm:h-18 text-center text-2xl font-bold text-white bg-white/5 border border-white/10 rounded-2xl outline-none transition-all focus:border-[var(--nv-gold)] focus:bg-white/[0.08]"
              style={{ caretColor: 'var(--nv-gold)' }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center h-14 text-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Verify & Complete <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/5">
        <button
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="flex items-center justify-center gap-2 text-sm mx-auto font-bold transition-all disabled:opacity-40"
          style={{ color: resendCooldown > 0 ? '#475569' : 'var(--nv-gold)' }}
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {resendCooldown > 0
            ? `Resend available in ${resendCooldown}s`
            : resending
            ? 'Dispatching Code...'
            : 'Resend Verification Code'}
        </button>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--nv-gold)]" />
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  )
}
