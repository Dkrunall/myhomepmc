'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { formatDateTime, getEditTimeLeft, getStatusColor, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Eye, X, Download, CheckCircle2, XCircle, Clock,
  Filter, Search, ExternalLink, ShieldCheck, Map,
  Ruler, HardHat, Info, ArrowRight, Building2,
  FileText, Activity
} from 'lucide-react'
import type { SocietyRegistration, RegistrationStatus } from '@/types'

type RegWithProfile = SocietyRegistration & {
  profiles: { full_name: string | null; mobile: string | null } | null
}

function RegistrationsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<RegWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<RegistrationStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedReg, setSelectedReg] = useState<RegWithProfile | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const loadRegistrations = useCallback(async () => {
    const supabase = createClient()
    let query = supabase.from('society_registrations')
      .select('*, profiles(full_name, mobile)')
      .order('submitted_at', { ascending: false })

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus)
    }

    const { data } = await query
    setRegistrations((data as RegWithProfile[]) || [])
    setLoading(false)

    // Auto-open from URL param
    const paramId = searchParams.get('id')
    if (paramId && data) {
      const found = (data as RegWithProfile[]).find(r => r.id === paramId)
      if (found) {
        setSelectedReg(found)
        setReviewNotes(found.admin_notes || '')
      }
    }
  }, [filterStatus, searchParams])

  useEffect(() => { loadRegistrations() }, [loadRegistrations])

  const updateStatus = async (regId: string, status: RegistrationStatus) => {
    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('society_registrations').update({
        status,
        admin_notes: reviewNotes || null,
      }).eq('id', regId)

      if (error) { toast.error(error.message); return }

      // Send notification to user
      const reg = registrations.find(r => r.id === regId)
      if (reg) {
        await supabase.from('notifications').insert({
          user_id: reg.user_id,
          type: 'status_changed',
          title: `Registration ${getStatusLabel(status)}`,
          message: `Your registration for "${reg.society_name}" has been ${getStatusLabel(status).toLowerCase()}.${reviewNotes ? ` Note: ${reviewNotes}` : ''}`,
          is_read: false,
        })
      }

      toast.success(`Registration ${getStatusLabel(status)}`)
      setSelectedReg(null)
      setReviewNotes('')
      loadRegistrations()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const filtered = registrations.filter(r => {
    const searchLower = search.toLowerCase()
    return (
      r.society_name.toLowerCase().includes(searchLower) ||
      (r.profiles?.full_name || '').toLowerCase().includes(searchLower)
    )
  })

  const statusOptions: (RegistrationStatus | 'all')[] = ['all', 'submitted', 'under_review', 'approved', 'rejected']

  const statusTints = {
    submitted:    'border-black text-black',
    under_review: 'border-[#D4AF37] text-[#D4AF37]',
    approved:     'border-black text-black',
    rejected:     'border-black text-black opacity-50',
  }

  return (
    <div className="space-y-16 animate-fade-in pb-32">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Structural Asset Control</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Master <br/><em className="italic font-light">Registry.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Authentication and verification protocol for strategic structural assets.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search registry by identity or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-black/10 pl-16 pr-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>
        <div className="flex items-center gap-4 bg-white border border-black/10 px-6 py-2">
          <Filter className="w-4 h-4 text-black/40" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RegistrationStatus | 'all')}
            className="bg-transparent text-black font-bold text-[10px] uppercase tracking-label outline-none cursor-pointer py-4 pr-6 appearance-none"
          >
            {statusOptions.map(s => (
               <option key={s} value={s} className="bg-white">
                 {s === 'all' ? 'All Operational States' : getStatusLabel(s)}
               </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-black/10 bg-white">
        {loading ? (
          <div className="p-10 space-y-6">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 border border-black/5" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FAFAFA] border border-black/10 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-black/20" />
            </div>
            <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">Registry database empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-black/10">
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Asset Holder</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Project Identity</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Entry Timestamp</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Status Protocol</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((reg) => {
                  const editInfo = getEditTimeLeft(reg.can_edit_until)
                  return (
                    <tr key={reg.id} className="hover:bg-[#FAFAFA] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-[11px] font-bold text-black/40 bg-white">
                            {reg.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-serif tracking-display text-black">{reg.profiles?.full_name || 'Anonymous'}</p>
                            <p className="text-[9px] font-bold text-black/40 uppercase tracking-label mt-1">{reg.profiles?.mobile || 'No Link'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-serif tracking-display text-black">{reg.society_name}</p>
                        <p className="text-[9px] font-bold text-black/40 uppercase tracking-label mt-1">{reg.root_area} SQ.FT</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[9px] font-bold text-black/40 uppercase tracking-label">{formatDateTime(reg.submitted_at)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 text-[9px] font-bold uppercase tracking-label border ${statusTints[reg.status as keyof typeof statusTints] || 'border-black'}`}>
                          {getStatusLabel(reg.status)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => { setSelectedReg(reg); setReviewNotes(reg.admin_notes || '') }}
                          className="border border-black px-6 py-3 text-[9px] font-bold uppercase tracking-label hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-3 h-3" /> Authenticate
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl h-full overflow-y-auto border-l border-black/10 shadow-2xl animate-slide-in-right">
            
            {/* Modal Header */}
            <div className="p-10 border-b border-black/10 bg-[#FAFAFA] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif tracking-display text-black mb-2">{selectedReg.society_name}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-label text-black/40">Identity Verification: {selectedReg.profiles?.full_name || 'Anonymous'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="p-3 text-black/40 hover:text-black hover:bg-black/5 transition-colors border border-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 space-y-16">
              {/* Asset Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-l border-black/10">
                {[
                  { label: 'Asset Magnitude', icon: Ruler, value: `${selectedReg.root_area} SQ.FT` },
                  { label: 'Unit Capacity', icon: HardHat, value: selectedReg.no_of_rooms },
                  { label: 'Access Protocol', icon: Map, value: `${selectedReg.road_width} FT ROAD` },
                ].map((spec) => (
                  <div key={spec.label} className="p-8 bg-white border-b border-r border-black/10">
                    <div className="flex items-center gap-3 mb-6">
                      <spec.icon className="w-4 h-4 text-black/40" />
                      <span className="text-[9px] font-bold uppercase tracking-label text-black/40">{spec.label}</span>
                    </div>
                    <p className="text-3xl font-serif tracking-display text-black">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Status & Compliance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 block">Operational State</label>
                  <div className={`p-8 border flex items-center justify-between ${getStatusColor(selectedReg.status).includes('blue') ? 'bg-blue-50 border-blue-200 text-blue-800' : getStatusColor(selectedReg.status).includes('emerald') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : getStatusColor(selectedReg.status).includes('red') ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#FAFAFA] border-black/10 text-black'}`}>
                    <span className="text-sm font-serif tracking-display">{getStatusLabel(selectedReg.status)}</span>
                    <Activity className="w-5 h-5 opacity-40" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 block">Regulatory Compliance</label>
                  <div className={`p-8 border ${selectedReg.restriction_of_laws ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-center gap-4">
                      <ShieldCheck className={`w-5 h-5 ${selectedReg.restriction_of_laws ? 'text-red-600' : 'text-emerald-600'}`} />
                      <div>
                        <span className={`text-sm font-serif tracking-display block ${selectedReg.restriction_of_laws ? 'text-red-800' : 'text-emerald-800'}`}>
                          {selectedReg.restriction_of_laws ? 'Compliance Alert Detected' : 'Regulatory Standards Met'}
                        </span>
                        {selectedReg.restriction_of_laws && (
                          <p className="text-[10px] font-bold uppercase tracking-label text-red-600/60 mt-2">{selectedReg.restriction_notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Vault */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 block">Documentation Intelligence</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Structural Build Plan', url: selectedReg.build_plan_url },
                    { label: 'PTS Survey', url: selectedReg.plain_table_survey_url },
                    { label: 'Assured Site Plan', url: selectedReg.assured_plan_url },
                  ].map((doc) => (
                    <div key={doc.label} className="p-6 bg-white border border-black/10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-10 h-10 border flex items-center justify-center ${doc.url ? 'bg-black border-black text-white' : 'bg-[#FAFAFA] border-black/5 text-black/20'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-serif tracking-display text-black">{doc.label}</p>
                      </div>
                      {doc.url ? (
                        <div className="flex items-center gap-3">
                          <a href={doc.url} download className="flex-1 px-4 py-3 bg-[#FAFAFA] border border-black/10 text-[9px] font-bold uppercase tracking-label text-black hover:border-black hover:bg-white transition-colors flex items-center justify-center">
                            <Download className="w-3 h-3 mr-2" /> DL
                          </a>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-[#FAFAFA] border border-black/10 text-black hover:border-black hover:bg-white transition-colors flex items-center justify-center">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="py-4 border border-dashed border-black/10 bg-[#FAFAFA] text-center">
                          <span className="text-[9px] font-bold uppercase tracking-label text-black/20">Awaiting File</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Console */}
              <div className="space-y-8 border-t border-black/10 pt-16">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 block">Executive Protocol Notes</label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-black/10 p-8 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors min-h-[150px]"
                    placeholder="Enter strategic review notes and authentication feedback..."
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <button
                    onClick={() => updateStatus(selectedReg.id, 'under_review')}
                    disabled={isUpdating}
                    className="px-6 py-5 bg-white border border-black text-black text-[10px] font-bold uppercase tracking-label hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <Clock className="w-4 h-4" /> Initiate Review
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReg.id, 'approved')}
                    disabled={isUpdating}
                    className="px-6 py-5 bg-black border border-black text-white text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Authorize Asset
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReg.id, 'rejected')}
                    disabled={isUpdating}
                    className="px-6 py-5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-label hover:bg-red-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <XCircle className="w-4 h-4" /> Terminate Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RegistrationsPage() {
  return (
    <Suspense fallback={<div className="p-10"><div className="skeleton h-96 border border-black/10" /></div>}>
      <RegistrationsContent />
    </Suspense>
  )
}
