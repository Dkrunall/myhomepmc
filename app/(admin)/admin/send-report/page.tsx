'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { sendReportSchema, type SendReportFormData } from '@/lib/validations'
import { 
  Search, Upload, CheckCircle2, SendHorizontal, Building2, 
  FileText, ShieldCheck, Mail, MessageSquare, ArrowRight,
  User, Calendar, Ruler, HardHat, X, Activity, Globe, Loader2
} from 'lucide-react'
import type { Profile, SocietyRegistration } from '@/types'

type UserOption = Pick<Profile, 'id' | 'full_name'> & { email?: string }

export default function SendReportPage() {
  const [users, setUsers] = useState<UserOption[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)
  const [userRegistration, setUserRegistration] = useState<SocietyRegistration | null>(null)
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SendReportFormData>({
    resolver: zodResolver(sendReportSchema),
  })

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'user')
      setUsers((data as UserOption[]) || [])
    }
    fetchUsers()
  }, [])

  const handleSelectUser = async (user: UserOption) => {
    setSelectedUser(user)
    setUserSearch(user.full_name || '')
    setValue('user_id', user.id)
    // Fetch their registration
    const supabase = createClient()
    const { data } = await supabase.from('society_registrations').select('*')
      .eq('user_id', user.id).order('submitted_at', { ascending: false }).limit(1).maybeSingle()
    setUserRegistration(data)
    if (data) setValue('registration_id', data.id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be < 10MB'); return }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only PDF, JPG, or PNG accepted')
      return
    }
    setReportFile(file)
  }

  const onSubmit = async (data: SendReportFormData) => {
    if (!reportFile) { toast.error('Please upload a report file'); return }
    if (!selectedUser) { toast.error('Please select a user'); return }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user: adminUser } } = await supabase.auth.getUser()
      if (!adminUser) { toast.error('Not authenticated'); return }

      // Upload PDF
      const ext = reportFile.name.split('.').pop()
      const filePath = `${data.user_id}/${data.registration_id}-report-${Date.now()}.${ext}`

      let progress = 0
      const interval = setInterval(() => {
        progress = Math.min(progress + 12, 90)
        setUploadProgress(progress)
      }, 150)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('feasibility-reports')
        .upload(filePath, reportFile, { upsert: true })

      clearInterval(interval)
      setUploadProgress(100)

      if (uploadError) { toast.error('Upload failed: ' + uploadError.message); return }

      const { data: { publicUrl } } = supabase.storage
        .from('feasibility-reports')
        .getPublicUrl(uploadData.path)

      // Create report record
      const { error: dbError } = await supabase.from('feasibility_reports').insert({
        registration_id: data.registration_id,
        user_id: data.user_id,
        sent_by: adminUser.id,
        report_url: publicUrl,
        cover_message: data.cover_message,
      })

      if (dbError) { toast.error(dbError.message); return }

      // Notify user
      await supabase.from('notifications').insert({
        user_id: data.user_id,
        type: 'report_received',
        title: 'Feasibility Report Received',
        message: `Your feasibility report for "${userRegistration?.society_name || 'Project'}" has been sent by our team.`,
        is_read: false,
      })

      toast.success('Report sent successfully!')
      setSent(true)
      reset()
      setSelectedUser(null)
      setUserRegistration(null)
      setReportFile(null)
      setUploadProgress(0)
      setUserSearch('')
      setTimeout(() => setSent(false), 5000)
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div className="space-y-16 animate-fade-in pb-32">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-black/30" />
            <span className="text-[10px] font-bold uppercase tracking-label text-black/60">Data Transmission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-display text-black">Dispatch <br/><em className="italic font-light">Intelligence.</em></h1>
          <p className="text-black/50 font-serif text-lg max-w-lg mt-4 leading-relaxed">
            Transmit validated feasibility reports and structural blueprints directly to the homeowner's vault.
          </p>
        </div>
      </div>

      {sent && (
        <div className="p-8 border border-black bg-black text-white text-[10px] font-bold uppercase tracking-label flex items-center gap-4">
          <CheckCircle2 className="w-5 h-5" />
          Intelligence Report Successfully Transmitted to Vault.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="border border-black/10 bg-white p-8 md:p-12 space-y-12">
            
            <div className="space-y-8">
              {/* Recipient Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-black/40" /> Target Recipient
                </label>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setSelectedUser(null); }}
                    placeholder="Search by full name..."
                    className="w-full bg-[#FAFAFA] border border-black/10 pl-16 pr-6 py-5 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30"
                  />
                  {!selectedUser && userSearch && filteredUsers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 max-h-60 overflow-y-auto z-20 shadow-xl">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="px-6 py-4 cursor-pointer hover:bg-[#FAFAFA] border-b border-black/5 last:border-0 transition-colors flex items-center gap-4"
                        >
                          <div className="w-8 h-8 border border-black/10 flex items-center justify-center text-[10px] font-bold text-black/40 bg-white">
                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm font-serif tracking-display text-black">{user.full_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Message */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-black/40" /> Cover Briefing
                </label>
                <textarea
                  {...register('cover_message')}
                  rows={4}
                  placeholder="Enter strategic context or executive summary..."
                  className="w-full bg-[#FAFAFA] border border-black/10 px-8 py-6 text-sm font-serif tracking-display text-black focus:border-black outline-none transition-colors placeholder:text-black/30 resize-none"
                />
                {errors.cover_message && (
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-label px-2">{errors.cover_message.message}</p>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-label text-black/60 px-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-black/40" /> Classified Intelligence (PDF/Image)
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`p-10 border transition-colors flex flex-col items-center justify-center text-center gap-4
                    ${reportFile ? 'border-black bg-[#FAFAFA]' : 'border-black/10 border-dashed bg-white group-hover:border-black'}`}
                  >
                    <div className={`w-12 h-12 border flex items-center justify-center transition-colors
                      ${reportFile ? 'bg-black border-black text-white' : 'border-black/10 text-black/40 bg-white group-hover:text-black group-hover:border-black'}`}
                    >
                      {reportFile ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                    </div>
                    <div>
                      {reportFile ? (
                        <>
                          <p className="text-sm font-serif tracking-display text-black">{reportFile.name}</p>
                          <p className="text-[9px] font-bold text-black/40 uppercase tracking-label mt-1">{(reportFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-serif tracking-display text-black/60 group-hover:text-black transition-colors">Select Document</p>
                          <p className="text-[9px] font-bold text-black/30 uppercase tracking-label mt-1">Max 10MB • Secure Channel</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedUser || !reportFile}
              className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-label hover:bg-black/80 transition-colors flex items-center justify-center gap-4 disabled:opacity-30 relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                  <span className="relative z-10">Transmitting Data... {uploadProgress}%</span>
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </>
              ) : (
                <>
                  <SendHorizontal className="w-4 h-4" /> Authorize Dispatch
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          {selectedUser ? (
            <div className="space-y-8 animate-slide-in-right">
              {userRegistration ? (
                <div className="border border-black/10 bg-white">
                  <div className="p-8 border-b border-black/10 flex items-center gap-6 bg-[#FAFAFA]">
                    <div className="w-16 h-16 bg-white border border-black/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif tracking-display text-black">{userRegistration.society_name}</h3>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-label mt-1">Target Identity Validated</p>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between py-4 border-b border-black/5">
                      <div className="flex items-center gap-3">
                        <Ruler className="w-4 h-4 text-black/40" />
                        <span className="text-sm font-serif tracking-display text-black/60">Asset Magnitude</span>
                      </div>
                      <span className="text-sm font-serif tracking-display text-black">{userRegistration.root_area} SQ.FT</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-black/5">
                      <div className="flex items-center gap-3">
                        <HardHat className="w-4 h-4 text-black/40" />
                        <span className="text-sm font-serif tracking-display text-black/60">Unit Density</span>
                      </div>
                      <span className="text-sm font-serif tracking-display text-black">{userRegistration.no_of_rooms} Units</span>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-black/40" />
                        <span className="text-sm font-serif tracking-display text-black/60">Current Protocol</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-label px-3 py-1 border border-black bg-[#FAFAFA] text-black">
                        {userRegistration.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 border border-dashed border-black/20 bg-[#FAFAFA] text-center">
                  <div className="w-12 h-12 border border-black/10 flex items-center justify-center mx-auto mb-4 bg-white">
                    <ShieldCheck className="w-5 h-5 text-black/20" />
                  </div>
                  <h3 className="text-xl font-serif tracking-display text-black mb-2">No Active Registry</h3>
                  <p className="text-[10px] uppercase tracking-label text-black/40 font-bold max-w-xs mx-auto">
                    Target identity does not have an active asset registration on file.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-black/10 bg-[#FAFAFA] flex flex-col items-center justify-center text-center p-12">
              <Globe className="w-16 h-16 text-black/10 mb-6" />
              <p className="text-xl font-serif tracking-display text-black mb-2">Awaiting Target</p>
              <p className="text-[10px] uppercase tracking-label text-black/40 font-bold">Select a user to pull asset registry data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
