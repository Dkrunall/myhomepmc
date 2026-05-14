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
    <div className="animate-fade-in w-full mx-auto">
      <div className="mb-14">
        <div className="w-14 h-14 bg-black flex items-center justify-center mb-8">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
          Security <br/> <em className="italic font-light">Verification.</em>
        </h1>
        <p className="text-black/50 font-serif text-base leading-relaxed">
          Enter the 6-digit code sent to{' '}
          <span className="text-black font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-[#FAFAFA] border border-black text-black text-[10px] uppercase tracking-label font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-2 mb-10" onPaste={handlePaste}>
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
              className="w-12 h-14 text-center text-xl font-bold text-black bg-[#FAFAFA] border border-black/10 outline-none transition-colors focus:border-black focus:bg-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center justify-center gap-4 disabled:opacity-30"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify & Complete <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-16 pt-8 border-t border-black/10">
        <button
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-black/40 hover:text-black transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
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
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  )
}
