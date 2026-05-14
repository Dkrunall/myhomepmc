'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatDateTime, getStatusColor, getStatusLabel, getEditTimeLeft } from '@/lib/utils'
import {
  Building2, FileText, Bell, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Plus,
  Download, ChevronRight, Activity, ShieldCheck
} from 'lucide-react'
import type { SocietyRegistration, FeasibilityReport, Notification } from '@/types'

export default function UserDashboard() {
  const [userName, setUserName] = useState('')
  const [registration, setRegistration] = useState<SocietyRegistration | null>(null)
  const [reports, setReports] = useState<FeasibilityReport[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profile }, { data: reg }, { data: rpts }, { data: notifs }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('society_registrations').select('*').eq('user_id', user.id).order('submitted_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('feasibility_reports').select('*').eq('user_id', user.id).order('sent_at', { ascending: false }).limit(3),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])

      setUserName(profile?.full_name ?? '')
      setRegistration(reg ?? null)
      setReports(rpts ?? [])
      setNotifications(notifs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton h-10 w-64 border border-black/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-l border-black/10">
          {[1,2,3].map(i => <div key={i} className="skeleton h-40 border-b border-r border-black/10" />)}
        </div>
      </div>
    )
  }

  const { canEdit, timeLeft } = getEditTimeLeft(registration?.can_edit_until)

  const statusIcon = {
    submitted:    <Clock className="w-3 h-3 text-black" />,
    under_review: <AlertCircle className="w-3 h-3 text-[#D4AF37]" />,
    approved:     <CheckCircle2 className="w-3 h-3 text-black" />,
    rejected:     <AlertCircle className="w-3 h-3 text-black" />,
  }

  const statusTints = {
    submitted:    'border-black text-black',
    under_review: 'border-[#D4AF37] text-[#D4AF37]',
    approved:     'border-black text-black',
    rejected:     'border-black text-black opacity-50',
  }

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Operational Status</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display leading-tight text-black">
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}
            <em className="italic font-light">
              {userName ? `, ${userName.split(' ')[0]}` : ''}
            </em>
          </h1>
          <p className="text-black/50 font-serif text-lg mt-4">
            Project Command: <span className="text-black">{registration ? getStatusLabel(registration.status) : 'Awaiting Registry'}</span>
          </p>
        </div>
        
        {!registration && (
          <Link href="/society-registration" className="bg-black text-white px-8 py-5 text-[10px] uppercase tracking-label hover:bg-black/80 transition-colors flex items-center gap-4 group">
            Initialize Project <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Editorial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-black/10">
        {[
          { 
            label: 'Asset Registry', 
            value: registration ? getStatusLabel(registration.status) : 'Inactive',
            num: '01'
          },
          { 
            label: 'Engineering Vault', 
            value: reports.length > 0 ? `${reports.length} Logs` : 'Empty',
            num: '02'
          },
          { 
            label: 'System Alerts', 
            value: notifications.filter(n => !n.is_read).length > 0 ? `${notifications.filter(n => !n.is_read).length} Unread` : 'Clear',
            num: '03'
          },
        ].map((card) => (
          <div key={card.label} className="p-10 border-b border-r border-black/10 bg-white hover:bg-[#FAFAFA] transition-colors duration-500 group">
            <span className="text-[10px] uppercase tracking-label text-black/40 block mb-12">{card.num}</span>
            <p className="text-3xl font-serif tracking-display text-black mb-3">{card.value}</p>
            <p className="text-[10px] uppercase tracking-label text-black/60">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Registration Protocol Card */}
          <div className="border border-black/10 bg-white">
            <div className="p-8 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <h2 className="text-2xl font-serif tracking-display text-black mb-1">Project Overview</h2>
                  <p className="text-[10px] uppercase tracking-label text-black/40">Structural protocol identity</p>
                </div>
              </div>
              {registration && (
                <div className={`inline-flex items-center gap-3 px-4 py-2 border text-[9px] font-bold uppercase tracking-label ${statusTints[registration.status]}`}>
                  {statusIcon[registration.status]}
                  {getStatusLabel(registration.status)}
                </div>
              )}
            </div>

            <div className="p-8">
              {!registration ? (
                <div className="text-center py-16">
                  <p className="text-xl font-serif tracking-display text-black mb-4">No active protocol</p>
                  <p className="text-sm font-sans text-black/50 mb-8 max-w-sm mx-auto">
                    Initialize your society registration to activate the NestVault intelligence matrix.
                  </p>
                  <Link href="/society-registration" className="inline-flex items-center gap-3 border border-black px-6 py-4 text-[10px] uppercase tracking-label hover:bg-black hover:text-white transition-colors group">
                    Begin Initialization <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="border border-black/5 p-6 bg-[#FAFAFA]">
                      <p className="text-[9px] uppercase tracking-label text-black/40 mb-3">Asset Designation</p>
                      <p className="text-lg font-serif tracking-display text-black">{registration.society_name}</p>
                    </div>
                    <div className="border border-black/5 p-6 bg-[#FAFAFA]">
                      <p className="text-[9px] uppercase tracking-label text-black/40 mb-3">Structural Footprint</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-serif tracking-display text-black">{registration.root_area}</p>
                        <span className="text-[9px] font-bold text-black/40 tracking-widest">SQ.FT</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/10 pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {canEdit ? (
                        <div className="flex items-center gap-3 border border-[#D4AF37] px-4 py-2 text-[9px] font-bold uppercase tracking-label text-[#D4AF37]">
                          <Clock className="w-3 h-3" />
                          Edit Window: {timeLeft}
                        </div>
                      ) : (
                        <p className="text-[10px] uppercase tracking-label text-black/40">Timestamp: {formatDateTime(registration.submitted_at)}</p>
                      )}
                    </div>
                    
                    {canEdit ? (
                      <Link href="/society-registration" className="text-[10px] uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                        Modify Protocol <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button disabled className="text-[10px] uppercase tracking-label text-black/20 flex items-center gap-2 cursor-not-allowed">
                        Protocol Locked <ShieldCheck className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DocuVault Preview */}
          <div className="border border-black/10 bg-white">
            <div className="p-8 border-b border-black/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif tracking-display text-black mb-1">DocuVault</h2>
                <p className="text-[10px] uppercase tracking-label text-black/40">Recent technical dispatches</p>
              </div>
              <Link href="/documents" className="text-[10px] uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                View Archive <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="divide-y divide-black/5">
              {reports.length === 0 ? (
                <div className="p-16 text-center">
                  <p className="text-sm font-sans text-black/50">No intelligence reports dispatched yet.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="p-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors group">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 border border-black/10 bg-white flex items-center justify-center">
                        <FileText className="w-4 h-4 text-black/50 group-hover:text-black transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-serif tracking-display text-black group-hover:text-[#D4AF37] transition-colors">
                          {report.cover_message.slice(0, 50)}{report.cover_message.length > 50 ? '…' : ''}
                        </p>
                        <p className="text-[9px] uppercase tracking-label text-black/40 mt-1">{formatDateTime(report.sent_at)}</p>
                      </div>
                    </div>
                    <a href={report.file_url} target="_blank" className="p-3 border border-black/10 text-black/40 hover:text-black hover:border-black transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* System Intelligence Panel */}
        <div className="space-y-12">
          {/* Minimal Neural Engine */}
          <div className="bg-black p-10 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[9px] uppercase tracking-label text-white/50 block mb-6">Engine Active</span>
              <h3 className="text-3xl font-serif tracking-display mb-4">Neural <br/><em className="italic text-white/70">Intelligence</em></h3>
              <p className="text-sm font-sans text-white/50 leading-relaxed mb-8 border-l border-white/20 pl-4">
                AI-driven structural analysis is currently active, scanning your parameters against 500+ past projects.
              </p>
              <button className="border border-white/20 text-white px-6 py-4 text-[9px] uppercase tracking-label hover:bg-white hover:text-black transition-colors w-full text-left flex justify-between items-center">
                Access Logs <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="border border-black/10 bg-white">
            <div className="p-8 border-b border-black/10">
              <h3 className="text-xl font-serif tracking-display text-black mb-1">System Alerts</h3>
              <p className="text-[10px] uppercase tracking-label text-black/40">Latest transmissions</p>
            </div>
            <div className="divide-y divide-black/5">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs font-sans text-black/40">No pending alerts.</p>
                </div>
              ) : (
                notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="p-6 flex gap-4">
                    <div className="mt-1">
                      {notif.is_read ? (
                        <div className="w-2 h-2 border border-black/20 rounded-full" />
                      ) : (
                        <div className="w-2 h-2 bg-black rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-sans leading-relaxed ${notif.is_read ? 'text-black/60' : 'text-black font-semibold'}`}>
                        {notif.title}
                      </p>
                      <p className="text-[9px] uppercase tracking-label text-black/30 mt-2">{formatDateTime(notif.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-black/10">
              <Link href="/notifications" className="block w-full text-center py-3 text-[9px] uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors">
                View All Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
