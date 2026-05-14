import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NestVault — Secure Access',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Left: Immersive Architectural Visual (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-black/10 bg-[#FAFAFA] p-8">
        <div className="absolute inset-8 border border-black/10 overflow-hidden bg-white z-0">
          <img 
            src="/auth-bg.png" 
            alt="Architectural Luxury" 
            className="w-full h-full object-cover grayscale opacity-80" 
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div>
            <Link href="/" className="flex items-center gap-4 group bg-white/90 backdrop-blur-sm p-4 inline-flex border border-black/10">
              <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif text-lg leading-none pt-0.5 transition-transform duration-500 group-hover:scale-95">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-display text-black">
                  NestVault.
                </span>
              </div>
            </Link>
          </div>
          
          <div className="max-w-md space-y-6 bg-white/90 backdrop-blur-sm p-8 border border-black/10">
            <h2 className="text-4xl font-serif text-black leading-tight tracking-display">
              Building Your <br/>
              <em className="italic font-light">Legacy Home.</em>
            </h2>
            <p className="text-black/60 text-sm font-sans leading-relaxed">
              Access India's premier project management platform for high-end residential self-development.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Content / Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-white">
        <div className="lg:hidden absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif text-lg leading-none pt-0.5">
              N
            </div>
            <span className="text-xl font-serif tracking-display text-black">
              NestVault.
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {children}
        </div>
        
        <p className="absolute bottom-8 text-[9px] uppercase tracking-label text-black/40 font-bold">
          © 2026 Structural Excellence // All Rights Reserved
        </p>
      </div>
    </div>
  )
}
