'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Sparkles } from 'lucide-react'

interface ProductGridProps {
  products: any[]
  title?: string
}

export default function ProductGrid({ products, title = "Signature Collection" }: ProductGridProps) {
  return (
    <section className="bg-[#fffdfa] py-16 md:py-32 px-4 md:px-10 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        
        {/* 🏺 Luxury Header */}
        <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[1px] w-6 bg-[#D4AF37]" />
            <span className="text-[#db2777] text-[10px] font-bold tracking-[0.5em] uppercase">
              The SB Atelier
            </span>
            <div className="h-[1px] w-6 bg-[#D4AF37]" />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] leading-tight capitalize">
            {title.split(' ')[0]} <span className="italic font-light text-[#D4AF37]">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
        </div>

        {/* 💎 The Fixed Responsive Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-12 grid-wrapper">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: (index % 2) * 0.1, 
                  ease: [0.215, 0.61, 0.355, 1] 
                }}
                className="mobile-btn-fix"
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-[#FAF9F6] rounded-[2.5rem] animate-pulse" />
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          /* Circular Pink Button for Mobile */
          .mobile-btn-fix button {
            padding: 0 !important;
            width: 38px !important;
            height: 38px !important;
            min-width: 38px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: #db2777 !important;
            box-shadow: 0 4px 12px rgba(219, 39, 119, 0.2) !important;
          }

          /* Hide "Add" text on phones */
          .mobile-btn-fix button span {
            display: none !important;
          }

          /* Modern Typography Scaling */
          .mobile-btn-fix h3 {
            font-size: 14px !important;
            letter-spacing: -0.01em !important;
            margin-bottom: 4px !important;
          }

          /* Alignment Fix */
          .mobile-btn-fix .flex.items-center.justify-between {
            margin-top: 10px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  )
}