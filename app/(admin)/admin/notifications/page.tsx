import { Bell, Inbox } from 'lucide-react'

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-16 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">System Monitoring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Admin <br/><em className="italic font-light">Alerts.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            High-level system alerts and platform security notifications.
          </p>
        </div>
      </div>
      
      <div className="border border-black/10 bg-[#FAFAFA] p-24 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center mb-6">
          <Inbox className="w-6 h-6 text-black/20" />
        </div>
        <h3 className="text-2xl font-serif tracking-display text-black mb-2">No Active Alerts</h3>
        <p className="text-[10px] uppercase tracking-label text-black/40 font-bold max-w-xs mx-auto">
          The system is operating optimally. No administrative action required at this time.
        </p>
      </div>
    </div>
  )
}
