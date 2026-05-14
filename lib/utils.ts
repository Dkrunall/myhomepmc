import { format, formatDistanceToNow, isAfter } from 'date-fns'
import type { RegistrationStatus, LeadStatus } from '@/types'

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy, HH:mm')
  } catch {
    return '—'
  }
}

export function formatDateRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return '—'
  }
}

export function getEditTimeLeft(until: string | null | undefined): {
  canEdit: boolean
  timeLeft: string
} {
  if (!until) return { canEdit: false, timeLeft: '' }
  try {
    const deadline = new Date(until)
    const now = new Date()
    if (!isAfter(deadline, now)) return { canEdit: false, timeLeft: '' }
    const timeLeft = formatDistanceToNow(deadline)
    return { canEdit: true, timeLeft }
  } catch {
    return { canEdit: false, timeLeft: '' }
  }
}

export function getStatusColor(status: RegistrationStatus | LeadStatus | string): string {
  const map: Record<string, string> = {
    submitted:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    under_review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved:     'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected:     'bg-red-500/20 text-red-400 border-red-500/30',
    new:          'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted:    'bg-purple-500/20 text-purple-400 border-purple-500/30',
    converted:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    closed:       'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }
  return map[status] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

export function getStatusLabel(status: RegistrationStatus | LeadStatus | string): string {
  const map: Record<string, string> = {
    submitted:    'Submitted',
    under_review: 'Under Review',
    approved:     'Approved',
    rejected:     'Rejected',
    new:          'New',
    contacted:    'Contacted',
    converted:    'Converted',
    closed:       'Closed',
  }
  return map[status] ?? status
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
