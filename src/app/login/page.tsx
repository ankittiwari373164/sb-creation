'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'
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
        // --- LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        
        const role = data.user?.app_metadata?.role
        if (role === 'admin') {
          toast.success('Welcome back, Admin Ankit')
          router.push('/admin')
        } else {
          toast.success('Successfully logged in')
          router.push('/dashboard')
        }
      } else {
        // --- SIGN UP ---
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { 
            data: { 
              full_name: formData.fullName,
              role: 'customer' 
            } 
          }
        })
        if (error) throw error
        
        if (data.user) {
          await supabase.from('user_profiles').insert({
            id: data.user.id,
            full_name: formData.fullName,
          })
          // Auto-login or direct push since verification is off
          toast.success('Account created! Welcome to SB Creation')
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] flex overflow-hidden">
      
      {/* 🖼️ Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F2C3E] relative items-center justify-center p-12">
        <div className="relative z-10 text-center max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Sparkles className="text-[#D4AF37] mx-auto mb-8" size={48} />
            <h2 className="text-5xl font-serif text-white mb-6 leading-tight">
              Beautiful Jewelry <br /> <span className="italic font-light text-[#D4AF37]">Made for You.</span>
            </h2>
            <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.4em]">
              Traditional Designs from Firozabad
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🗝️ Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-12">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-serif uppercase font-bold text-[#db2777]">
                SB <span className="text-[#0F2C3E]">Creation</span>
              </span>
            </Link>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-serif text-[#0F2C3E] mb-2 uppercase">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.3em] uppercase">
              {isLogin ? 'Sign in to your account' : 'Join us to start shopping'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required={!isLogin} placeholder="Enter your name" className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@email.com" className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={16} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min. 6 characters" className="w-full pl-12 pr-6 py-4 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#db2777] transition-all shadow-xl group">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <>{isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-[#0F2C3E]/40 uppercase tracking-[0.2em]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#D4AF37] hover:text-[#0F2C3E] transition-colors uppercase">
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}