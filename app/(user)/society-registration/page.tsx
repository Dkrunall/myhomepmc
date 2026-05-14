'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getEditTimeLeft, formatDateTime } from '@/lib/utils'
import {
  Building2, Loader2, CheckCircle2, Upload,
  FileCheck, AlertTriangle, Info, ArrowRight,
  ShieldCheck, Map, Ruler, HardHat, Activity, Clock
} from 'lucide-react'
import type { SocietyRegistration } from '@/types'

function FileDropzone({
  label,
  value,
  onChange,
  disabled
}: {
  label: string
  value: { file: File | null, uploading: boolean, url: string, error: string }
  onChange: (v: { file: File | null, uploading: boolean, url: string, error: string }) => void
  disabled?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (disabled) return
    onChange({ ...value, file, uploading: true, error: '' })
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { onChange({ ...value, uploading: false, error: 'Not authenticated' }); return }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('registration-docs').upload(path, file, { upsert: true })
    if (upErr) { onChange({ file, uploading: false, url: '', error: upErr.message }); return }

    const { data: { publicUrl } } = supabase.storage.from('registration-docs').getPublicUrl(path)
    onChange({ file, uploading: false, url: publicUrl, error: '' })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (disabled) return
    const f = e.dataTransfer.files[0]
    if (f) upload(f)
  }

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-bold text-black/60 uppercase tracking-label block px-2">
        {label}
      </label>
      <div
        className={`relative group h-40 border transition-colors flex flex-col items-center justify-center text-center p-8 cursor-pointer
          ${disabled ? 'opacity-40 cursor-not-allowed bg-[#FAFAFA] border-black/5' : 'border-black/10 hover:border-black bg-white'}
          ${value.url ? 'border-black bg-[#FAFAFA]' : ''}`}
        onClick={() => !disabled && ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={ref}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
        />
        
        {value.uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
            <p className="text-[9px] uppercase tracking-label text-black/40 font-bold">Encrypting Transmission...</p>
          </div>
        ) : value.url ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-serif tracking-display text-black truncate max-w-[180px]">
                {value.file?.name ?? 'Document Secured'}
              </p>
              <p className="text-[9px] uppercase tracking-label text-black/60 mt-1 font-bold">Verified & Stored</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500">
            <div className="w-10 h-10 border border-black/10 flex items-center justify-center group-hover:border-black transition-colors">
              <Upload className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
            </div>
            <div>
              <p className="text-sm font-serif tracking-display text-black/60 group-hover:text-black transition-colors">Select Document</p>
            </div>
          </div>
        )}
        
        {value.error && (
          <p className="absolute bottom-4 text-[9px] font-bold text-black uppercase tracking-label">{value.error}</p>
        )}
      </div>
    </div>
  )
}

const emptyFile = (): { file: File | null, uploading: boolean, url: string, error: string } => ({ file: null, uploading: false, url: '', error: '' })

export default function SocietyRegistrationPage() {
  const router = useRouter()
  const [existing, setExisting] = useState<SocietyRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [societyName, setSocietyName] = useState('')
  const [rootArea, setRootArea] = useState('')
  const [noOfRooms, setNoOfRooms] = useState('')
  const [roadWidth, setRoadWidth] = useState('')
  const [hasRestriction, setHasRestriction] = useState(false)
  const [restrictionNotes, setRestrictionNotes] = useState('')
  const [buildPlan, setBuildPlan] = useState(emptyFile())
  const [plainTable, setPlainTable] = useState(emptyFile())
  const [assuredPlan, setAssuredPlan] = useState(emptyFile())

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('society_registrations')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        setExisting(data)
        setSocietyName(data.society_name)
        setRootArea(String(data.root_area))
        setNoOfRooms(String(data.no_of_rooms))
        setRoadWidth(String(data.road_width))
        setHasRestriction(data.restriction_of_laws)
        setRestrictionNotes(data.restriction_notes ?? '')
        if (data.build_plan_url) setBuildPlan({ ...emptyFile(), url: data.build_plan_url })
        if (data.plain_table_survey_url) setPlainTable({ ...emptyFile(), url: data.plain_table_survey_url })
        if (data.assured_plan_url) setAssuredPlan({ ...emptyFile(), url: data.assured_plan_url })
      }
      setLoading(false)
    }
    load()
  }, [])

  const { canEdit, timeLeft } = getEditTimeLeft(existing?.can_edit_until)
  const isLocked = !!existing && !canEdit

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLocked) return
    setError('')
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const payload = {
      user_id: user.id,
      society_name: societyName,
      root_area: Number(rootArea),
      no_of_rooms: Number(noOfRooms),
      road_width: Number(roadWidth),
      restriction_of_laws: hasRestriction,
      restriction_notes: hasRestriction ? restrictionNotes : null,
      build_plan_url: buildPlan.url || null,
      plain_table_survey_url: plainTable.url || null,
      assured_plan_url: assuredPlan.url || null,
    }

    let err
    if (existing) {
      const { error: updateErr } = await supabase.from('society_registrations').update(payload).eq('id', existing.id)
      err = updateErr
    } else {
      const { error: insertErr } = await supabase.from('society_registrations').insert(payload)
      err = insertErr
    }

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      router.push('/dashboard')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton h-10 w-64 border border-black/5" />
        <div className="skeleton h-[600px] border border-black/10" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Data Collection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Asset <br/><em className="italic font-light">Registry.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Initialize your structural protocol. Accurate intelligence ensures flawless architectural syncing and feasibility planning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          {error && (
            <div className="mb-8 p-6 border border-black text-black text-[10px] font-bold uppercase tracking-label bg-black/5">
              Error: {error}
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-label flex items-center gap-4">
              <CheckCircle2 className="w-4 h-4" />
              Protocol Initialized. Synchronizing with Neural Engine...
            </div>
          )}

          <form onSubmit={handleSubmit} className="border border-black/10 bg-white p-8 md:p-16 space-y-16">
            
            {/* Section 1 */}
            <div className="space-y-10">
              <div className="border-b border-black/10 pb-6">
                <span className="text-[10px] uppercase tracking-label text-black/40 block mb-2 font-bold">Section 01</span>
                <h3 className="text-2xl font-serif tracking-display text-black">Core Designations</h3>
              </div>
              
              <div className="space-y-5">
                <label className="text-[10px] font-bold text-black/60 uppercase tracking-label block px-2">
                  Structural Identity (Society Name)
                </label>
                <input
                  type="text"
                  required
                  disabled={isLocked}
                  value={societyName}
                  onChange={e => setSocietyName(e.target.value)}
                  placeholder="e.g. Alston Heights"
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <label className="text-[10px] font-bold text-black/60 uppercase tracking-label block px-2">
                    Root Area (SQ.FT)
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isLocked}
                    value={rootArea}
                    onChange={e => setRootArea(e.target.value)}
                    placeholder="12000"
                    className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-5">
                  <label className="text-[10px] font-bold text-black/60 uppercase tracking-label block px-2">
                    Unit Density
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isLocked}
                    value={noOfRooms}
                    onChange={e => setNoOfRooms(e.target.value)}
                    placeholder="42"
                    className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-10">
              <div className="border-b border-black/10 pb-6">
                <span className="text-[10px] uppercase tracking-label text-black/40 block mb-2 font-bold">Section 02</span>
                <h3 className="text-2xl font-serif tracking-display text-black">Topography & Compliance</h3>
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-bold text-black/60 uppercase tracking-label block px-2">
                  Access Road Width (FT)
                </label>
                <input
                  type="number"
                  required
                  disabled={isLocked}
                  value={roadWidth}
                  onChange={e => setRoadWidth(e.target.value)}
                  placeholder="30"
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div className="p-8 border border-black/10 bg-[#FAFAFA] space-y-6">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-colors
                    ${hasRestriction ? 'bg-black border-black' : 'border-black/20 bg-white group-hover:border-black'}`}>
                    {hasRestriction && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <span className="text-sm font-serif tracking-display text-black block mb-1">Regulatory Restrictions</span>
                    <span className="text-[10px] font-sans text-black/50 leading-relaxed block">
                      Acknowledge if the asset is subject to specific local laws, heritage constraints, or environmental acts.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    disabled={isLocked}
                    checked={hasRestriction}
                    onChange={e => setHasRestriction(e.target.checked)}
                  />
                </label>
                
                {hasRestriction && (
                  <div className="pt-4 border-t border-black/10 animate-fade-in">
                    <textarea
                      disabled={isLocked}
                      value={restrictionNotes}
                      onChange={e => setRestrictionNotes(e.target.value)}
                      placeholder="Specify restriction parameters..."
                      className="w-full bg-white border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors min-h-[100px] resize-y disabled:opacity-50"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-10">
              <div className="border-b border-black/10 pb-6">
                <span className="text-[10px] uppercase tracking-label text-black/40 block mb-2 font-bold">Section 03</span>
                <h3 className="text-2xl font-serif tracking-display text-black">DocuVault Attachments</h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <FileDropzone label="Structural Blueprint" value={buildPlan} onChange={setBuildPlan} disabled={isLocked} />
                <FileDropzone label="Topographical Plan" value={plainTable} onChange={setPlainTable} disabled={isLocked} />
                <FileDropzone label="Compliance Certificate" value={assuredPlan} onChange={setAssuredPlan} disabled={isLocked} />
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-8 border-t border-black/10 flex items-center justify-between">
              <div>
                {isLocked && existing && (
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-black/40">
                    <ShieldCheck className="w-4 h-4" />
                    Protocol Locked ({formatDateTime(existing.submitted_at)})
                  </div>
                )}
                {!isLocked && existing && (
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-[#D4AF37]">
                    <Clock className="w-4 h-4" />
                    Edit Window: {timeLeft}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || isLocked}
                className="bg-black text-white px-10 py-5 text-[11px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center gap-4 disabled:opacity-30"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {existing ? 'Update Protocol' : 'Initialize Protocol'} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-black p-10 text-white relative overflow-hidden group">
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-2xl font-serif tracking-display uppercase mb-6 relative z-10">Data Integrity</h3>
            <p className="text-sm font-sans text-white/50 leading-relaxed mb-8 relative z-10">
              The information provided here forms the foundational matrix for all structural feasibility and cost estimations. Absolute accuracy is paramount.
            </p>
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-label text-white/40 relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Engine Monitoring Active
            </div>
          </div>

          <div className="border border-black/10 bg-[#FAFAFA] p-10">
            <h3 className="text-lg font-serif tracking-display text-black mb-6">Security Protocol</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-black" />
                </div>
                <p className="text-xs font-sans text-black/60 leading-relaxed">
                  <strong className="font-serif tracking-display text-black text-sm block mb-1">End-to-End Encryption</strong>
                  All documents are encrypted at rest using AES-256 protocols.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-6 h-6 border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-black" />
                </div>
                <p className="text-xs font-sans text-black/60 leading-relaxed">
                  <strong className="font-serif tracking-display text-black text-sm block mb-1">48-Hour Edit Window</strong>
                  Modifications are permitted within 48 hours of initial transmission.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
