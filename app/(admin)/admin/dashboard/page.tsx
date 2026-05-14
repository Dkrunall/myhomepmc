'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import {
  Building2,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
  Activity,
  Zap,
  Clock
} from 'lucide-react'
import type { AdminStats, SocietyRegistration } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalRegistrations: 0,
    pendingReview: 0,
    reportsSent: 0,
    activeLeads: 0,
  })
  const [recentRegs, setRecentRegs] = useState<(SocietyRegistration & { profiles: { full_name: string | null } | null })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [
        { count: totalRegs },
        { count: pendingCount },
        { count: reportsCount },
        { count: leadsCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from('society_registrations').select('*', { count: 'exact', head: true }),
        supabase.from('society_registrations').select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'under_review']),
        supabase.from('feasibility_reports').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true })
          .in('status', ['new', 'contacted']),
        supabase.from('society_registrations')
          .select('*, profiles(full_name)')
          .order('submitted_at', { ascending: false })
          .limit(8),
      ])
      setStats({
        totalRegistrations: totalRegs || 0,
        pendingReview: pendingCount || 0,
        reportsSent: reportsCount || 0,
        activeLeads: leadsCount || 0,
      })
      setRecentRegs((recent as (SocietyRegistration & { profiles: { full_name: string | null } | null })[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const metricCards = [
    {
      label: 'Strategic Assets',
      value: stats.totalRegistrations,
      num: '01'
    },
    {
      label: 'Review Pipeline',
      value: stats.pendingReview,
      num: '02'
    },
    {
      label: 'Reports Dispatched',
      value: stats.reportsSent,
      num: '03'
    },
    {
      label: 'Live Prospects',
      value: stats.activeLeads,
      num: '04'
    },
  ]

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-l border-black/10">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 border-b border-r border-black/10" />)}
        </div>
        <div className="skeleton h-[500px] border border-black/10" />
      </div>
    )
  }

  const statusTints = {
    submitted:    'border-black text-black',
    under_review: 'border-[#D4AF37] text-[#D4AF37]',
    approved:     'border-black text-black',
    rejected:     'border-black text-black opacity-50',
  }

  return (
    <div className="space-y-16 animate-fade-in pb-32">
      
      <div className="flex items-center gap-4">
        <div className="w-10 h-[1px] bg-black/30" />
        <span className="text-[10px] font-bold uppercase tracking-label text-black/60">System Alpha</span>
      </div>

      <div className="flex justify-between items-end">
        <h1 className="text-4xl md:text-6xl font-serif tracking-display leading-tight text-black">
          Control <br/><em className="italic font-light">Center.</em>
        </h1>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span className="text-[9px] uppercase tracking-label text-black/60 font-bold">Live Data Feed</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-black/10">
        {metricCards.map((card) => (
          <div key={card.label} className="p-10 border-b border-r border-black/10 bg-white hover:bg-[#FAFAFA] transition-colors duration-500 group">
            <span className="text-[10px] uppercase tracking-label text-black/40 block mb-12 font-bold">{card.num}</span>
            <p className="text-4xl font-serif tracking-display text-black mb-3">{card.value}</p>
            <p className="text-[10px] uppercase tracking-label text-black/60 font-bold">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Feed: Recent Registrations */}
        <div className="lg:col-span-8 border border-black/10 bg-white">
          <div className="p-8 border-b border-black/10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif tracking-display text-black mb-1">Registry Pulse</h2>
              <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">Inbound structural protocols</p>
            </div>
            <Link href="/admin/registrations" className="text-[10px] uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-bold">
              Archive <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-black/10">
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Principal / Asset</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Dimensions</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Protocol Status</th>
                  <th className="px-8 py-6 text-[9px] font-bold text-black/60 uppercase tracking-label">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentRegs.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#FAFAFA] transition-colors group cursor-pointer" onClick={() => window.location.href=`/admin/registrations/${reg.id}`}>
                    <td className="px-8 py-6">
                      <p className="text-sm font-serif tracking-display text-black group-hover:text-[#D4AF37] transition-colors">{reg.society_name}</p>
                      <p className="text-[9px] uppercase tracking-label text-black/40 mt-1">{reg.profiles?.full_name || 'Unknown'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-serif tracking-display text-black">{reg.root_area}</span>
                        <span className="text-[8px] text-black/40 uppercase tracking-widest font-bold">SQ.FT</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1 text-[9px] font-bold uppercase tracking-label border ${statusTints[reg.status as keyof typeof statusTints]}`}>
                        {getStatusLabel(reg.status)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[9px] uppercase tracking-label text-black/40">
                      {formatDateTime(reg.submitted_at)}
                    </td>
                  </tr>
                ))}
                {recentRegs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center text-sm font-serif text-black/40">
                      No recent registry activity
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 space-y-12">
          {/* Quick Dispatch */}
          <div className="bg-black p-10 text-white relative overflow-hidden group">
            <Activity className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-2xl font-serif tracking-display mb-4 relative z-10">Dispatch <br/><em className="italic font-light text-white/60">Intelligence</em></h3>
            <p className="text-sm font-sans text-white/50 leading-relaxed mb-8 relative z-10 border-l border-white/20 pl-4">
              Transmit validated feasibility reports and structural blueprints directly to the homeowner's vault.
            </p>
            <Link href="/admin/send-report" className="border border-white/20 text-white px-6 py-4 text-[9px] font-bold uppercase tracking-label hover:bg-white hover:text-black transition-colors w-full text-left flex justify-between items-center relative z-10">
              Initialize Dispatch <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border border-black/10 bg-white">
            <div className="p-8 border-b border-black/10">
              <h3 className="text-xl font-serif tracking-display text-black mb-1">System Notice</h3>
              <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">Operational protocol</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-black" />
                </div>
                <div>
                  <p className="text-sm font-serif tracking-display text-black mb-1">SLA Compliance</p>
                  <p className="text-[11px] font-sans text-black/50 leading-relaxed">
                    All new registrations must receive preliminary technical clearance within 48 hours to maintain Platinum standard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
