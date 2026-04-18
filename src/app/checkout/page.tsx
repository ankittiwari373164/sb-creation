'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Truck, Lock, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Please login to complete your order')
        router.push('/login')
        return
      }

      const shippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: getTotalPrice(),
          status: 'pending',
          shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      toast.success('Your SB Creation artifact is on its way!')
      router.push(`/dashboard`)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Encountered an issue. Please contact our concierge.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* 🏛️ Secure Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <Link href="/cart" className="group flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]/40 hover:text-[#db2777] transition-all">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-2 transition-transform" />
              Return to Bag
            </Link>
            <div className="text-center">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-2 block">Secure Transaction</span>
              <h1 className="text-4xl md:text-5xl font-serif text-[#0F2C3E]">Checkout <span className="italic font-light">Details</span></h1>
            </div>
            <div className="flex items-center gap-2 text-[#D4AF37] opacity-60">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* ✉️ Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Shipping Card */}
                <div className="bg-white rounded-[2.5rem] border border-[#D4AF37]/10 p-10 shadow-[0_20px_60px_-15px_rgba(15,44,62,0.05)]">
                  <div className="flex items-center gap-4 mb-10 border-b border-[#FAF9F6] pb-6">
                    <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#D4AF37]">
                      <Truck size={22} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-serif text-[#0F2C3E]">Concierge Shipping</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all" placeholder="Enter your full name" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">Contact Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">Detailed Address</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full bg-[#FAF9F6] border-none rounded-[2rem] py-6 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none" placeholder="Apartment, Street, Landmark..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 ml-4">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="bg-white rounded-[2.5rem] border border-[#D4AF37]/10 p-10 shadow-[0_20px_60px_-15px_rgba(15,44,62,0.05)]">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#D4AF37]">
                      <CreditCard size={22} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-serif text-[#0F2C3E]">Payment Method</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`flex items-center p-6 border rounded-3xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-[#D4AF37] bg-[#FAF9F6]' : 'border-gray-100 hover:border-[#D4AF37]/30'}`}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="accent-[#0F2C3E] mr-4" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#0F2C3E]">Cash on Delivery</p>
                        <p className="text-[10px] text-[#0F2C3E]/40 font-medium">Verify & pay at your doorstep</p>
                      </div>
                    </label>

                    <div className="flex items-center p-6 border border-gray-100 rounded-3xl opacity-30 cursor-not-allowed bg-gray-50/50">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-4" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-[#0F2C3E]">Prepaid (Coming Soon)</p>
                        <p className="text-[10px] text-[#0F2C3E]/40 font-medium italic">Unlocking luxury gateways soon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0F2C3E] text-white py-6 rounded-full flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.4em] hover:bg-[#db2777] transition-all shadow-2xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Lock size={18} />
                      Complete Selection
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* 💎 Order Summary Section */}
            <div className="lg:col-span-4">
              <div className="bg-[#0F2C3E] rounded-[2.5rem] p-10 sticky top-24 shadow-2xl overflow-hidden text-white">
                {/* Texture Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
                
                <h2 className="text-2xl font-serif mb-10 text-[#D4AF37] uppercase tracking-widest">Atelier Summary</h2>

                <div className="space-y-6 mb-10 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start gap-4 border-b border-white/5 pb-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#FAF9F6]">{item.product.name}</p>
                        <p className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-serif text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between text-xs font-medium opacity-50 uppercase tracking-widest">
                    <span>Artifacts Subtotal</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium opacity-50 uppercase tracking-widest">White-Glove Shipping</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">Complimentary</span>
                  </div>
                  
                  <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">Total Valuation</span>
                    <span className="text-3xl font-serif text-[#D4AF37] tracking-tighter">
                      ₹{getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Packaging Note */}
                <div className="mt-10 p-6 bg-white/5 rounded-3xl flex items-start gap-4 border border-white/5">
                  <Sparkles size={20} className="text-[#D4AF37] flex-shrink-0" />
                  <p className="text-[10px] text-white/60 leading-relaxed italic">
                    All orders are dispatched in our signature velvet-lined **SBC Collection** box to ensure your artifacts arrive in pristine condition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}