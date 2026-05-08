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
  if (!mounted) return <div className="min-h-screen bg-[#F5E9DC]" />

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5E9DC] flex items-center justify-center p-2">
        <div className="text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 bg-[#FFFFFF] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#D4AF37]">
            <ShoppingBag size={40} strokeWidth={1} className="text-[#D4AF37]" />
          </motion.div>
          <h2 className="text-4xl font-serif text-[#2d2416] mb-2">Your Bag is Empty</h2>
          <p className="text-[#5a4a42] text-lg mb-8 font-sans">You haven't added any jewelry yet.</p>
          <Link href="/shop">
            <button className="bg-[#D4AF37] text-[#2d2416] px-12 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#F8C8DC] hover:text-[#2d2416] transition-all font-sans">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5E9DC] py-4 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-6 md:mb-8 border-b-2 border-[#D4AF37] pb-3 md:pb-4">
            <h1 className="text-3xl md:text-5xl font-serif text-[#2d2416]">Your <span className="italic font-light text-[#D4AF37]">Bag</span></h1>
            <p className="text-[#D4AF37] text-[10px] md:text-sm font-bold uppercase tracking-widest mt-2 font-sans">
              {getTotalItems()} Items Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            {/* 💎 List of Items */}
            <div className="lg:col-span-8 space-y-3 md:space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#FFFFFF] rounded-2xl md:rounded-[2rem] p-4 md:p-6 border-2 border-[#D4AF37] shadow-sm flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg md:rounded-2xl overflow-hidden bg-[#F5E9DC]">
                      <Image src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-2xl font-bold text-[#2d2416] font-serif">{item.product.name}</h3>
                        <button onClick={() => removeItem(item.product.id)} className="text-[#D4AF37] hover:text-[#F8C8DC] transition-colors p-1">
                          <Trash2 size={16} className="md:w-5 md:h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 md:mt-6">
                        <div className="flex items-center bg-[#F5E9DC] rounded-full p-1 md:p-1.5 border-2 border-[#D4AF37]">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-7 md:w-9 h-7 md:h-9 rounded-full flex items-center justify-center hover:bg-[#FFFFFF] text-[#D4AF37]"><Minus size={12} className="md:w-4 md:h-4" /></button>
                          <span className="px-3 md:px-5 font-bold text-sm md:text-lg text-[#2d2416] font-sans">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 md:w-9 h-7 md:h-9 rounded-full flex items-center justify-center hover:bg-[#FFFFFF] text-[#D4AF37]"><Plus size={12} className="md:w-4 md:h-4" /></button>
                        </div>
                        <p className="text-xl md:text-2xl font-serif text-[#2d2416]">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 📜 Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#FFFFFF] text-[#2d2416] rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 sticky top-24 border-2 border-[#D4AF37] shadow-lg">
                <h2 className="text-xl md:text-2xl font-serif mb-6 md:mb-8 text-[#D4AF37]">Summary</h2>

                {/* --- 🏷️ Coupon Section --- */}
                <div className="mb-6 p-3 md:p-4 bg-[#F5E9DC] rounded-xl md:rounded-2xl border-2 border-[#D4AF37]">
                  <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Apply Coupon</p>
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="text" 
                      placeholder="Code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 min-w-0 bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[11px] md:text-xs text-[#2d2416] placeholder-[#5a4a42]/40 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans" 
                    />
                    <button 
                      onClick={handleApplyCoupon} 
                      className="shrink-0 bg-[#D4AF37] text-[#2d2416] px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[8px] md:text-[9px] font-bold uppercase hover:bg-[#F8C8DC] transition-all font-sans"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex justify-between text-[11px] md:text-sm uppercase tracking-wide text-[#5a4a42] font-sans">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[11px] md:text-sm uppercase tracking-wide text-[#D4AF37] font-bold font-sans">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[11px] md:text-sm uppercase tracking-wide font-sans">
                    <span className="text-[#5a4a42]">Shipping</span>
                    <span className="text-[#D4AF37] font-bold">Free</span>
                  </div>
                  
                  <div className="pt-4 md:pt-6 border-t-2 border-[#D4AF37] flex justify-between items-end">
                    <span className="text-[11px] md:text-sm font-bold uppercase text-[#5a4a42] font-sans">Total</span>
                    <span className="text-2xl md:text-4xl font-serif text-[#2d2416]">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href={{ pathname: '/checkout', query: { code: couponInput, discount: appliedDiscount } }}>
                    <button className="w-full bg-[#D4AF37] text-[#2d2416] py-3 md:py-5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#F8C8DC] hover:text-[#2d2416] transition-all flex items-center justify-center gap-2 font-sans">
                      Checkout Now <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                  </Link>
                  <Link href="/shop" className="block text-center text-[9px] md:text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#F8C8DC] mt-4 font-bold font-sans">
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