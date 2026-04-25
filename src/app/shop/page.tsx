'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, SlidersHorizontal, Sparkles } from 'lucide-react'
import { supabase, Product } from '../../lib/supabase'
import ProductCard from '../../components/ProductCard'

const priceRanges = [
  { label: 'All Artifacts', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity },
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
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedPriceRange, searchQuery, sortBy])

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
    
    // Price Filter Logic
    filtered = filtered.filter((p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max)

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
    <div className="min-h-screen bg-white">
      {/* 🏛️ Editorial Hero - Tightened Spacing */}
      <section className="bg-[#fff1f2] py-1 md:py-2 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#db2777] text-[9px] font-bold tracking-[0.5em] uppercase mb-3 block">
              Firozabad Heritage
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] mb-4">
              The <span className="italic font-light text-[#db2777]">Boutique</span> Gallery
            </h1>
            {/* <p className="text-gray-500 text-sm max-w-xl mx-auto font-light leading-relaxed">
              Explore our curated selection of handcrafted bangles, where centuries of tradition meet modern elegance.
            </p> */}
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px]" />
      </section>

      {/* 🛠️ Shop Interface */}
      <div className="container mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 📍 Sidebar: Compact Filter */}
          <aside className={`lg:w-64 ${showFilters ? 'fixed inset-0 z-50 bg-white p-8 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="sticky top-28 space-y-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]">Price Range</h2>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-gray-400"><X size={20} /></button>
              </div>

              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => { setSelectedPriceRange(range); setShowFilters(false); }}
                    className={`w-full text-left py-1.5 text-xs transition-all duration-300 relative group ${
                      selectedPriceRange.label === range.label ? 'text-[#db2777] font-bold' : 'text-gray-400 hover:text-[#0F2C3E]'
                    }`}
                  >
                    {range.label}
                    {selectedPriceRange.label === range.label && (
                      <motion.div layoutId="activeRange" className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-[#db2777] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-50">
                  <button 
                   onClick={() => { setSelectedPriceRange(priceRanges[0]); setSearchQuery(''); }}
                   className="text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-[#db2777]"
                  >
                    Reset Filter
                  </button>
              </div>
            </div>
          </aside>

          {/* 💎 Product Grid Area */}
          <main className="flex-1">
            {/* Control Bar - Slimmer Profile */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#F9FAFB] p-3 rounded-full border border-gray-100">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#db2777] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Find your artifact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-6 py-2 bg-transparent border-none text-sm text-[#0F2C3E] outline-none placeholder:text-gray-300"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto px-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-44 bg-white border-none rounded-full py-2 px-4 text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E] shadow-sm outline-none cursor-pointer"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                
                <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden p-2 bg-[#0F2C3E] text-white rounded-full shadow-md"
                >
                  <SlidersHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Catalog Info - Reduced Spacing */}
            <div className="flex items-center gap-3 mb-6">
               <Sparkles size={14} className="text-[#db2777]" />
               <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300">
                 Revealing {filteredProducts.length} Pieces
               </p>
            </div>

            {/* Grid - Tightened Gap */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-[2rem]" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-24">
                  <h3 className="text-2xl font-serif text-gray-200">The collection is currently empty</h3>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}