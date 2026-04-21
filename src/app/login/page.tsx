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
    <div className="min-h-screen bg-white flex overflow-hidden">
      
      {/* 🖼️ Left Side - Now using Pink/Grey Aesthetic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#fff1f2] relative items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px]" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <Sparkles className="text-[#db2777] mx-auto mb-6" size={40} />
            <h2 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-6 leading-tight">
              Beautiful Jewelry <br /> <span className="italic font-light text-[#db2777]">Made for You.</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.4em]">
              Traditional Designs from Firozabad
            </p>
          </motion.div>
        </div>
      </div>

      {/* 🗝️ Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif uppercase font-bold text-[#db2777]">
                SB <span className="text-[#0F2C3E]">Creation</span>
              </span>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif text-[#0F2C3E] mb-2 uppercase">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase">
              {isLogin ? 'Sign in to your account' : 'Join us to start shopping'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#db2777]" size={14} />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required={!isLogin} placeholder="Recipient name" className="w-full pl-12 pr-6 py-3.5 bg-[#F9FAFB] border-none rounded-full text-sm focus:ring-1 focus:ring-[#db2777] outline-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#db2777]" size={14} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email address" className="w-full pl-12 pr-6 py-3.5 bg-[#F9FAFB] border-none rounded-full text-sm focus:ring-1 focus:ring-[#db2777] outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#db2777]" size={14} />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Password" className="w-full pl-12 pr-6 py-3.5 bg-[#F9FAFB] border-none rounded-full text-sm focus:ring-1 focus:ring-[#db2777] outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0F2C3E] text-white py-4 rounded-full flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all shadow-md group">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <>{isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#db2777] hover:text-[#0F2C3E] transition-colors uppercase font-bold">
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}