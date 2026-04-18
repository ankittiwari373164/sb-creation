'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, SlidersHorizontal, Sparkles } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

// SB Creation Specific Categories
const categories = [
  'All Collections',
  'Glass Heritage',
  'Metal Elegance',
  'Bridal Special',
  'Daily Adornments',
  'Velvet Finish',
  'Designer Kangan',
]

const sortOptions = [
  { value: 'newest', label: 'Latest Arrivals' },
  { value: 'price-low', label: 'Valuation: Low to High' },
  { value: 'price-high', label: 'Valuation: High to Low' },
  { value: 'name', label: 'Alphabetical' },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All Collections')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedCategory, searchQuery, sortBy])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    if (selectedCategory !== 'All Collections') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break
      default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      {/* 🏛️ Editorial Hero */}
      <section className="bg-[#0F2C3E] py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 block">
              Firozabad Heritage
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
              The <span className="italic font-light text-[#D4AF37]">Boutique</span> Gallery
            </h1>
            <p className="text-[#FAF9F6]/50 text-base max-w-xl mx-auto font-light leading-relaxed">
              Explore our curated selection of handcrafted bangles, where centuries of tradition meet modern elegance.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </section>

      {/* 🛠️ Shop Interface */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 📍 Sidebar: High-End Filter */}
          <aside className={`lg:w-72 ${showFilters ? 'fixed inset-0 z-50 bg-white p-10 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="sticky top-32 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-[#0F2C3E]">Collections</h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-[#0F2C3E]"><X size={24} /></button>
              </div>

              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => { setSelectedCategory(category); setShowFilters(false); }}
                    className={`w-full text-left py-2 text-sm transition-all duration-300 relative group ${
                      selectedCategory === category ? 'text-[#db2777] font-bold' : 'text-[#0F2C3E]/60 hover:text-[#0F2C3E]'
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <motion.div layoutId="activeCat" className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#D4AF37] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-[#D4AF37]/10">
                 <button 
                  onClick={() => { setSelectedCategory('All Collections'); setSearchQuery(''); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 hover:text-[#db2777]"
                 >
                   Reset Selection
                 </button>
              </div>
            </div>
          </aside>

          {/* 💎 Product Grid Area */}
          <main className="flex-1">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-3xl shadow-[0_10px_40px_-15px_rgba(15,44,62,0.05)] border border-[#D4AF37]/5">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] opacity-40 group-focus-within:opacity-100 transition-opacity" size={18} />
                <input
                  type="text"
                  placeholder="Find your artifact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-[#FAF9F6] border-none rounded-full text-sm focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-48 bg-[#FAF9F6] border-none rounded-full py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E] focus:ring-1 focus:ring-[#D4AF37]"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                
                <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden p-3 bg-[#0F2C3E] text-white rounded-full shadow-lg"
                >
                  <SlidersHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Catalog Info */}
            <div className="flex items-center gap-4 mb-8">
               <Sparkles size={16} className="text-[#D4AF37]" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/30">
                 Revealing {filteredProducts.length} Artisanal Pieces
               </p>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[2.5rem]" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-32">
                  <h3 className="text-3xl font-serif text-[#0F2C3E] opacity-20">The collection is currently empty</h3>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}