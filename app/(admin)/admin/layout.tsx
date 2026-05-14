'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, Building2, Users, FileText,
  Send, HardHat, Menu, X, LogOut, Bell, ChevronRight,
  FolderKanban
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',     label: 'Control Center', icon: LayoutDashboard },
  { href: '/admin/registrations', label: 'Registrations',  icon: Building2 },
  { href: '/admin/leads',         label: 'Project Leads', icon: Users },
  { href: '/admin/send-report',   label: 'Dispatch Report', icon: Send },
  { href: '/admin/architects',    label: 'Architects',     icon: HardHat },
  { href: '/admin/projects',      label: 'Live Projects', icon: FolderKanban },
]

function Sidebar({ onClose, onSignOut }: { onClose?: () => void; onSignOut: () => void }) {
  const pathname = usePathname()

  return (
    <div className="h-full min-h-screen bg-[#FAFAFA] border-r border-black/10 flex flex-col font-sans">
      {/* Logo Section */}
      <div className="p-8 border-b border-black/10 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-serif text-lg leading-none pt-0.5 transition-transform duration-500 group-hover:scale-95">
            N
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-serif tracking-display text-black">
              NestVault.
            </span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-black/40 hover:text-black transition-colors lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        <p className="text-[9px] font-bold uppercase tracking-label text-black/40 px-4 mb-6">
          Operational Systems
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-4 px-4 py-3 transition-all group ${
                active 
                  ? 'bg-white border border-black/10 text-black shadow-sm' 
                  : 'text-black/50 hover:text-black hover:bg-black/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-black/40 group-hover:text-black'}`} />
              <span className="flex-1 text-[10px] font-bold uppercase tracking-label">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-6 border-t border-black/10 bg-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-black font-serif text-sm bg-[#FAFAFA]">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-serif tracking-display text-black truncate">Master Admin</p>
            <p className="text-[9px] font-bold uppercase tracking-label text-[#D4AF37] truncate">Level 5 Access</p>
          </div>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-4 w-full px-4 py-3 border border-black/10 text-black/60 hover:text-black hover:bg-[#FAFAFA] transition-all group">
          <LogOut className="w-4 h-4 transition-colors" />
          <span className="text-[10px] font-bold uppercase tracking-label">Terminate Session</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const currentPage = navItems.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))

  return (
    <div className="flex min-h-screen bg-white">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 fixed top-0 bottom-0 left-0 z-40">
        <Sidebar onSignOut={handleSignOut} />
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl animate-fade-in">
            <Sidebar onClose={() => setMobileOpen(false)} onSignOut={handleSignOut} />
          </div>
        </div>
      )}

      {/* Main Framework */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        {/* Top Bar */}
        <header className="h-24 flex items-center justify-between px-8 lg:px-12 sticky top-0 bg-white/95 backdrop-blur-md border-b border-black/10 z-30">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-black/60 hover:text-black transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            {currentPage && (
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 border border-black/10 flex items-center justify-center text-black">
                  <currentPage.icon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif tracking-display text-black leading-none mb-1">{currentPage.label}</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="text-[9px] font-bold text-black/40 uppercase tracking-label">System Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin/notifications" className="relative p-3 text-black/40 hover:text-black transition-colors group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black border-2 border-white" />
            </Link>
            
            <div className="h-8 w-[1px] bg-black/10 mx-2 hidden sm:block" />

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-serif tracking-display text-black">Administrator</p>
                <p className="text-[9px] font-bold text-black/40 uppercase tracking-label">Alpha Clearance</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Entry */}
        <main className="flex-1 p-8 lg:p-12 relative z-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
