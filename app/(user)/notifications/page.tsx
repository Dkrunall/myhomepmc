'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { Bell, CheckCheck, Building2, FileText, Megaphone, Inbox, Clock, ChevronRight } from 'lucide-react'
import type { Notification } from '@/types'

const typeIcon = {
  status_changed: Building2,
  report_received: FileText,
  general: Megaphone,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setNotifications(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function markAsRead(id: string) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  async function markAllAsRead() {
    setMarkingAll(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMarkingAll(false); return }

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setMarkingAll(false)
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="skeleton h-10 w-48 border border-black/5" />
        <div className="grid grid-cols-1 gap-4 border-t border-black/10">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 border-b border-black/10" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-32">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Vault Transmissions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">System <br/><em className="italic font-light">Alerts.</em></h1>
          <p className="text-black/50 font-serif text-lg mt-4">
            {unreadCount > 0 ? (
              <>You have <strong className="text-black">{unreadCount} pending</strong> protocol updates.</>
            ) : 'All transmissions have been successfully processed.'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={markingAll}
            className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors disabled:opacity-30 pb-2"
          >
            <CheckCheck className="w-4 h-4" />
            Clear Registry
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#FAFAFA] border border-black/10 p-24 flex flex-col items-center justify-center text-center gap-8">
          <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center">
            <Inbox className="w-6 h-6 text-black/20" />
          </div>
          <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">No transmissions in queue</p>
        </div>
      ) : (
        <div className="border-t border-black/10">
          {notifications.map((n) => {
            const Icon = typeIcon[n.type as keyof typeof typeIcon] || Megaphone
            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`border-b border-black/10 p-8 md:p-10 transition-colors cursor-pointer flex items-center justify-between gap-8 group 
                  ${n.is_read ? 'bg-white hover:bg-[#FAFAFA]' : 'bg-[#FAFAFA] hover:bg-white border-l-4 border-l-black'}`}
              >
                <div className="flex items-center gap-8 flex-1">
                  <div className={`w-12 h-12 border flex items-center justify-center flex-shrink-0 transition-colors ${n.is_read ? 'border-black/10 bg-white' : 'border-black bg-black text-white'}`}>
                    <Icon className={`w-4 h-4 ${n.is_read ? 'text-black/40' : 'text-white'}`} />
                  </div>
                  <div className="space-y-3">
                    <p className={`text-xl font-serif tracking-display ${n.is_read ? 'text-black/50' : 'text-black'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-[9px] font-bold text-black/40 uppercase tracking-label">{formatDateTime(n.created_at)}</p>
                      {!n.is_read && <div className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-label px-2 py-0.5 border border-[#D4AF37]">Unread</div>}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${n.is_read ? 'text-black/20' : 'text-black'}`} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
