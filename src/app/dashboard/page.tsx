'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, User, MapPin, Heart, Sparkles, 
  ArrowRight, Settings, ShoppingBag, Truck, 
  LogOut, CreditCard, Clock, MessageCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
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
    fetchDashboardData(user.id)
  }

  const fetchDashboardData = async (userId: string) => {
    try {
      const [ordersRes, wishlistRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('wishlist').select('id', { count: 'exact' }).eq('user_id', userId)
      ])

      setOrders(ordersRes.data || [])
      setWishlistCount(wishlistRes.count || 0)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/')
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; bg: string; dot: string; text: string }> = {
      pending: { label: 'Order Placed', bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700' },
      processing: { label: 'Preparing', bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-700' },
      shipped: { label: 'On the Way', bg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-700' },
      delivered: { label: 'Delivered', bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-700' },
      cancelled: { label: 'Cancelled', bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700' },
    }
    return statusMap[status] || statusMap.pending
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db2777]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* 👋 Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif text-[#0F2C3E]">
                Hello, <span className="italic font-light text-[#db2777]">{user?.user_metadata?.full_name?.split(' ')[0] || 'Member'}</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Manage your orders and profile</p>
            </div>
            <div className="flex gap-3">
               <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition-all text-[10px] font-bold uppercase tracking-widest">
                  <LogOut size={16} /> Logout
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* 📦 Total Orders */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] flex items-center justify-center text-[#0F2C3E]">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Total Orders</p>
                <p className="text-3xl font-serif text-[#0F2C3E]">{orders.length}</p>
              </div>
            </div>

            {/* ❤️ Saved Items */}
            <Link href="/wishlist" className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6 hover:border-[#db2777]/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#fff1f2] flex items-center justify-center text-[#db2777]">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Wishlist</p>
                <p className="text-3xl font-serif text-[#0F2C3E]">{wishlistCount}</p>
              </div>
            </Link>

            {/* 📍 Pending Orders */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Pending</p>
                <p className="text-3xl font-serif text-[#0F2C3E]">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
                </p>
              </div>
            </div>

            {/* ✨ Pink Aesthetic Card */}
            <div className="bg-[#fff1f2] rounded-[2rem] p-8 text-[#db2777] flex items-center gap-6 border border-[#db2777]/10">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60">Points</p>
                <p className="text-3xl font-serif">150</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* 📜 Order History Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif text-[#0F2C3E]">Recent Orders</h2>
                  <Link href="/shop" className="text-[10px] font-bold text-[#db2777] border-b border-[#db2777] pb-1">Shop More</Link>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-[#F9FAFB] rounded-3xl border-2 border-dashed border-gray-100">
                    <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} />
                    <p className="text-gray-400 font-medium">You haven't ordered anything yet.</p>
                    <Link href="/shop" className="text-[#db2777] font-bold text-xs uppercase mt-4 inline-block">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => {
                      const status = getStatusInfo(order.status);
                      return (
                        <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[#F9FAFB] border border-transparent hover:border-gray-200 transition-all gap-4">
                          <div className="flex items-center gap-5">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Package size={18} className="text-[#db2777]" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold uppercase text-gray-400">Order ID: {order.id.substring(0, 8).toUpperCase()}</p>
                                <p className="text-sm font-bold text-[#0F2C3E]">{new Date(order.created_at).toLocaleDateString()}</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-8">
                             <p className="text-lg font-serif text-[#0F2C3E]">₹{order.total.toLocaleString()}</p>
                             <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${status.bg} ${status.text} flex items-center gap-2`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                {status.label}
                             </div>
                             <Link href={`/track-order?id=${order.id}`}>
                                <button className="p-2 bg-white rounded-full text-gray-300 hover:text-[#db2777] shadow-sm transition-colors"><ArrowRight size={16}/></button>
                             </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ⚡ Quick Actions Sidebar */}
            <div className="space-y-6">
               <div className="bg-[#FAF9F6] p-10 rounded-[2.5rem] border border-gray-100">
                  <h3 className="text-xl font-serif text-[#0F2C3E] mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                     <Link href="/wishlist" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#db2777] transition-all group shadow-sm">
                        <Heart size={18} className="text-[#db2777]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F2C3E]">My Favorites</span>
                     </Link>
                     <Link href="/track-order" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#db2777] transition-all group shadow-sm">
                        <Truck size={18} className="text-gray-400 group-hover:text-[#db2777]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F2C3E]">Track Package</span>
                     </Link>
                     <button className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#db2777] transition-all group shadow-sm">
                        <User size={18} className="text-gray-400 group-hover:text-[#db2777]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#0F2C3E]">Edit Profile</span>
                     </button>
                  </div>
               </div>

               {/* Help Section */}
               <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <MessageCircle className="text-[#db2777] mb-4" size={28} />
                  <h3 className="text-lg font-serif text-[#0F2C3E] mb-2">Need Help?</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">Questions about your order or bangle size? We are here to help.</p>
                  <Link href="/contact" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E] bg-[#F9FAFB] px-6 py-3 rounded-full hover:bg-[#db2777] hover:text-white transition-all inline-block border border-gray-100">
                    Contact Support
                  </Link>
               </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}