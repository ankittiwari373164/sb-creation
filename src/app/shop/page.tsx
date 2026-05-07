'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, SlidersHorizontal, Sparkles, Check } from 'lucide-react'
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

// Available Options for Filters
const availableSizes = ['2.2', '2.4', '2.6', '2.8', 'Free Size']
const availableColors = ['Red', 'Green', 'Blue', 'Gold', 'Silver', 'Pink', 'Black', 'Multicolor']

// Helper to map color names to actual CSS backgrounds
const getColorStyle = (color: string) => {
  const map: Record<string, string> = {
    'Red': 'bg-red-600',
    'Green': 'bg-emerald-600',
    'Blue': 'bg-blue-600',
    'Gold': 'bg-gradient-to-br from-[#D4AF37] to-[#aa8c2c]',
    'Silver': 'bg-gradient-to-br from-gray-200 to-gray-400',
    'Pink': 'bg-pink-400',
    'Black': 'bg-black',
    'Multicolor': 'bg-gradient-to-tr from-pink-500 via-yellow-400 to-blue-500'
  }
  return map[color] || 'bg-gray-200'
}

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
  
  // Filter States
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedPriceRange, selectedSizes, selectedColors, searchQuery, sortBy])

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

    // Size Filter Logic (using :any to prevent TypeScript errors based on previous fix)
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p: any) => p.sizes?.some((s: string) => selectedSizes.includes(s)))
    }

    // Colour Filter Logic (using :any to prevent TypeScript errors based on previous fix)
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p: any) => p.colors?.some((c: string) => selectedColors.includes(c)))
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
    <div className="min-h-screen bg-white">
      {/* 🏛️ Editorial Hero - Tightened Spacing */}
      <section className="bg-gradient-to-br from-[#F5E9DC] to-[#FFFFF0] py-1 md:py-2 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#0F5A7E] text-[9px] font-bold tracking-[0.5em] uppercase mb-3 block">
              Firozabad Heritage
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2d2416] mb-4">
              The <span className="italic font-light text-[#D4AF37]">Boutique</span> Gallery
            </h1>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
      </section>

      {/* 🛠️ Shop Interface */}
      <div className="container mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* 📍 Sidebar: Creative & Visual Filters */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white p-8 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="sticky top-28 space-y-10">
              
              <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-[#D4AF37]" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[#2d2416]">Refine</h2>
                </div>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-[#2d2416] bg-gray-50 p-2 rounded-full"><X size={16} /></button>
              </div>

              {/* 💵 Price Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2416] opacity-60">Valuation</h3>
                <div className="space-y-1">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => { setSelectedPriceRange(range); setShowFilters(false); }}
                      className={`w-full flex items-center gap-3 py-2 text-xs transition-all duration-300 group ${
                        selectedPriceRange.label === range.label ? 'text-[#0F5A7E] font-bold' : 'text-[#2d2416] hover:text-[#D4AF37]'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                        selectedPriceRange.label === range.label ? 'border-[#0F5A7E]' : 'border-gray-300 group-hover:border-[#D4AF37]'
                      }`}>
                        {selectedPriceRange.label === range.label && <div className="w-1.5 h-1.5 bg-[#0F5A7E] rounded-full" />}
                      </div>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🎨 Colour Filter (Creative Visual Swatches) */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2416] opacity-60">Palette</h3>
                  {selectedColors.length > 0 && <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">{selectedColors.length}</span>}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {availableColors.map(color => {
                    const isSelected = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        title={color}
                        onClick={() => setSelectedColors(prev => isSelected ? prev.filter(c => c !== color) : [...prev, color])}
                        className={`relative aspect-square rounded-full transition-all duration-300 shadow-sm ${getColorStyle(color)} ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[#0F5A7E] scale-95' : 'hover:scale-110 hover:shadow-md'
                        }`}
                      >
                        {isSelected && (
                          <Check 
                            size={14} 
                            strokeWidth={3} 
                            className={`absolute inset-0 m-auto ${color === 'Silver' ? 'text-black' : 'text-white drop-shadow-md'}`} 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 📏 Size Filter (Creative Grid Tags) */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2416] opacity-60">Measurements</h3>
                  {selectedSizes.length > 0 && <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">{selectedSizes.length}</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => isSelected ? prev.filter(s => s !== size) : [...prev, size])}
                        className={`py-2 px-1 text-center text-[10px] font-bold border rounded-lg transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#0F5A7E] text-white border-[#0F5A7E] shadow-inner' 
                            : 'bg-gray-50 border-gray-100 text-[#2d2416] hover:border-[#D4AF37] hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 🔄 Reset Filters */}
              <div className="pt-8">
                  <button 
                   onClick={() => { 
                     setSelectedPriceRange(priceRanges[0]); 
                     setSelectedSizes([]); 
                     setSelectedColors([]); 
                     setSearchQuery(''); 
                   }}
                   className="w-full py-3 bg-[#F5E9DC] text-[#2d2416] text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-white transition-all"
                  >
                    Clear All Filters
                  </button>
              </div>
            </div>
          </aside>

          {/* 💎 Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Control Bar - Slimmer Profile */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#F5E9DC] p-3 rounded-full border-2 border-[#D4AF37]">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2d2416] opacity-40 group-focus-within:text-[#0F5A7E] group-focus-within:opacity-100 transition-all" size={16} />
                <input
                  type="text"
                  placeholder="Find your artifact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-6 py-2 bg-transparent border-none text-sm text-[#2d2416] outline-none placeholder:text-[#2d2416] placeholder:opacity-40"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto px-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-44 bg-white border-2 border-[#D4AF37] rounded-full py-2 px-4 text-[9px] font-bold uppercase tracking-widest text-[#2d2416] shadow-sm outline-none cursor-pointer hover:border-[#0F5A7E] transition-colors appearance-none"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                
                <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden p-3 bg-[#2d2416] text-white rounded-full shadow-md hover:bg-[#0F5A7E] transition-all"
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Catalog Info - Reduced Spacing */}
            <div className="flex items-center gap-3 mb-6 px-2">
               <Sparkles size={14} className="text-[#0F5A7E]" />
               <p className="text-[9px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                 Revealing {filteredProducts.length} Pieces
               </p>
            </div>

            {/* Grid - Tightened Gap */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-[#F5E9DC] animate-pulse rounded-[2rem]" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-gray-100 mt-4">
                  <h3 className="text-2xl font-serif text-[#2d2416] opacity-40">The collection is currently empty</h3>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}