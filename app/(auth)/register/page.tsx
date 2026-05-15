'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ArrowRight, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
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
        <div className="w-14 h-14 bg-black flex items-center justify-center mb-8">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
            Check Your <br/> <em className="italic font-light">Inbox.</em>
          </h1>
          <p className="text-black/50 font-serif text-base leading-relaxed">
            A confirmation link has been sent to{' '}
            <span className="text-black font-medium">{email}</span>
            <br />Click the link in the email to activate your account.
          </p>
        </div>
        <div className="p-6 bg-[#FAFAFA] border border-black/10 text-[10px] uppercase tracking-label text-black/50 font-bold">
          Didn&apos;t receive it? Check your spam folder.
        </div>
        <div className="mt-10">
          <Link href="/login" className="text-[10px] font-bold uppercase tracking-label text-black/40 hover:text-black transition-colors underline underline-offset-4">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in w-full mx-auto">
      <div className="mb-14">
        <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
          Initialize <br/> <em className="italic font-light">Access.</em>
        </h1>
        <p className="text-black/50 font-serif text-lg">Join India&apos;s premier architectural PMC platform.</p>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-[#FAFAFA] border border-black text-black text-[10px] uppercase tracking-label font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Principal Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Strategic Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. rahul@example.com"
            className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Access Key</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8"
                className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Confirm Key</label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter"
              className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
            />
          </div>
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
              Initialize Registry <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-16 pt-8 border-t border-black/10">
        <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">
          Already have a vault profile?{' '}
          <Link href="/login" className="text-black hover:text-[#D4AF37] underline underline-offset-4 transition-colors">
            Access Dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}
