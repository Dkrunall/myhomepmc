'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    router.push(profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
  }

  return (
    <div className="animate-fade-in w-full mx-auto">
      <div className="mb-14">
        <h1 className="text-4xl md:text-5xl font-serif tracking-display text-black mb-4">
          Vault <br/> <em className="italic font-light">Access.</em>
        </h1>
        <p className="text-black/50 font-serif text-lg">Secure authentication portal.</p>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-[#FAFAFA] border border-black text-black text-[10px] uppercase tracking-label font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-black/60 uppercase tracking-label px-2">Secure Email Identity</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. name@company.com"
            className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-bold text-black/60 uppercase tracking-label">Private Password</label>
            <Link href="/forgot-password" university-link="true" className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-label hover:text-black transition-colors">
              Recover?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
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
              Sign in to Vault <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-16 pt-8 border-t border-black/10">
        <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">
          Don't have a profile?{' '}
          <Link href="/register" className="text-black hover:text-[#D4AF37] underline underline-offset-4 transition-colors">
            Initialize Access
          </Link>
        </p>
      </div>
    </div>
  )
}
