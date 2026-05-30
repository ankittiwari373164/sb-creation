'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Star } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

// ✏️ Replace with your actual testimonials
const REVIEWS = [
  {
    id: 1,
    author: 'Neha D.',
    initials: 'ND',
    rating: 5,
    text: 'Worth every penny! The craftsmanship is unmatched. I\'ve gifted these to my entire family.',
    date: '2024-05-04',
    featured: false,
  },
  {
    id: 2,
    author: 'Sanjana M.',
    initials: 'SM',
    rating: 5,
    text: 'Absolutely stunning! The glass bangles are so vibrant and elegant. Truly a piece of Firozabad\'s soul delivered to my doorstep.',
    date: '2024-05-07',
    featured: true,
  },
  {
    id: 3,
    author: 'Divya K.',
    initials: 'DK',
    rating: 5,
    text: 'Premium quality at its best. Delivery was quick, packaging was beautiful. Highly recommended!',
    date: '2024-05-09',
    featured: false,
  },
]

export default function ArtisanalStack() {
  const addItem = useCartStore((state) => state.addItem)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        icon: '💍',
        style: { background: '#0F2C3E', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  return (
    <>
      <section className="bg-[#FFF0F5] py-10 md:py-14 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">

          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0F2C3E] mb-2">
              Why <span className="italic text-[#db2777]">Trust SB Creation?</span>
            </h2>
            <p className="text-[#db2777] text-sm font-semibold tracking-wide mb-2">
              Loved by Thousands
            </p>
            <p className="text-[#6b6b6b] text-xs md:text-sm max-w-md mx-auto leading-relaxed font-light">
              We ensure high-quality craftsmanship, durability, and skin-friendly comfort. Shop globally with our fast and secure international shipping services.
            </p>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className={`relative bg-white rounded-2xl p-5 flex flex-col gap-3 ${
                  review.featured
                    ? 'border-2 border-[#db2777] shadow-md'
                    : 'border border-[#F8C8DC] shadow-sm'
                }`}
              >
                {/* Featured badge */}
                

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#db2777] text-[#db2777]" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i + review.rating} size={14} className="text-[#F8C8DC]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-serif text-sm text-[#0F2C3E] italic leading-relaxed flex-1">
                  "{review.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-[#F8C8DC] pt-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                    review.featured ? 'bg-[#db2777]' : 'bg-[#0F2C3E]'
                  }`}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2C3E] leading-none mb-0.5">{review.author}</p>
                    <p className="text-[11px] text-[#9b9b9b]">
                      {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Size Selection Popup */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#0F2C3E]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xs rounded-2xl p-6 shadow-lg border-2 border-[#F8C8DC]"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-[#0F2C3E] opacity-50 hover:text-[#db2777] transition-colors">
                <X size={16} />
              </button>
              <div className="text-center space-y-3">
                <span className="text-[#0F5A7E] text-[9px] font-bold uppercase tracking-[0.3em] block">Select Size</span>
                <h3 className="text-xl font-serif text-[#0F2C3E]">{selectedProduct.name}</h3>
                <div className="flex justify-center gap-2 py-3">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-10 h-10 rounded-full border-2 font-bold text-[10px] transition-all ${
                        tempSize === size ? 'bg-[#0F2C3E] text-white border-[#0F2C3E]' : 'border-[#F8C8DC] text-[#0F2C3E] hover:border-[#db2777]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={confirmAddToCart}
                  className="w-full bg-[#0F2C3E] text-white py-3 rounded-full font-bold uppercase text-[9px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#db2777] transition-all"
                >
                  <Check size={10} /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}