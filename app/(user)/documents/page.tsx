'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { FileText, Download, Inbox, ExternalLink, Search, ArrowRight } from 'lucide-react'
import type { FeasibilityReport } from '@/types'

export default function DocumentsPage() {
  const [reports, setReports] = useState<FeasibilityReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('feasibility_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })

      setReports(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton h-10 w-48 border border-black/5" />
        <div className="grid grid-cols-1 gap-6">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32 border border-black/10" />)}
        </div>
      </div>
    )
  }

  const filtered = reports.filter(r =>
    r.cover_message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">DocuVault Archive</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Vault <br/><em className="italic font-light">Library.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Engineering intelligence and structural feasibility reports synchronized for your project.
          </p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search archive..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-black/10 px-12 py-4 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
          />
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-[#FAFAFA] border border-black/10 p-24 flex flex-col items-center justify-center text-center gap-8">
          <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-black/20" />
          </div>
          <div className="max-w-md space-y-4">
            <h3 className="text-3xl font-serif tracking-display text-black">Library Empty</h3>
            <p className="text-black/50 text-sm font-sans leading-relaxed">
              Technical reports and feasibility blueprints will appear here once your PMC architect dispatches them to the vault.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-t border-black/10">
          {filtered.map((report, index) => (
            <div key={report.id} className="border-b border-black/10 bg-white hover:bg-[#FAFAFA] transition-colors group">
              <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-start gap-8 flex-1">
                  <div className="w-12 h-12 bg-white border border-black/10 flex items-center justify-center flex-shrink-0 group-hover:border-black transition-colors">
                    <FileText className="w-4 h-4 text-black/40 group-hover:text-black transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-black uppercase tracking-label border border-black/10 px-3 py-1 bg-white">
                        Technical Report
                      </span>
                      <p className="text-[9px] font-bold text-black/40 uppercase tracking-label">Log ID: {report.id.slice(0, 8)}</p>
                    </div>
                    <h3 className="text-2xl font-serif tracking-display text-black leading-snug max-w-2xl">
                      {report.cover_message}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className="text-[9px] font-bold text-black/40 uppercase tracking-label">
                        Timestamp: {formatDateTime(report.sent_at)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center sm:flex-col sm:items-end">
                  <a
                    href={report.file_url}
                    target="_blank"
                    className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center gap-4"
                  >
                    Secure Link <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-16 text-center border-b border-black/10">
              <p className="text-sm font-serif tracking-display text-black/50">No reports matched your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
