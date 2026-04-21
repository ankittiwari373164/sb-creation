'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Eye, X, Check } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

export default function ProductVault({ products }: { products: any[] }) {
  const addItem = useCartStore((state) => state.addItem)

  // Size Popup States
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')

  const handleAddToCartInitiate = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProduct(product)
    setTempSize(product.sizes?.[0] || '2.4')
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        style: { background: '#1a1a2e', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  return (
    <section className="bg-slate-50 py-8 px-4 md:px-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0">
        {products.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square w-full overflow-hidden bg-white"
          >
            {/* 🖼️ Full-Bleed Product Image */}
            <Image
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* 🌑 Subtle Overlay on Hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* 🔘 Minimalist Buttons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={(e) => handleAddToCartInitiate(e, product)}
                className="w-12 h-12 md:w-14 md:h-14 bg-[#e8378e] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#1a1a2e] transform active:scale-90 transition-all"
              >
                <ShoppingBag size={20} />
              </button>
              
              <Link 
                href={`/product/${product.slug}`}
                className="w-12 h-12 md:w-14 md:h-14 bg-white text-[#1a1a2e] rounded-full flex items-center justify-center shadow-xl hover:bg-[#ffc857] hover:text-white transform active:scale-90 transition-all"
              >
                <Eye size={20} />
              </Link>
            </div>

            {/* 🏷️ Small Hover Label */}
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] drop-shadow-md">
                 {product.name}
               </p>
            </div>
          </motion.div>
        ))}
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
                <span className="text-[#e8378e] text-[10px] font-bold uppercase tracking-[0.4em] block">Select Bangle Size</span>
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