'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowUpRight, Sparkles, X, Check } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

export default function ArtisanalStack({ products }: { products: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  // Size Popup States
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')

  const handleAddToCartInitiate = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    setSelectedProduct(product)
    setTempSize(product.sizes?.[0] || '2.4')
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        icon: '💍',
        style: { background: '#1a1a2e', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  // Display top 5 products in the stack
  const stackItems = products.slice(0, 5)

  return (
    <section className="bg-amber-50 py-12 px-6 overflow-hidden min-h-[550px] flex items-center">
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
                <span className="text-[#e8378e] text-[10px] font-bold tracking-[0.5em] uppercase">
                  Masterpiece {activeIndex + 1}
                </span>
                <div className="h-[1px] w-12 bg-[#ffc857]/30" />
              </div>
              
              <h2 className="text-5xl md:text-7xl font-serif text-[#1a1a2e] leading-tight">
                {stackItems[activeIndex]?.name}
              </h2>
              
              <p className="text-gray-500 text-lg leading-relaxed max-w-md italic">
                "{stackItems[activeIndex]?.description}"
              </p>

              <div className="flex items-center gap-8 pt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Acquisition Price</span>
                  <span className="text-3xl font-serif text-[#e8378e]">₹{stackItems[activeIndex]?.price.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={(e) => handleAddToCartInitiate(e, stackItems[activeIndex])}
                  className="bg-[#1a1a2e] text-white px-10 py-5 rounded-full flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#e8378e] transition-all shadow-lg"
                >
                  Add to Collection <ShoppingBag size={16} />
                </button>
              </div>

              <Link 
                href={`/product/${stackItems[activeIndex]?.slug}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1a1a2e] transition-colors pt-4"
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
                className={`absolute cursor-pointer w-[300px] md:w-[380px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white transition-shadow duration-500 ${isTop ? 'ring-2 ring-[#ffc857]/30' : 'grayscale-[0.3]'}`}
              >
                <Image 
                  src={product.image_url || '/placeholder.jpg'} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/30 via-transparent to-transparent opacity-40" />
                
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

      {/* --- 📏 Size Selection Popup --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#e8378e]"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <span className="text-[#e8378e] text-[10px] font-bold uppercase tracking-[0.4em] block">Select Size</span>
                <h3 className="text-2xl font-serif text-[#1a1a2e]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-3 py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
                        : 'border-gray-200 text-[#1a1a2e] hover:border-[#e8378e]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#1a1a2e] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#e8378e] transition-all"
                >
                  <Check size={14} /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}