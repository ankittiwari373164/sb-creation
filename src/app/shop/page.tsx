'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react'
import { supabase, Product } from '../../lib/supabase'
import ProductCard from '../../components/ProductCard'

// Available Options for Filters
const availableSizes = ['2.2', '2.4', '2.6', '2.8', 'Free Size']
const availableCategories = [
  'Glass Bangles',
  'Metal Bangles/Kadas',
  'Bangles Box',
  'Bangle Set',
  'Bracelets & Watches',
]

const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('price-low')
  const [showFilters, setShowFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedSizes, selectedCategories, searchQuery, sortBy])

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

    // Size Filter Logic
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p: any) => p.sizes?.some((s: string) => selectedSizes.includes(s)))
    }

    // Category Filter Logic
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p: any) =>
        selectedCategories.some(cat => p.category === cat || p.tags?.includes(cat))
      )
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
    }
    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 🏛️ Editorial Hero */}
      <section className="bg-gradient-to-br from-[#F5E9DC] to-[#FFFFF0] py-0.5 md:py-1 lg:py-2 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#0F5A7E] text-[7px] md:text-[9px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase mb-1 md:mb-3 block">
              Firozabad Heritage
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#2d2416] mb-2 md:mb-4">
              The <span className="italic font-semibold text-[#d92b7a]">Boutique</span> Gallery
            </h1>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
      </section>

      {/* 🛠️ Shop Interface */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 lg:py-5">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

          {/* 📍 Sidebar: Filters */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white overflow-y-auto' : 'hidden lg:block'}`}>
            <div className={`${showFilters ? 'p-4 md:p-6' : ''} sticky top-0 lg:top-28 space-y-4 md:space-y-6 lg:space-y-10`}>

              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-2 md:pb-3 lg:pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="md:w-4 md:h-4 text-[#D4AF37]" />
                  <h2 className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416]">Refine</h2>
                </div>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-[#2d2416] bg-gray-50 p-1.5 md:p-2 rounded-full">
                  <X size={14} className="md:w-4 md:h-4" />
                </button>
              </div>

              {/* 🗂️ Category Filter */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Category</h3>
                  {selectedCategories.length > 0 && (
                    <span className="text-[7px] md:text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-bold">{selectedCategories.length}</span>
                  )}
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategories(prev =>
                            isSelected ? prev.filter(c => c !== cat) : [...prev, cat]
                          )
                          setShowFilters(false)
                        }}
                        className={`w-full flex items-center gap-2 py-1 md:py-1.5 text-[8px] md:text-xs transition-all duration-300 group ${
                          isSelected ? 'text-[#0F5A7E] font-bold' : 'text-[#2d2416] hover:text-[#D4AF37]'
                        }`}
                      >
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#0F5A7E]' : 'border-gray-300 group-hover:border-[#D4AF37]'
                        }`}>
                          {isSelected && <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-[#0F5A7E] rounded-full" />}
                        </div>
                        <span className="truncate text-left">{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 📏 Size Filter */}
              <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 lg:pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Measurements</h3>
                  {selectedSizes.length > 0 && (
                    <span className="text-[7px] md:text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-bold">{selectedSizes.length}</span>
                  )}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-2 gap-1 md:gap-1.5">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size)
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes(prev => isSelected ? prev.filter(s => s !== size) : [...prev, size])}
                        className={`py-1 md:py-1.5 px-1 text-center text-[7px] md:text-[10px] font-bold border rounded-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#0F5A7E] text-white border-[#0F5A7E] shadow-inner'
                            : 'bg-gray-50 border-gray-100 text-[#2d2416] hover:border-[#D4AF37] hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 🔄 Sort Section */}
              <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 lg:pt-6 border-t border-gray-100">
                <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Sort</h3>
                <div className="space-y-0.5 md:space-y-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full flex items-center gap-2 py-1 md:py-1.5 text-[8px] md:text-xs transition-all duration-300 group ${
                        sortBy === option.value ? 'text-[#0F5A7E] font-bold' : 'text-[#2d2416] hover:text-[#D4AF37]'
                      }`}
                    >
                      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border flex items-center justify-center transition-all ${
                        sortBy === option.value ? 'border-[#0F5A7E]' : 'border-gray-300 group-hover:border-[#D4AF37]'
                      }`}>
                        {sortBy === option.value && <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-[#0F5A7E] rounded-full" />}
                      </div>
                      <span className="truncate">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 🔄 Reset Filters */}
              <div className="pt-4 md:pt-6 lg:pt-8">
                <button
                  onClick={() => {
                    setSelectedSizes([])
                    setSelectedCategories([])
                    setSearchQuery('')
                    setSortBy('price-low')
                  }}
                  className="w-full py-2 md:py-2.5 lg:py-3 bg-[#F5E9DC] text-[#2d2416] text-[7px] md:text-[8px] lg:text-[9px] font-bold uppercase tracking-widest rounded-full hover:bg-[#D4AF37] hover:text-white transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* 💎 Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 md:mb-8 gap-2 md:gap-4">
              <div className="relative w-full md:flex-1 group bg-[#F5E9DC] rounded-full border-2 border-[#D4AF37] px-3 md:px-4 py-1.5 md:py-2 flex items-center">
                <Search className="absolute left-3 md:left-4 text-[#2d2416] opacity-40 group-focus-within:text-[#0F5A7E] group-focus-within:opacity-100 transition-all" size={14} />
                <input
                  type="text"
                  placeholder="Find your artifact..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 md:pl-8 pr-2 bg-transparent border-none text-xs md:text-sm text-[#2d2416] outline-none placeholder:text-[#2d2416] placeholder:opacity-40"
                />
              </div>

              {/* Mobile: Refine + Sort buttons together on left */}
              <div className="flex items-stretch gap-2 md:gap-3 lg:hidden">
                <button
                  onClick={() => setShowFilters(true)}
                  className="p-1.5 md:p-2.5 bg-[#2d2416] text-white rounded-full shadow-md hover:bg-[#0F5A7E] transition-all flex items-center justify-center gap-1.5"
                >
                  <SlidersHorizontal size={14} className="md:w-4 md:h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-widest pr-1">Refine</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(prev => !prev)}
                    className="p-1.5 md:p-2.5 bg-white border-2 border-[#D4AF37] text-[#2d2416] rounded-full shadow-sm hover:border-[#0F5A7E] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="text-[8px] font-bold uppercase tracking-widest pl-1">Sort</span>
                    <ChevronDown size={12} className={`mr-1 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#D4AF37] rounded-xl shadow-lg z-50 min-w-[160px] overflow-hidden">
                      {sortOptions.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setSortBy(o.value); setShowSortDropdown(false) }}
                          className={`w-full text-left px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${
                            sortBy === o.value ? 'bg-[#0F5A7E] text-white' : 'text-[#2d2416] hover:bg-[#F5E9DC]'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Catalog Info */}
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-2">
              <Sparkles size={12} className="md:w-3.5 md:h-3.5 text-[#0F5A7E]" />
              <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                Revealing {filteredProducts.length} Pieces
              </p>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square md:aspect-[3/4] bg-[#F5E9DC] animate-pulse rounded-lg md:rounded-[2rem]" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 md:py-24 bg-gray-50 rounded-2xl md:rounded-[3rem] border border-gray-100 mt-4 col-span-2 md:col-span-2 lg:col-span-3">
                  <h3 className="text-xl md:text-2xl font-serif text-[#2d2416] opacity-40">The collection is currently empty</h3>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}