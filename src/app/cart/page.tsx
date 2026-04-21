'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Tag } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()
  
  // --- Coupon Logic ---
  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const handleApplyCoupon = async () => {
    if (!couponInput) return
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponInput.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        toast.error('Invalid code')
        setAppliedDiscount(0)
      } else {
        setAppliedDiscount(data.discount_percent)
        toast.success(`Discount applied: ${data.discount_percent}% off!`)
      }
    } catch (err) {
      toast.error('Error checking code')
    }
  }

  const subtotal = getTotalPrice()
  const discountAmount = (subtotal * appliedDiscount) / 100
  const finalTotal = subtotal - discountAmount

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} strokeWidth={1} className="text-[#0F2C3E]/20" />
          </motion.div>
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-4">Your Bag is Empty</h2>
          <p className="text-[#0F2C3E]/50 mb-10">You haven't added any jewelry yet.</p>
          <Link href="/shop">
            <button className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-5xl font-serif text-[#0F2C3E]">Your <span className="italic font-light text-gray-400">Bag</span></h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
              {getTotalItems()} Items Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* 💎 List of Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                      <Image src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-[#0F2C3E]">{item.product.name}</h3>
                        <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center bg-gray-50 rounded-full p-1">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"><Minus size={12} /></button>
                          <span className="px-4 font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"><Plus size={12} /></button>
                        </div>
                        <p className="text-xl font-serif text-[#0F2C3E]">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 📜 Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#0F2C3E] text-white rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
                <h2 className="text-xl font-serif mb-8 text-[#D4AF37]">Order Summary</h2>

                {/* --- 🏷️ Coupon Section --- */}
                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Apply Coupon</p>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-white/10 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37]" 
                      />
                      <button onClick={handleApplyCoupon} className="bg-[#D4AF37] text-[#0F2C3E] px-4 py-2 rounded-full text-[10px] font-bold uppercase">Apply</button>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs opacity-60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-400">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs">
                    <span className="opacity-60">Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase opacity-40">Total</span>
                    <span className="text-3xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={{ pathname: '/checkout', query: { code: couponInput, discount: appliedDiscount } }}>
                    <button className="w-full bg-[#D4AF37] text-[#0F2C3E] py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
                      Checkout <ArrowRight size={16} />
                    </button>
                  </Link>
                  <Link href="/shop" className="block text-center text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 mt-4">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}