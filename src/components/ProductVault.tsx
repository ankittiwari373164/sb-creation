'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Eye, Plus } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

export default function ProductVault({ products }: { products: any[] }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success('Added to Collection', {
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '50px' }
    })
  }

  return (
    <section className="bg-white py-10 px-4 md:px-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0">
        {products.slice(0, 4).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square w-full overflow-hidden bg-[#FAF9F6]"
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

            {/* 🔘 Minimalist Buttons (Always visible on mobile, hover on desktop) */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={(e) => handleAddToCart(e, product)}
                className="w-12 h-12 md:w-14 md:h-14 bg-[#db2777] text-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-transform"
              >
                <ShoppingBag size={20} />
              </button>
              
              <Link 
                href={`/product/${product.slug}`}
                className="w-12 h-12 md:w-14 md:h-14 bg-white text-[#0F2C3E] rounded-full flex items-center justify-center shadow-2xl transform active:scale-90 transition-transform"
              >
                <Eye size={20} />
              </Link>
            </div>

            {/* 🏷️ Small Hover Label (Optional - shows only name on hover) */}
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] drop-shadow-md">
                 {product.name}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}