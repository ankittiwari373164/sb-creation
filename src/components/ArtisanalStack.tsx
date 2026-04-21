'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

export default function ArtisanalStack({ products }: { products: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to Collection`, {
      icon: '💍',
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '50px' }
    })
  }

  // Display top 5 products in the stack
  const stackItems = products.slice(0, 5)

  return (
    <section className="bg-[#fffggg] py-1 px-6 overflow-hidden min-h-[550px] flex items-center">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* 📜 Left Side: Content Reveal */}
        <div className="order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#db2777] text-[10px] font-bold tracking-[0.5em] uppercase">
                  Masterpiece {activeIndex + 1}
                </span>
                <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] leading-tight">
                {stackItems[activeIndex]?.name}
              </h2>
              
              <p className="text-gray-500 text-lg leading-relaxed max-w-md italic">
                "{stackItems[activeIndex]?.description}"
              </p>

              <div className="flex items-center gap-8 pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Acquisition Price</span>
                  <span className="text-3xl font-serif text-[#db2777]">₹{stackItems[activeIndex]?.price.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(e, stackItems[activeIndex])}
                  className="bg-[#0F2C3E] text-white px-10 py-5 rounded-full flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all shadow-xl"
                >
                  Add to Collection <ShoppingBag size={16} />
                </button>
              </div>

              <Link 
                href={`/product/${stackItems[activeIndex]?.slug}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#0F2C3E] transition-colors pt-4"
              >
                View Full Narrative <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🖼️ Right Side: The Interactive Card Stack */}
        <div className="relative h-[500px] w-full flex items-center justify-center order-1 lg:order-2">
          {stackItems.map((product, index) => {
            const isTop = index === activeIndex
            const position = index - activeIndex

            return (
              <motion.div
                key={product.id}
                style={{ zIndex: stackItems.length - Math.abs(position) }}
                animate={{
                  x: position * 40,
                  scale: 1 - Math.abs(position) * 0.05,
                  rotate: position * 5,
                  opacity: Math.abs(position) > 2 ? 0 : 1,
                }}
                whileHover={isTop ? { scale: 1.02, rotate: 0 } : {}}
                onClick={() => setActiveIndex(index)}
                className={`absolute cursor-pointer w-[300px] md:w-[380px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-white transition-shadow duration-500 ${isTop ? 'ring-2 ring-[#D4AF37]/20' : 'grayscale-[0.5]'}`}
              >
                <Image 
                  src={product.image_url || '/placeholder.jpg'} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                
                {isTop && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="absolute top-6 right-6"
                  >
                    <Sparkles className="text-white" size={24} />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}