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
        style: { background: '#db2777', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  return (
    <section className="relative py-12 md:py-20 px-4 md:px-0 overflow-hidden bg-gradient-to-tr from-[#fff1f2] via-white to-[#fff1f2]">
      
      {/* 🌸 VISIBLE Decorative Logo Watermarks */}
      <div className="absolute top-0 left-0 w-72 h-72 md:w-[500px] md:h-[500px] opacity-50 pointer-events-none -translate-x-1/4 -translate-y-1/4 z-0">
        <Image src="/logo sb.jpg" alt="Floral Motif" fill className="object-contain" unoptimized />
      </div>
      <div className="absolute bottom-0 right-0 w-72 h-72 md:w-[500px] md:h-[500px] opacity-50 pointer-events-none translate-x-1/4 translate-y-1/4 z-0">
        <Image src="/logo sb.jpg" alt="Floral Motif" fill className="object-contain" unoptimized />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[4/5] w-full overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-white"
            >
              {/* 🖼️ Full-Bleed Product Image */}
              <Image
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* 🌑 Subtle Overlay on Hover */}
              <div className="absolute inset-0 bg-[#0F2C3E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* 🔘 Minimalist Buttons */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100">
                <button
                  onClick={(e) => handleAddToCartInitiate(e, product)}
                  className="w-12 h-12 md:w-14 md:h-14 bg-[#db2777] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#0F2C3E] transform active:scale-90 transition-all"
                >
                  <ShoppingBag size={20} />
                </button>
                
                <Link 
                  href={`/product/${product.slug}`}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white text-[#0F2C3E] rounded-full flex items-center justify-center shadow-xl hover:bg-[#db2777] hover:text-white transform active:scale-90 transition-all"
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
              className="absolute inset-0 bg-[#0F2C3E]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-gray-100"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#db2777] bg-gray-50 p-2 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center space-y-4 mt-2">
                <span className="text-[#db2777] text-[9px] font-bold uppercase tracking-[0.4em] block">Select Bangle Size</span>
                <h3 className="text-2xl font-serif text-[#0F2C3E]">{selectedProduct.name}</h3>
                
                <div className="flex flex-wrap justify-center gap-3 py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#0F2C3E] text-white border-[#0F2C3E] shadow-md' 
                        : 'border-gray-100 text-[#0F2C3E] hover:border-[#db2777] hover:text-[#db2777]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#0F2C3E] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#db2777] transition-all shadow-lg"
                >
                  <Check size={16} /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}