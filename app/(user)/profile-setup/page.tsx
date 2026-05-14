'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { User, Phone, Mail, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, mobile')
        .eq('id', user.id)
        .single()

      setFullName(profile?.full_name ?? '')
      setMobile(profile?.mobile ?? '')
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    setSaved(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, mobile, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    setSaving(false)
    if (updateError) { setError(updateError.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton h-10 w-64 border border-black/5" />
        <div className="skeleton h-64 border border-black/10" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Identity Management</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Account <br/><em className="italic font-light">Profile.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-md mt-4 leading-relaxed">
            Manage your personal profile and contact synchronization within the NestVault ecosystem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-8 p-6 border border-black text-black text-[10px] font-bold uppercase tracking-label bg-[#FAFAFA]">
              {error}
            </div>
          )}

          {saved && (
            <div className="mb-8 p-6 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-label flex items-center gap-4">
              <CheckCircle2 className="w-4 h-4" />
              Vault identity updated successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-black/10 bg-white p-8 md:p-12 space-y-12">
            <div className="space-y-8">
              {/* Email (read-only) */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-black/60 uppercase tracking-label flex items-center gap-3">
                  <Mail className="w-4 h-4 text-black/40" /> Verified Email Alias
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black/40 outline-none cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-black/60 uppercase tracking-label flex items-center gap-3">
                  <User className="w-4 h-4 text-black/40" /> Principal Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-black/60 uppercase tracking-label flex items-center gap-3">
                  <Phone className="w-4 h-4 text-black/40" /> Operational Contact
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white py-5 text-[11px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center justify-center gap-4 disabled:opacity-30"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Secure Changes <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-12">
          <div className="bg-black p-10 text-white relative overflow-hidden group">
            <ShieldCheck className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-2xl font-serif tracking-display uppercase mb-6 relative z-10">Vault Security</h3>
            <p className="text-sm font-sans text-white/50 leading-relaxed mb-8 relative z-10">Your personal data is encrypted using multi-tier architectural security protocols.</p>
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-label text-white/40 relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Encrypted Session Active
            </div>
          </div>

          <div className="border border-black/10 bg-[#FAFAFA] p-10">
            <h3 className="text-xl font-serif tracking-display text-black mb-4">Authentication</h3>
            <p className="text-sm font-sans text-black/50 leading-relaxed mb-8">Need to reset your vault access keys or manage two-factor protocols?</p>
            <button className="text-[10px] font-bold uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors flex items-center gap-3">
              Update Security <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
