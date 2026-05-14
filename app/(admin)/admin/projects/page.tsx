import { FolderKanban, ShieldCheck, Activity, Box, Lock } from 'lucide-react'

export default function AdminProjectsPage() {
  return (
    <div className="space-y-16 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Development Execution</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Project <br/><em className="italic font-light">Matrix.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Real-time tracking of active architectural developments and structural milestones.
          </p>
        </div>
      </div>
      
      <div className="border border-black/10 bg-white p-24 text-center flex flex-col items-center justify-center relative">
        <div className="w-16 h-16 bg-black flex items-center justify-center mb-10 text-white shadow-xl">
          <FolderKanban className="w-6 h-6" />
        </div>
        
        <div className="max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-black/40" />
            <span className="text-[10px] font-bold text-black/60 uppercase tracking-label">Strategic Roadmap 2026</span>
          </div>
          <h2 className="text-3xl font-serif tracking-display text-black">Active Tracking Offline</h2>
          <p className="text-black/50 text-sm font-sans leading-relaxed">
            The project lifecycle management engine is currently undergoing structural calibration. Milestone tracking and real-time structural audits will be fully operational in the Phase 2 update.
          </p>
          
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-4 bg-[#FAFAFA] border border-black/10 flex items-center gap-4">
              <ShieldCheck className="w-4 h-4 text-black/60" />
              <span className="text-[9px] font-bold text-black/40 uppercase tracking-label">Encrypted Data Feed</span>
            </div>
            <div className="px-6 py-4 bg-[#FAFAFA] border border-black/10 flex items-center gap-4">
              <Box className="w-4 h-4 text-black/60" />
              <span className="text-[9px] font-bold text-black/40 uppercase tracking-label">Module Loading</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
