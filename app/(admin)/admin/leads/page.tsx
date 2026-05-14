'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  Plus, Search, Users, X, UserPlus, Mail, Phone, 
  MapPin, Briefcase, IndianRupee, MessageSquare, 
  ChevronRight, Filter, Target, Calendar
} from 'lucide-react'
import type { Lead, LeadStatus } from '@/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '', email: '', mobile: '', project_type: '', budget_range: '', location: '', message: '',
  })
  const [saving, setSaving] = useState(false)

  const loadLeads = async () => {
    const supabase = createClient()
    let q = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    const { data } = await q
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { loadLeads() }, [filterStatus])

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    const supabase = createClient()
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    toast.success('Lead status updated')
  }

  const createLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.mobile) {
      toast.error('Name, email and mobile are required')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('leads').insert({ ...newLead, status: 'new' })
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Lead created')
    setShowModal(false)
    setNewLead({ name: '', email: '', mobile: '', project_type: '', budget_range: '', location: '', message: '' })
    loadLeads()
    setSaving(false)
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusOptions: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'converted', 'closed']

  return (
    <div className="space-y-16 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Strategic Growth Matrix</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Project <br/><em className="italic font-light">Pipeline.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Strategically manage and convert architectural inquiries into reality.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-8 py-5 text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center gap-4"
        >
          <Plus className="w-4 h-4" /> Add Prospect
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search leads by identity or credential..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-black/10 pl-16 pr-8 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>
        <div className="flex items-center gap-4 bg-white border border-black/10 px-6 py-2">
          <Filter className="w-4 h-4 text-black/40" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LeadStatus | 'all')}
            className="bg-transparent text-black font-bold text-[10px] uppercase tracking-label outline-none cursor-pointer py-4 pr-6 appearance-none"
          >
            {statusOptions.map(s => (
              <option key={s} value={s} className="bg-white">
                {s === 'all' ? 'All Prospect States' : getStatusLabel(s)}
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
              <Target className="w-6 h-6 text-black/20" />
            </div>
            <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">Lead acquisition stream inactive</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-black/10">
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Asset Holder</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Contact Network</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Structural Profile</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Lifecycle Status</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Log Entry</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label text-right">Operational Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-[11px] font-bold text-black/40 bg-white">
                          {lead.name[0]?.toUpperCase() || 'L'}
                        </div>
                        <span className="text-sm font-serif tracking-display text-black">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className="w-3 h-3 text-black/40" />
                          <span className="text-[10px] font-bold uppercase tracking-label text-black/60">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-3 h-3 text-black/40" />
                          <span className="text-[10px] font-bold uppercase tracking-label text-black/60">{lead.mobile}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-3 h-3 text-black/40" />
                          <span className="text-[9px] font-bold uppercase tracking-label text-black/60">{lead.project_type || 'Unspecified'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-3 h-3 text-black/40" />
                          <span className="text-[9px] font-bold uppercase tracking-label text-black/60">{lead.location || 'Unspecified'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="bg-[#FAFAFA] border border-black/10 px-3 py-2 text-[9px] font-bold uppercase tracking-label text-black outline-none cursor-pointer"
                      >
                        {statusOptions.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[9px] font-bold uppercase tracking-label text-black/40">{formatDateTime(lead.created_at)}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {lead.message && (
                        <button className="border border-black/10 px-4 py-2 text-[9px] font-bold uppercase tracking-label text-black hover:border-black transition-colors"
                          onClick={() => alert(`Message from ${lead.name}:\n\n${lead.message}`)}
                        >
                          View Brief
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-black/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto border shadow-2xl animate-scale-in">
            <div className="px-10 py-8 border-b border-black/10 flex items-center justify-between bg-[#FAFAFA] sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-serif tracking-display text-black mb-1">New Prospect</h2>
                <p className="text-[10px] font-bold uppercase tracking-label text-black/40">Manual lead entry</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-black/40 hover:text-black hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Full Name *</label>
                  <input
                    type="text"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Email *</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Mobile *</label>
                  <input
                    type="tel"
                    value={newLead.mobile}
                    onChange={e => setNewLead({ ...newLead, mobile: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Location</label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={e => setNewLead({ ...newLead, location: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Project Type</label>
                  <select
                    value={newLead.project_type}
                    onChange={e => setNewLead({ ...newLead, project_type: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Select Protocol</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Renovation">Renovation</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Budget Range</label>
                  <select
                    value={newLead.budget_range}
                    onChange={e => setNewLead({ ...newLead, budget_range: e.target.value })}
                    className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors cursor-pointer"
                  >
                    <option value="">Select Magnitude</option>
                    <option value="10L - 50L">10L - 50L</option>
                    <option value="50L - 1Cr">50L - 1Cr</option>
                    <option value="1Cr+">1Cr+</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2">Strategic Brief / Message</label>
                <textarea
                  rows={4}
                  value={newLead.message}
                  onChange={e => setNewLead({ ...newLead, message: e.target.value })}
                  className="w-full bg-[#FAFAFA] border border-black/10 px-6 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-8 border-t border-black/10 flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 border border-black/10 text-[10px] font-bold uppercase tracking-label text-black hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createLead}
                  disabled={saving}
                  className="px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors disabled:opacity-30"
                >
                  {saving ? 'Processing...' : 'Register Prospect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
