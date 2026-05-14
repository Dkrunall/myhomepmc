import { HardHat, ShieldAlert, Construction, Lock } from 'lucide-react'

export default function AdminArchitectsPage() {
  return (
    <div className="space-y-16 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Professional Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Architect <br/><em className="italic font-light">Panel.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Strategic architect management and project assignment console.
          </p>
        </div>
      </div>
      
      <div className="border border-black/10 bg-white p-24 text-center flex flex-col items-center justify-center relative">
        <div className="w-16 h-16 bg-black flex items-center justify-center mb-10 text-white shadow-xl">
          <Lock className="w-6 h-6" />
        </div>
        
        <div className="max-w-md space-y-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Construction className="w-4 h-4 text-black/40" />
            <span className="text-[10px] font-bold text-black/60 uppercase tracking-label">Development Phase 2.0</span>
          </div>
          <h2 className="text-3xl font-serif tracking-display text-black">Console Encrypted</h2>
          <p className="text-black/50 text-sm font-sans leading-relaxed">
            The Architect Management Matrix is currently being synchronized with our strategic portfolio system. Full operational capability is scheduled for the Phase 2 deployment.
          </p>
          
          <div className="pt-8 flex items-center justify-center">
            <div className="px-6 py-4 bg-[#FAFAFA] border border-black/10 flex items-center gap-4">
              <ShieldAlert className="w-4 h-4 text-black/60" />
              <span className="text-[9px] font-bold text-black/40 uppercase tracking-label">Awaiting Authorization Key</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
