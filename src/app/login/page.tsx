'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        toast.success('Welcome back to the Atelier')
        router.push('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName } }
        })
        if (error) throw error
        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            full_name: formData.fullName,
          })
        }
        toast.success('Your SBC account has been created')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] flex overflow-hidden">
      
      {/* 🖼️ Left Side: Brand Imagery (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F2C3E] relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Sparkles className="text-[#D4AF37] mx-auto mb-8" size={48} strokeWidth={1} />
            <h2 className="text-5xl font-serif text-white mb-6 leading-tight">
              Heritage in <br /> <span className="italic font-light text-[#D4AF37]">Every Circle.</span>
            </h2>
            <p className="text-white/50 font-light leading-relaxed uppercase text-[10px] tracking-[0.4em]">
              Join our legacy of Firozabad craftsmanship.
            </p>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-[10px] font-bold text-[#D4AF37] tracking-[0.5em] uppercase opacity-30">
          SB Creation • Artisanal Excellence
        </div>
      </div>

      {/* 🗝️ Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo for Mobile */}
          <div className="text-center mb-12 lg:text-left">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-serif tracking-tighter uppercase font-bold text-[#db2777]">
                SB <span className="text-[#0F2C3E]">Creation</span>
              </span>
              <div className="h-[1px] w-full bg-[#D4AF37] mt-1 opacity-20" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-serif text-[#0F2C3E] mb-2 uppercase tracking-tighter">
              {isLogin ? 'Sign In' : 'Register'}
            </h1>
            <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">
              {isLogin ? 'Access your private collections' : 'Begin your journey with us'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="Jane Doe"
                      className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@luxury.com"
                  className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-between items-center px-2">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="accent-[#0F2C3E] rounded border-none bg-[#FAF9F6]" />
                  <span className="ml-2 text-[10px] font-bold text-[#0F2C3E]/40 uppercase tracking-widest">Stay Logged In</span>
                </label>
                <button type="button" className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-[#0F2C3E]">
                  Recover
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#db2777] transition-all shadow-xl group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Enter Atelier' : 'Create Profile'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-[#0F2C3E]/40 uppercase tracking-[0.2em]">
              {isLogin ? "New to the heritage?" : "Returning member?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#D4AF37] hover:text-[#0F2C3E] transition-colors"
              >
                {isLogin ? 'Request Invitation' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 opacity-20">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Encrypted Access Only</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}