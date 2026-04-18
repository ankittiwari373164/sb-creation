'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, User, MapPin, Heart, Sparkles, Crown, ArrowRight, Settings, ShoppingBag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    fetchOrders(user.id)
  }

  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; bg: string; dot: string }> = {
      pending: { label: 'In Atelier', bg: 'bg-[#FAF9F6]', dot: 'bg-yellow-400' },
      processing: { label: 'Crafting', bg: 'bg-[#FAF9F6]', dot: 'bg-blue-400' },
      shipped: { label: 'En Route', bg: 'bg-[#FAF9F6]', dot: 'bg-purple-400' },
      delivered: { label: 'Collected', bg: 'bg-[#FAF9F6]', dot: 'bg-[#D4AF37]' },
      cancelled: { label: 'Voided', bg: 'bg-red-50', dot: 'bg-red-400' },
    }
    return statusMap[status] || statusMap.pending
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* 🏛️ Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-2 block">Patron Portal</span>
              <h1 className="text-5xl font-serif text-[#0F2C3E]">Welcome, <span className="italic font-light">{user?.user_metadata?.full_name?.split(' ')[0] || 'Patron'}</span></h1>
            </div>
            <div className="flex gap-4">
               <button className="p-3 rounded-full border border-[#D4AF37]/20 text-[#0F2C3E] hover:bg-[#0F2C3E] hover:text-white transition-all">
                  <Settings size={20} strokeWidth={1.5} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* ✨ Membership Status */}
            <div className="lg:col-span-1 bg-[#0F2C3E] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <Crown className="text-[#D4AF37] mb-6" size={32} strokeWidth={1.5} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Member Status</h3>
              <p className="text-2xl font-serif mb-4">Elite Artisan</p>
              <div className="h-[2px] w-full bg-white/10 mb-4" />
              <p className="text-[10px] text-white/40 leading-relaxed italic">You are a valued part of the SB Creation legacy.</p>
              <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} /></div>
            </div>

            {/* 📦 Order Stats */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col justify-between">
              <Package className="text-[#0F2C3E] mb-4" size={28} strokeWidth={1.5} />
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]/40 mb-1">Acquisitions</h3>
                <p className="text-4xl font-serif text-[#0F2C3E]">{orders.length}</p>
              </div>
            </div>

            {/* ❤️ Wishlist */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm flex flex-col justify-between">
              <Heart className="text-[#db2777] mb-4" size={28} strokeWidth={1.5} />
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]/40 mb-1">Desired Pieces</h3>
                <p className="text-4xl font-serif text-[#0F2C3E]">0</p>
              </div>
            </div>

            {/* 📍 Saved Address */}
            <div className="bg-[#FAF9F6] rounded-[2.5rem] p-8 border border-[#D4AF37]/10 flex flex-col justify-between">
              <MapPin className="text-[#D4AF37] mb-4" size={28} strokeWidth={1.5} />
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]/40 mb-1">Primary Atelier</h3>
                <p className="text-[11px] text-[#0F2C3E] font-medium leading-relaxed">Default Shipping <br/> Set in Profile</p>
              </div>
            </div>
          </div>

          {/* 📜 Recent Transactions Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_60px_-15px_rgba(15,44,62,0.05)] border border-gray-50">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-serif text-[#0F2C3E]">Recent Acquisitions</h2>
                  <Link href="/shop" className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#0F2C3E] transition-colors">Browse Shop</Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} strokeWidth={1} />
                    <p className="text-[#0F2C3E]/40 font-light italic">Your collection is currently empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const status = getStatusInfo(order.status);
                      return (
                        <div key={order.id} className="group flex items-center justify-between p-6 rounded-3xl bg-[#FAF9F6] hover:bg-white border border-transparent hover:border-[#D4AF37]/20 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Package size={20} className="text-[#0F2C3E]" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 mb-1">Receipt #{order.id.substring(0, 8).toUpperCase()}</p>
                                <p className="text-xs font-bold text-[#0F2C3E]">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                          </div>
                          
                          <div className="text-right">
                             <p className="text-xl font-serif text-[#0F2C3E] mb-2">₹{order.total.toLocaleString()}</p>
                             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${status.bg}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E]/60">{status.label}</span>
                             </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 🏺 Sidebar: Curated for User */}
            <div className="space-y-8">
               <div className="bg-[#FAF9F6] p-10 rounded-[3rem] border border-[#D4AF37]/10 relative overflow-hidden">
                  <Sparkles className="text-[#D4AF37] mb-6" size={32} strokeWidth={1.5} />
                  <h3 className="text-xl font-serif text-[#0F2C3E] mb-4 leading-tight">Handpicked for your <span className="italic">Collection</span></h3>
                  <p className="text-xs text-[#0F2C3E]/60 leading-relaxed mb-8">Based on your previous acquisitions, our artisans recommend these heritage pieces.</p>
                  <Link href="/shop">
                    <button className="w-full bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#db2777] transition-all flex items-center justify-center gap-2">
                      View Recommendations <ArrowRight size={14} />
                    </button>
                  </Link>
               </div>

               <div className="p-10 border border-gray-100 rounded-[3rem]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F2C3E] mb-6">Concierge Support</h3>
                  <p className="text-[11px] text-[#0F2C3E]/40 mb-6 font-medium">Have questions regarding your bespoke orders or sizing?</p>
                  <Link href="/contact" className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border-b border-[#D4AF37] pb-1">Speak with a Specialist</Link>
               </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}