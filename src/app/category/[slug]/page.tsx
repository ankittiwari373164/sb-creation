'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, X, SlidersHorizontal, Sparkles, Check } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import ProductCard from '../../../components/ProductCard'
import Link from 'next/link'

// Helper function translates the URL slug back to exact Database Category Name
const getCategoryName = (slug: string) => {
  const categoryMap: Record<string, string> = {
    'glass-bangles': 'Glass Bangles',
    'metal-bangles-kadas': 'Metal Bangles/Kadas',
    'bangles-box': 'Bangles box',
    'bangle-sets': 'Bangle Sets',
    'bracelets-watches': 'Bracelets & Watches'
  }
  return categoryMap[slug] || slug.replace(/-/g, ' ')
}

const priceRanges = [
  { label: 'All Artifacts', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: Infinity },
]

const availableSizes = ['2.2', '2.4', '2.6', '2.8', 'Free Size']
const availableColors = ['Red', 'Green', 'Blue', 'Gold', 'Silver', 'Pink', 'Black', 'Multicolor']

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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = getCategoryName(params.slug)

  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
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
  }, [categoryName]) // Re-fetch if category changes

  useEffect(() => {
    filterAndSortProducts()
  }, [products, selectedPriceRange, selectedSizes, selectedColors, searchQuery, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryName) // 💎 Fetch ONLY products for this category
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching category products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Price Filter
    filtered = filtered.filter((p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max)

    // Size Filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p: any) => p.sizes?.some((s: string) => selectedSizes.includes(s)))
    }

    // Colour Filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p: any) => p.colors?.some((c: string) => selectedColors.includes(c)))
    }

    // Search Filter
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sorting Logic
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break
      default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Category Header */}
      <section className="bg-[#fff1f2] py-12 md:py-16 text-center border-b border-[#db2777]/10 mb-8">
        <div className="container mx-auto px-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#db2777] mb-3">
            SB Creation Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#0F2C3E]">
            {categoryName}
          </h1>
        </div>
      </section>

      {/* 🛠️ Shop Interface */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 lg:py-14">
        {products.length === 0 && !loading ? (
          // Empty State (If no products exist in the database for this category yet)
          <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-2xl font-serif text-[#0F2C3E] mb-4">No products found in this category yet.</h3>
            <p className="text-gray-500 mb-8">Our artisans are currently crafting new pieces. Check back soon!</p>
            <Link
              href="/shop"
              className="inline-block bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all shadow-lg"
            >
              Explore All Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">

            {/* 📍 Sidebar: Creative & Visual Filters */}
            <aside className={`lg:w-64 shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white overflow-y-auto' : 'hidden lg:block'}`}>
              <div className={`${showFilters ? 'p-4 md:p-6' : ''} sticky top-0 lg:top-28 space-y-4 md:space-y-6 lg:space-y-10`}>

                <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-2 md:pb-3 lg:pb-4">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="md:w-4 md:h-4 text-[#D4AF37]" />
                    <h2 className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416]">Refine</h2>
                  </div>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-[#2d2416] bg-gray-50 p-1.5 md:p-2 rounded-full"><X size={14} className="md:w-4 md:h-4" /></button>
                </div>

                {/* 💵 Price Filter */}
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Valuation</h3>
                  <div className="space-y-0.5 md:space-y-1">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => { setSelectedPriceRange(range); setShowFilters(false); }}
                        className={`w-full flex items-center gap-2 py-1 md:py-1.5 text-[8px] md:text-xs transition-all duration-300 group ${
                          selectedPriceRange.label === range.label ? 'text-[#0F5A7E] font-bold' : 'text-[#2d2416] hover:text-[#D4AF37]'
                        }`}
                      >
                        <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border flex items-center justify-center transition-all ${
                          selectedPriceRange.label === range.label ? 'border-[#0F5A7E]' : 'border-gray-300 group-hover:border-[#D4AF37]'
                        }`}>
                          {selectedPriceRange.label === range.label && <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-[#0F5A7E] rounded-full" />}
                        </div>
                        <span className="truncate">{range.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🎨 Colour Filter */}
                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 lg:pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Palette</h3>
                    {selectedColors.length > 0 && <span className="text-[7px] md:text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-bold">{selectedColors.length}</span>}
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-1.5 md:gap-2">
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
                              size={10} 
                              strokeWidth={3} 
                              className={`absolute inset-0 m-auto md:w-3 md:h-3 ${color === 'Silver' ? 'text-black' : 'text-white drop-shadow-md'}`} 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 📏 Size Filter */}
                <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 lg:pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#2d2416] opacity-60">Measurements</h3>
                    {selectedSizes.length > 0 && <span className="text-[7px] md:text-[8px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-bold">{selectedSizes.length}</span>}
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-2 gap-1 md:gap-1.5">
                    {availableSizes.map(size => {
                      const isSelected = selectedSizes.includes(size);
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
                      );
                    })}
                  </div>
                </div>

                {/* 🔄 Reset Filters */}
                <div className="pt-4 md:pt-6 lg:pt-8">
                  <button 
                   onClick={() => { 
                     setSelectedPriceRange(priceRanges[0]); 
                     setSelectedSizes([]); 
                     setSelectedColors([]); 
                     setSearchQuery(''); 
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
              {/* Control Bar - Slimmer Profile */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 md:mb-8 gap-2 md:gap-4">
                <div className="relative w-full md:flex-1 group bg-[#F5E9DC] rounded-full border-2 border-[#D4AF37] px-3 md:px-4 py-1.5 md:py-2 flex items-center">
                  <Search className="absolute left-3 md:left-4 text-[#2d2416] opacity-40 group-focus-within:text-[#0F5A7E] group-focus-within:opacity-100 transition-all" size={14} className="md:w-4 md:h-4" />
                  <input
                    type="text"
                    placeholder="Find your artifact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-6 md:pl-8 pr-2 bg-transparent border-none text-xs md:text-sm text-[#2d2416] outline-none placeholder:text-[#2d2416] placeholder:opacity-40"
                  />
                </div>

                <div className="flex items-stretch gap-2 md:gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border-2 border-[#D4AF37] rounded-full py-1.5 md:py-2 px-2 md:px-4 text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-[#2d2416] shadow-sm outline-none cursor-pointer hover:border-[#0F5A7E] transition-colors appearance-none flex-1 md:flex-initial"
                  >
                    {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden p-1.5 md:p-2.5 bg-[#2d2416] text-white rounded-full shadow-md hover:bg-[#0F5A7E] transition-all flex items-center justify-center"
                  >
                    <SlidersHorizontal size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>

              {/* Catalog Info - Reduced Spacing */}
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-2">
                <Sparkles size={12} className="md:w-3.5 md:h-3.5 text-[#0F5A7E]" />
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                  Revealing {filteredProducts.length} Pieces
                </p>
              </div>

              {/* Grid - Tightened Gap */}
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
        )}
      </div>
    </div>
  )
}