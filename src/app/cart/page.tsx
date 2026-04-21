'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  
  // --- Coupon Logic ---
  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  // 🔄 Fix Hydration Error
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // 🛡️ Prevent rendering until mounted to avoid Hydration Mismatch
  if (!mounted) return <div className="min-h-screen bg-white" />

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-2">
        <div className="text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={40} strokeWidth={1} className="text-gray-300" />
          </motion.div>
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-2">Your Bag is Empty</h2>
          <p className="text-gray-500 text-lg mb-8">You haven't added any jewelry yet.</p>
          <Link href="/shop">
            <button className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#db2777] transition-all">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-4 px-6"> {/* ⬅️ Removed top spacing */}
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-5xl font-serif text-[#0F2C3E]">Your <span className="italic font-light text-[#db2777]">Bag</span></h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">
              {getTotalItems()} Items Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* 💎 List of Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                      <Image src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-[#0F2C3E]">{item.product.name}</h3> {/* ⬅️ Increased font size */}
                        <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-[#db2777] transition-colors p-1">
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center bg-gray-50 rounded-full p-1.5">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white text-gray-500"><Minus size={14} /></button>
                          <span className="px-5 font-bold text-lg">{item.quantity}</span> {/* ⬅️ Increased font size */}
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white text-gray-500"><Plus size={14} /></button>
                        </div>
                        <p className="text-2xl font-serif text-[#0F2C3E]">₹{(item.product.price * item.quantity).toLocaleString()}</p> {/* ⬅️ Increased font size */}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 📜 Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#FAF9F6] text-[#0F2C3E] rounded-[2.5rem] p-10 sticky top-24 border border-gray-100">
                <h2 className="text-2xl font-serif mb-8 text-[#db2777]">Summary</h2>

                {/* --- 🏷️ Coupon Section --- */}
<div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100">
  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Apply Coupon</p>
  <div className="flex items-center gap-2 w-full">
    <input 
      type="text" 
      placeholder="Code" 
      value={couponInput}
      onChange={(e) => setCouponInput(e.target.value)}
      className="flex-1 min-w-0 bg-gray-50 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#db2777] outline-none" 
    />
    <button 
      onClick={handleApplyCoupon} 
      className="shrink-0 bg-[#0F2C3E] text-white px-5 py-2 rounded-full text-[9px] font-bold uppercase hover:bg-[#db2777] transition-all"
    >
      Apply
    </button>
  </div>
</div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm uppercase tracking-wide opacity-70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm uppercase tracking-wide text-[#db2777] font-bold">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm uppercase tracking-wide">
                    <span className="opacity-70">Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                    <span className="text-sm font-bold uppercase opacity-50">Total</span>
                    <span className="text-4xl font-serif text-[#0F2C3E]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={{ pathname: '/checkout', query: { code: couponInput, discount: appliedDiscount } }}>
                    <button className="w-full bg-[#db2777] text-white py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#0F2C3E] transition-all flex items-center justify-center gap-2">
                      Checkout Now <ArrowRight size={18} />
                    </button>
                  </Link>
                  <Link href="/shop" className="block text-center text-xs uppercase tracking-widest text-gray-400 hover:text-[#db2777] mt-4 font-bold">
                    Continue Browsing
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