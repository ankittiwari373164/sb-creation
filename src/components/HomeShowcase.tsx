'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

export default function HomeShowcase() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestArrivals = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching arrivals:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestArrivals()
  }, [])

  return (
    <section className="relative pt-32 pb-20 px-6 bg-[#fffdfa] overflow-hidden">
      {/* 🏺 Artistic Background Element */}
      <div className="absolute top-20 right-[-10%] opacity-[0.03] pointer-events-none select-none">
        <Sparkles size={600} strokeWidth={0.5} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.7em] uppercase mb-5 block">
              Firozabad Heritage
            </span>
            <h2 className="text-6xl md:text-7xl font-serif text-[#0F2C3E] leading-[1.1]">
              Premier <br /> 
              <span className="italic font-light text-[#D4AF37]">Arrivals</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/shop" 
              className="group flex items-center gap-5 text-[11px] font-bold uppercase tracking-[0.4em] text-[#0F2C3E] hover:text-[#db2777] transition-all"
            >
              The Full Gallery 
              <div className="p-3 rounded-full border border-[#0F2C3E]/10 group-hover:border-[#db2777] transition-all">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* The Boutique Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[500px] bg-[#FAF9F6] rounded-[3rem] animate-pulse border border-gray-50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Optional View All Footer (Mobile Only) */}
        <div className="mt-16 text-center md:hidden">
            <Link href="/shop" className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] border-b border-[#D4AF37] pb-1">
                Explore All Artifacts
            </Link>
        </div>
      </div>
    </section>
  )
}