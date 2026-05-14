'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Shield, Award, Users, Plus, Minus, Building2, Play
} from 'lucide-react'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const faqs = [
    { q: "What is the timeline for a standard luxury development?", a: "A standard development cycle from initial soil diagnostics to final handover spans 18 to 24 months, contingent on municipal approvals and structural complexity." },
    { q: "Do you handle RERA compliance and municipal permits?", a: "Absolutely. Our legal and regulatory elite manage end-to-end compliance, ensuring your project meets all local and national building codes without delay." },
    { q: "How is financial transparency maintained during construction?", a: "Through our proprietary Vault Dashboard, clients have real-time access to ledger accounts, vendor disbursements, and milestone-based financial reports." },
    { q: "Can I bring my own architect or design firm?", a: "Yes. NestVault functions as the executing intelligence. We seamlessly sync with your chosen design partners to translate their vision into engineered reality." }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#000000] selection:bg-black selection:text-white overflow-x-hidden font-sans">
      
      {/* ───────────────── EDITORIAL NAVIGATION ───────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-4 bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm' : 'py-8 bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-serif text-xl leading-none pt-0.5 transition-transform duration-500 group-hover:scale-95">N</div>
              <span className="text-2xl font-serif tracking-display text-black leading-none mt-1">NestVault.</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-14">
              {['Expertise', 'Methodology', 'Portfolio', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] uppercase tracking-label text-black/50 hover:text-black transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-8">
              <Link href="/login" className="hidden sm:block text-[10px] uppercase tracking-label text-black/50 hover:text-black transition-colors relative group">
                Vault Login
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/society-registration" className="bg-black text-white px-8 py-4 text-[10px] uppercase tracking-label hover:bg-black/80 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20">
                Initialize
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ───────────────── HERO: EDITORIAL MINIMALISM ───────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Typography */}
            <div className="lg:col-span-7 space-y-12">
              <div className="flex items-center gap-5">
                <div className="w-12 h-[1px] bg-black/30" />
                <span className="text-[10px] uppercase tracking-label text-black/60 font-medium">The Standard of Structural Excellence</span>
              </div>
              
              <h1 className="text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-serif tracking-display leading-[1.02] text-black">
                Architecting <br/> 
                <em className="italic font-light text-black/80">Timeless</em> <br/>
                <span className="text-black/20">Legacies.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-black/60 font-serif max-w-lg leading-relaxed pt-4">
                NestVault translates architectural vision into engineered reality. A rigorous, data-driven approach to high-end project management.
              </p>

              <div className="flex flex-wrap items-center gap-8 pt-8">
                <Link href="/society-registration" className="group flex items-center gap-5 bg-black text-white px-9 py-5 text-[11px] uppercase tracking-label hover:bg-[#D4AF37] transition-all duration-500">
                  Begin Journey <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </Link>
                <button className="group flex items-center gap-5 text-[11px] uppercase tracking-label text-black/60 hover:text-black transition-colors">
                  <span className="w-12 h-12 border border-black/10 flex items-center justify-center transition-all duration-500 group-hover:border-black rounded-full group-hover:scale-110">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                  View Process
                </button>
              </div>
            </div>

            {/* Right Editorial Image */}
            <div className="lg:col-span-5 relative hidden lg:block mt-12 lg:mt-0">
              <div className="relative aspect-[3/4] w-full bg-[#FAFAFA] border-[1px] border-black/10 overflow-hidden group p-3">
                <div className="w-full h-full relative overflow-hidden">
                  <img src="/hero-2026.png" alt="Architecture" className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-[7000ms] ease-out group-hover:scale-110" />
                </div>
              </div>
              
              {/* Minimal Stats */}
              <div className="absolute -bottom-10 -left-16 bg-white border border-black/10 p-10 w-72 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <div className="mb-8">
                  <p className="text-5xl font-serif tracking-display text-black mb-3">500+</p>
                  <p className="text-[10px] uppercase tracking-label text-black/40 font-semibold">Strategic Assets Delivered</p>
                </div>
                <div className="w-full h-[1px] bg-black/10 mb-8" />
                <div>
                  <p className="text-5xl font-serif tracking-display text-[#D4AF37] mb-3">94%</p>
                  <p className="text-[10px] uppercase tracking-label text-black/40 font-semibold">Timeline Precision</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────── TRUST BAR ───────────────── */}
      <section className="py-16 border-y border-black/5 bg-[#FAFAFA]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-between items-center gap-10 opacity-40">
            {['ISO 9001:2026', 'RERA COMPLIANT', 'STRUCTURAL ELITE', 'TRUSTED AUTHORITY', 'ENGINEERING SYNC'].map((t) => (
              <span key={t} className="text-[11px] font-bold tracking-label uppercase text-black">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── EXPERTISE: GRID SYSTEM ───────────────── */}
      <section id="expertise" className="py-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
            <div className="lg:col-span-5">
              <h2 className="text-5xl md:text-7xl font-serif tracking-display text-black leading-tight">
                Refined <br/> Expertise.
              </h2>
            </div>
            <div className="lg:col-span-7 flex items-end">
              <p className="text-xl md:text-2xl font-serif text-black/60 leading-relaxed max-w-2xl">
                We leverage absolute precision and high-end engineering to deliver a flawless development experience, from initial soil diagnostics to the final architectural handover.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-black/10">
            {[
              { num: '01', title: 'AI Feasibility', desc: 'Deep soil diagnostics and legal vetting computed with absolute precision.' },
              { num: '02', title: 'Regulatory Elite', desc: 'Municipal permits and RERA compliance managed by legal authorities.' },
              { num: '03', title: 'Architectural Sync', desc: 'Flawless translation from conceptual blueprint to structural reality.' },
            ].map((feature, i) => (
              <div key={i} className="p-12 md:p-16 border-b border-r border-black/10 hover:bg-[#FAFAFA] transition-colors duration-500 group">
                <span className="text-sm font-serif tracking-widest text-[#D4AF37] block mb-16 opacity-70 group-hover:opacity-100 transition-opacity">{feature.num} —</span>
                <h3 className="text-3xl font-serif tracking-display text-black mb-6">{feature.title}</h3>
                <p className="text-[15px] font-sans text-black/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── METHODOLOGY: THE PROCESS ───────────────── */}
      <section id="methodology" className="py-40 bg-[#0A0A0A] text-white selection:bg-white selection:text-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-32">
            <span className="flex items-center gap-5 text-[10px] uppercase tracking-label text-white/40 mb-10 font-medium">
              <div className="w-12 h-[1px] bg-white/20" /> Process
            </span>
            <h2 className="text-5xl md:text-7xl font-serif tracking-display leading-tight">
              The Execution <br/>
              <em className="italic font-light text-white/40">Matrix.</em>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { phase: 'Phase I', title: 'Intelligence Gathering', desc: 'Comprehensive site surveying, legal compliance auditing, and environmental feasibility testing.' },
              { phase: 'Phase II', title: 'Architectural Sync', desc: 'Aligning structural engineers with design visionaries to establish the project blueprint.' },
              { phase: 'Phase III', title: 'Execution & Procurement', desc: 'Sourcing elite materials globally while deploying top-tier construction protocols.' },
              { phase: 'Phase IV', title: 'Handover & Legacy', desc: 'Final quality assurance audits and the ceremonial transfer of the completed estate.' }
            ].map((step, i) => (
              <div key={i} className="group border-t border-white/10 py-16 flex flex-col md:flex-row md:items-start gap-8 md:gap-32 hover:bg-white/5 transition-colors duration-500 px-8 -mx-8">
                <div className="md:w-48 flex-shrink-0 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-label text-[#D4AF37]">{step.phase}</span>
                </div>
                <div className="flex-1 space-y-5">
                  <h3 className="text-4xl font-serif tracking-display group-hover:translate-x-2 transition-transform duration-500">{step.title}</h3>
                  <p className="text-base text-white/50 leading-relaxed max-w-2xl">{step.desc}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </section>

      {/* ───────────────── SHOWCASE ───────────────── */}
      <section id="portfolio" className="py-40 bg-[#FAFAFA] border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
            <div>
              <span className="flex items-center gap-5 text-[10px] uppercase tracking-label text-black/40 mb-10 font-medium">
                <div className="w-12 h-[1px] bg-black/20" /> Selected Works
              </span>
              <h2 className="text-5xl md:text-7xl font-serif tracking-display text-black">Portfolio.</h2>
            </div>
            <Link href="/portfolio" className="text-[11px] uppercase tracking-label text-black hover:text-[#D4AF37] transition-colors flex items-center gap-3 pb-3 group">
              View Archive <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[
              { title: 'The Obsidian', label: 'Bandra West • 12,000 SQ.FT' },
              { title: 'Alston Heights', label: 'Worli Seaface • 18,500 SQ.FT' }
            ].map((project, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-white border border-black/10 mb-10 overflow-hidden relative p-3">
                  <div className="absolute inset-3 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-white text-black px-8 py-4 text-[10px] uppercase tracking-label font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">View Project</span>
                  </div>
                  <img src="/hero-2026.png" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-[5000ms] ease-out" alt="Project" />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif tracking-display text-black mb-4 group-hover:text-[#D4AF37] transition-colors">{project.title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-label text-black/40">{project.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FAQ SECTION ───────────────── */}
      <section id="faq" className="py-40 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-6xl font-serif tracking-display text-black">Inquiries.</h2>
          </div>
          
          <div className="border-t border-black/10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/10 group">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-10 flex items-center justify-between text-left transition-all"
                >
                  <span className={`text-2xl md:text-3xl font-serif tracking-display transition-colors pr-8 ${openFaq === i ? 'text-[#D4AF37]' : 'text-black group-hover:text-black/60'}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${openFaq === i ? 'border-[#D4AF37] text-[#D4AF37] rotate-180' : 'border-black/10 text-black/40 group-hover:border-black/30 group-hover:text-black'}`}>
                    {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-64 pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-black/60 leading-relaxed font-sans text-base md:text-lg max-w-3xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="bg-[#FAFAFA] pt-32 pb-16 border-t border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-serif text-xl leading-none pt-0.5">N</div>
                <span className="text-2xl font-serif tracking-display text-black leading-none mt-1">NestVault.</span>
              </Link>
              <p className="text-lg font-serif text-black/60 max-w-md leading-relaxed">
                India's premiere architectural project management consultancy. Delivering engineered perfection.
              </p>
            </div>
            
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-label text-black/40 mb-10">Navigation</h4>
              <ul className="space-y-6">
                {['Expertise', 'Methodology', 'Portfolio', 'FAQ', 'Contact'].map(link => (
                  <li key={link}><a href={`#${link.toLowerCase()}`} className="text-[15px] font-sans text-black hover:text-[#D4AF37] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-label text-black/40 mb-10">Headquarters</h4>
              <ul className="space-y-6 text-[15px] font-sans text-black">
                <li>Level 42, Maker Maxity</li>
                <li>BKC, Mumbai 400051</li>
                <li className="pt-4"><a href="mailto:office@nestvault.com" className="hover:text-[#D4AF37] transition-colors underline underline-offset-4">office@nestvault.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] uppercase tracking-label text-black/40 font-semibold">
              © 2026 NestVault PMC. All rights reserved.
            </p>
            <div className="flex gap-10">
              {['Privacy', 'Terms', 'Legal'].map(link => (
                <a key={link} href="#" className="text-[10px] uppercase tracking-label text-black/40 hover:text-black transition-colors font-semibold">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
