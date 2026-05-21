'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  useEffect(() => { setMounted(true) }, [])

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

  if (!mounted) return <div className="min-h-screen bg-[#F5E9DC]" />

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5E9DC] flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]">
            <ShoppingBag size={28} strokeWidth={1} className="text-[#D4AF37]" />
          </motion.div>
          <h2 className="text-2xl font-serif text-[#2d2416] mb-1">Your Bag is Empty</h2>
          <p className="text-[#5a4a42] text-sm mb-6 font-sans">You haven't added any jewelry yet.</p>
          <Link href="/shop">
            <button className="bg-[#D4AF37] text-[#2d2416] px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8C8DC] transition-all font-sans">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5E9DC] py-4 px-3 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="mb-4 border-b border-[#D4AF37] pb-3">
            <h1 className="text-2xl md:text-3xl font-serif text-[#2d2416]">Your <span className="italic font-semibold text-[#d92b7a]">Bag</span></h1>
            <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest mt-0.5 font-sans">
              {getTotalItems()} Items Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">

            {/* Items List */}
            <div className="lg:col-span-8 space-y-2.5">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl p-3 md:p-4 border border-[#D4AF37] shadow-sm flex gap-3 md:gap-5"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5E9DC]">
                      <Image src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} fill className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm md:text-base font-bold text-[#2d2416] font-serif truncate">{item.product.name}</h3>
                        <button onClick={() => removeItem(item.product.id)} className="text-[#D4AF37] hover:text-red-400 transition-colors shrink-0">
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty */}
                        <div className="flex items-center bg-[#F5E9DC] rounded-full p-0.5 border border-[#D4AF37]">
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-[#D4AF37]">
                            <Minus size={10} />
                          </button>
                          <span className="px-2.5 font-bold text-xs text-[#2d2416] font-sans">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-[#D4AF37]">
                            <Plus size={10} />
                          </button>
                        </div>
                        <p className="text-base md:text-lg font-serif text-[#2d2416]">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white text-[#2d2416] rounded-2xl p-4 sticky top-20 border border-[#D4AF37] shadow-md">
                <h2 className="text-base font-serif mb-3 text-[#D4AF37]">Summary</h2>

                {/* Coupon */}
                <div className="mb-3 p-2.5 bg-[#F5E9DC] rounded-xl border border-[#D4AF37]">
                  <p className="text-[7px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Coupon Code</p>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 min-w-0 bg-white border border-[#D4AF37] rounded-full px-3 py-1 text-[10px] text-[#2d2416] placeholder-[#5a4a42]/40 focus:ring-1 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="shrink-0 bg-[#D4AF37] text-[#2d2416] px-3 py-1 rounded-full text-[8px] font-bold uppercase hover:bg-[#F8C8DC] transition-all font-sans"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-wide text-[#5a4a42] font-sans">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[10px] uppercase tracking-wide text-[#D4AF37] font-bold font-sans">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[10px] uppercase tracking-wide font-sans">
                    <span className="text-[#5a4a42]">Shipping</span>
                    <span className="text-[#D4AF37] font-bold">Free</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#D4AF37] flex justify-between items-center mb-3">
                  <span className="text-[9px] font-bold uppercase text-[#5a4a42] font-sans">Total</span>
                  <span className="text-xl font-serif text-[#2d2416]">₹{finalTotal.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <Link href={{ pathname: '/checkout', query: { code: couponInput, discount: appliedDiscount } }}>
                    <button className="w-full bg-[#D4AF37] text-[#2d2416] py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-md hover:bg-[#F8C8DC] transition-all flex items-center justify-center gap-2 font-sans">
                      Checkout Now <ArrowRight size={13} />
                    </button>
                  </Link>
                  <Link href="/shop" className="block text-center text-[8px] uppercase tracking-widest text-[#D4AF37] hover:text-[#F8C8DC] font-bold font-sans pt-0.5">
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