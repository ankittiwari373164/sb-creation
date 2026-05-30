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

  if (!mounted) return <div className="min-h-screen bg-white" />

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-[#F8C8DC]/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#F8C8DC]"
          >
            <ShoppingBag size={32} strokeWidth={1.2} className="text-[#d92b7a]" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-serif text-[#2d2416] mb-2">Your Bag is Empty</h2>
          <p className="text-[#5a4a42] text-sm md:text-base mb-8 font-sans">You haven't added any jewelry yet.</p>
          <Link href="/shop">
            <button className="bg-[#2d2416] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#0F5A7E] transition-all font-sans">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="mb-6 md:mb-8 border-b border-[#D4AF37]/40 pb-4">
            <h1 className="text-3xl md:text-4xl font-serif text-[#2d2416]">
              Your <span className="italic font-semibold text-[#d92b7a]">Bag</span>
            </h1>
            <p className="text-[#0F5A7E] text-xs font-bold uppercase tracking-widest mt-1 font-sans">
              {getTotalItems()} Items Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl p-4 md:p-5 border border-[#D4AF37]/40 shadow-sm flex gap-4 md:gap-5 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5E9DC]">
                      <Image
                        src={item.product.image_url || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base md:text-lg font-serif text-[#2d2416] truncate leading-snug">{item.product.name}</h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#D4AF37] hover:text-red-400 transition-colors shrink-0 p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center bg-[#F5E9DC] rounded-full p-1 border border-[#D4AF37]/50">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#2d2416] transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-3 font-bold text-sm text-[#2d2416] font-sans">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#2d2416] transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <p className="text-lg md:text-xl font-serif text-[#2d2416]">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-5 md:p-6 sticky top-20 border border-[#D4AF37]/50 shadow-md">
                <h2 className="text-xl font-serif mb-5 text-[#2d2416]">
                  Order <span className="italic text-[#d92b7a]">Summary</span>
                </h2>

                {/* Coupon */}
                <div className="mb-5 p-4 bg-[#F8C8DC]/10 rounded-xl border border-[#F8C8DC]/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F5A7E] mb-2 font-sans flex items-center gap-1.5">
                    <Tag size={11} /> Coupon Code
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 min-w-0 bg-white border border-[#D4AF37]/50 rounded-full px-4 py-2 text-sm text-[#2d2416] placeholder-[#5a4a42]/40 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="shrink-0 bg-[#2d2416] text-white px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-[#0F5A7E] transition-all font-sans"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-[#5a4a42] font-sans">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2d2416]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-[#d92b7a] font-sans">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-[#5a4a42]">Shipping</span>
                    <span className="text-[#0F5A7E] font-bold">Free</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/40 flex justify-between items-center mb-5">
                  <span className="text-sm font-bold uppercase tracking-wide text-[#5a4a42] font-sans">Total</span>
                  <span className="text-2xl md:text-3xl font-serif text-[#2d2416]">₹{finalTotal.toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  <Link href={{ pathname: '/checkout', query: { code: couponInput, discount: appliedDiscount } }}>
                    <button className="w-full bg-[#2d2416] text-white py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:bg-[#0F5A7E] transition-all flex items-center justify-center gap-2 font-sans">
                      Checkout Now <ArrowRight size={14} />
                    </button>
                  </Link>
                  <Link
                    href="/shop"
                    className="block text-center text-xs uppercase tracking-widest text-[#D4AF37] hover:text-[#d92b7a] font-bold font-sans pt-1 transition-colors"
                  >
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