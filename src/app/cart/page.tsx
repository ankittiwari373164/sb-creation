'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingBag size={40} strokeWidth={1} className="text-[#0F2C3E]/20" />
          </motion.div>
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-4">Your Bag is Empty</h2>
          <p className="text-[#0F2C3E]/50 mb-10 font-light italic">The finest handcrafted bangles are waiting for you.</p>
          <Link href="/shop">
            <button className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all shadow-xl">
              Discover Collections
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 border-b border-[#D4AF37]/10 pb-8">
            <div>
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">Your Selection</span>
              <h1 className="text-5xl font-serif text-[#0F2C3E] tracking-tighter">Shopping <span className="italic font-light">Bag</span></h1>
            </div>
            <p className="text-[#0F2C3E]/40 text-sm font-medium uppercase tracking-widest">
              {getTotalItems()} Artifacts Selected
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* 💎 Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-[2rem] border border-gray-50 p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(15,44,62,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(15,44,62,0.08)] transition-all group"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Product Image */}
                      <div className="relative w-full md:w-40 aspect-square flex-shrink-0 rounded-2xl overflow-hidden bg-[#FAF9F6]">
                        <Image
                          src={item.product.image_url || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-serif text-[#0F2C3E] mb-1 group-hover:text-[#db2777] transition-colors">
                              {item.product.name}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">{item.product.category}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-200" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">SKU: SBC-{item.product.id.toString().slice(0,4)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={20} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-6">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-[#FAF9F6] rounded-full p-1 w-fit border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F2C3E] hover:bg-white hover:shadow-sm transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm px-4 min-w-[3rem] text-center text-[#0F2C3E]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F2C3E] hover:bg-white hover:shadow-sm transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-serif text-[#0F2C3E]">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mt-1">
                              ₹{item.product.price.toLocaleString()} per piece
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 📜 Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#0F2C3E] text-white rounded-[2.5rem] p-10 sticky top-24 shadow-2xl overflow-hidden relative">
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
                
                <h2 className="text-2xl font-serif mb-10 uppercase tracking-widest text-[#D4AF37]">Summary</h2>

                <div className="space-y-6 mb-10 relative z-10">
                  <div className="flex justify-between text-sm opacity-60 font-light">
                    <span className="uppercase tracking-[0.2em]">Subtotal</span>
                    <span className="font-semibold tracking-tighter">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="uppercase tracking-[0.2em] opacity-60 font-light">Shipping</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full">Complimentary</span>
                  </div>
                  <div className="border-t border-white/10 pt-8 mt-8">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-bold uppercase tracking-[0.5em] opacity-40">Total Amount</span>
                      <span className="text-4xl font-serif text-[#D4AF37] tracking-tighter">
                        ₹{getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <Link href="/checkout">
                    <button className="w-full bg-[#D4AF37] text-[#0F2C3E] py-5 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl group flex items-center justify-center gap-3">
                      Begin Checkout
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </Link>

                  <Link href="/shop">
                    <button className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                      Return to Gallery
                    </button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Secure <br/>Payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-[#D4AF37]" />
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">Insured <br/>Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}