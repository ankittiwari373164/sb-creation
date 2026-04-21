'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

export default function VideoSection({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success('Added to your bag!', {
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '12px' }
    })
  }

  return (
    <section className="bg-[#0F2C3E] py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          
          {/* 📱 The Video Reel (Vertical) */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="relative aspect-[9/16] max-h-[600px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/5"
            >
              {/* Replace with your own jewelry video/reel */}
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-glass-blowing-process-4245-large.mp4" type="video/mp4" />
              </video>
              
              <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
                LIVE LOOK
              </div>
            </motion.div>
          </div>

          {/* 🛍️ Shoppable Details */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div>
              <span className="text-[#db2777] text-xs font-bold tracking-widest uppercase">
                Direct from Firozabad
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mt-2">
                See How We <br /> <span className="text-[#D4AF37]">Make It.</span>
              </h2>
            </div>

            <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              Watch our workers create every single piece by hand. We use traditional ways to make sure you get the best quality.
            </p>

            {/* Product Feature Box */}
            {product && (
              <div className="bg-white p-6 rounded-[2rem] flex items-center gap-5 shadow-lg max-w-sm mx-auto lg:mx-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                   <img src={product.image_url} alt="" className="object-cover w-full h-full" />
                </div>
                <div className="text-left">
                   <h4 className="text-[#0F2C3E] font-bold text-sm leading-tight mb-1">{product.name}</h4>
                   <div className="flex items-center gap-1 text-[#D4AF37] mb-2">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] text-gray-400">Best Seller</span>
                   </div>
                   <p className="text-[#db2777] font-bold text-lg">₹{product.price}</p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-[#db2777] text-white p-3 rounded-full hover:bg-[#0F2C3E] transition-colors"
                >
                  <ShoppingBag size={18} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}