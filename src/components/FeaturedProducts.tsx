'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import ProductCard from './ProductCard'

interface FeaturedProductsProps {
  products: any[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="bg-[#fffdfa] py-24 px-6 relative overflow-hidden">
      {/* Subtle Background Branding */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none flex items-center justify-center">
        <Sparkles size={800} strokeWidth={0.5} className="text-[#0F2C3E]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* 🏛️ Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#db2777] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 block">
              Curated Selection
            </span>
            <h2 className="text-5xl md:text-6xl font-serif text-[#0F2C3E] leading-tight">
              Our <span className="italic font-light text-[#D4AF37]">Featured</span> <br /> 
              Collection
            </h2>
            <div className="w-20 h-[1px] bg-[#D4AF37] mt-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/shop" 
              className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-[#0F2C3E] hover:text-[#db2777] transition-all"
            >
              The Full Atelier
              <div className="w-10 h-10 rounded-full border border-[#0F2C3E]/10 flex items-center justify-center group-hover:bg-[#db2777] group-hover:border-[#db2777] group-hover:text-white transition-all">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 💎 Product Grid / Carousel */}
        {/* On mobile, it scrolls horizontally. On desktop, it forms a 4-column grid. */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 scrollbar-hide pb-10">
          {products.length > 0 ? (
            products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="min-w-[300px] md:min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            // Skeleton state if no products are passed
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[300px] md:min-w-0 h-[450px] bg-gray-50 rounded-[2.5rem] animate-pulse" />
            ))
          )}
        </div>

        {/* 🎀 Luxury Bottom Border Overlay */}
        <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
    </section>
  )
}