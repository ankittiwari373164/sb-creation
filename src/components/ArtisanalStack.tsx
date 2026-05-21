'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowUpRight, Sparkles, X, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

// Testimonials & Reviews Data
const TESTIMONIALS = [
  
  {
    id: 2,
    name: "Loved by Thousands",
    description: "Handcrafted with precision, each piece tells a story of artisanal excellence. Our collection celebrates tradition meets modern luxury.",
    
    image_url: "/bangles1.jpeg",
    
    reviews: [
      { id: 4, author: "Meera D.", rating: 5, text: "Exceptional quality! This is my third purchase and I'm impressed every time.", date: "2024-05-04" },
      { id: 5, author: "Vikram R.", rating: 5, text: "Stunning design and perfect fit. Customer service was excellent too.", date: "2024-05-05" },
      { id: 6, author: "Neha G.", rating: 5, text: "Worth every penny! The craftsmanship is unmatched.", date: "2024-05-06" }
    ]
  },
  {
    id: 3,
    name: "Heritage Elegance",
    description: "Blending timeless traditions with contemporary aesthetics. Each item is a testament to meticulous craftsmanship and cultural pride.",
    
    image_url: "/bangles2.jpeg",
    
    reviews: [
      { id: 7, author: "Sanjana M.", rating: 5, text: "Absolutely stunning! This piece is a conversation starter.", date: "2024-05-07" },
      { id: 8, author: "Arjun V.", rating: 4, text: "Beautiful craftsmanship. Delivery was quick and well packaged.", date: "2024-05-08" },
      { id: 9, author: "Divya K.", rating: 5, text: "Premium quality at its best. Highly recommended!", date: "2024-05-09" }
    ]
  },
  {
    id: 4,
    name: "Artisan's Pride",
    description: "Made with love and decades of expertise. Supporting local artisans while delivering world-class quality to your doorstep.",
    
    image_url: "/bangles3.jpeg",
    
    reviews: [
      { id: 10, author: "Pooja L.", rating: 5, text: "Supporting local artisans was my goal, and I found the perfect piece here!", date: "2024-05-10" },
      { id: 11, author: "Rohan T.", rating: 5, text: "Each detail is perfect. The attention to quality is remarkable.", date: "2024-05-11" },
      { id: 12, author: "Isha N.", rating: 4, text: "Great product and great purpose. Love supporting this brand.", date: "2024-05-12" }
    ]
  },
  {
    id: 5,
    name: "Timeless Treasure",
    description: "An investment in beauty and quality that lasts a lifetime. Crafted to become your most cherished possession.",
    
    image_url: "/bangles.jpeg",
    
    reviews: [
      { id: 13, author: "Kavya S.", rating: 5, text: "This is luxury redefined! Every aspect is perfect.", date: "2024-05-13" },
      { id: 14, author: "Aditya B.", rating: 5, text: "An investment worth making. The quality speaks for itself.", date: "2024-05-14" },
      { id: 15, author: "Nisha R.", rating: 5, text: "Timeless indeed! I'll cherish this forever.", date: "2024-05-15" }
    ]
  }
]

export default function ArtisanalStack() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reviewIndex, setReviewIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  // Size Popup States
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')

  const handleAddToCartInitiate = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    setSelectedProduct(product)
    setTempSize(product.sizes?.[0] || '2.4')
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        icon: '💍',
        style: { background: '#2d2416', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  const currentProduct = TESTIMONIALS[activeIndex]
  const currentReviews = currentProduct.reviews
  const displayedReview = currentReviews[reviewIndex % currentReviews.length]

  const handleNextReview = () => {
    setReviewIndex((prev) => (prev + 1) % currentReviews.length)
  }

  const handlePrevReview = () => {
    setReviewIndex((prev) => (prev - 1 + currentReviews.length) % currentReviews.length)
  }

  return (
    <>
      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="bg-[#F5E9DC] py-6 md:py-8 px-3 md:px-4 overflow-hidden min-h-[420px] flex items-center">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          
          {/* 📜 Left Side: Testimonial Content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 md:space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#D4AF37] text-[7px] md:text-[9px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase">
                    Testimonials {activeIndex + 1}/{TESTIMONIALS.length}
                  </span>
                  <div className="h-[1px] w-6 md:w-10 bg-[#F8C8DC]/50" />
                </div>
                
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#2d2416] leading-tight">
                  {currentProduct.name}
                </h2>
                
                <p className="text-[#2d2416] text-xs md:text-base leading-relaxed max-w-sm italic opacity-75">
                  "{currentProduct.description}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 🖼️ Right Side: The Interactive Card Stack */}
          <div className="relative h-[280px] md:h-[380px] w-full flex items-center justify-center order-1 lg:order-2">
            {TESTIMONIALS.map((product, index) => {
              const isTop = index === activeIndex
              const position = index - activeIndex

              return (
                <motion.div
                  key={product.id}
                  style={{ zIndex: TESTIMONIALS.length - Math.abs(position) }}
                  animate={{
                    x: position * 30,
                    scale: 1 - Math.abs(position) * 0.05,
                    rotate: position * 4,
                    opacity: Math.abs(position) > 2 ? 0 : 1,
                  }}
                  whileHover={isTop ? { scale: 1.02, rotate: 0 } : {}}
                  onClick={() => { setActiveIndex(index); setReviewIndex(0) }}
                  className={`absolute cursor-pointer w-[180px] md:w-[240px] lg:w-[300px] aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden shadow-md border-2 bg-white transition-shadow duration-500 ${isTop ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-[#F5E9DC] grayscale-[0.3]'}`}
                >
                  <Image 
                    src={product.image_url || '/placeholder.jpg'} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2416]/30 via-transparent to-transparent opacity-40" />
                  
                  {isTop && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="absolute top-2 md:top-4 right-2 md:right-4"
                    >
                      <Sparkles className="text-white w-4 md:w-5 h-4 md:h-5" size={20} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== CUSTOMER REVIEWS SECTION ==================== */}
      <section className="bg-gradient-to-br from-[#FFFFF0] to-[#F8E8D8] py-8 md:py-12 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-10">
            <span className="text-[#d92b7a] text-[7px] md:text-[9px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2 md:mb-3">
              Loved by Our Customers
            </span>
            <h2 className="text-xl md:text-3xl lg:text-5xl font-serif text-[#2d2416] mb-2 md:mb-3">
              Why Our Customers <span  className="italic font-semibold text-[#d92b7a]">Trust SB Creation</span>?
            </h2>
            <p className="text-[#2d2416] text-[11px] md:text-base opacity-75 max-w-xl mx-auto">
              We ensure high-quality craftsmanship, durability, and skin-friendly comfort. Shop globally with our fast and secure international shipping services.
            </p>
          </div>

          {/* Reviews Carousel */}
          <div className="relative bg-white rounded-xl md:rounded-2xl border-2 border-[#D4AF37] p-4 md:p-5 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${reviewIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-3 md:space-y-3"
              >
                {/* Star Rating */}
                <div className="flex justify-center gap-1">
                  {[...Array(displayedReview.rating)].map((_, i) => (
                    <Star key={i} size={14} className="md:w-5 md:h-5 fill-[#d92b7a] text-[#d92b7a]" />
                  ))}
                  {[...Array(5 - displayedReview.rating)].map((_, i) => (
                    <Star key={i + displayedReview.rating} size={14} className="md:w-5 md:h-5 text-[#d92b7a]/30" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-base md:text-xl lg:text-xl font-serif text-[#2d2416] italic leading-relaxed">
                  "{displayedReview.text}"
                </blockquote>

                {/* Author & Product Info */}
                <div className="pt-3 md:pt-4 space-y-1">
                  <p className="text-sm md:text-base font-bold text-[#2d2416]">
                    {displayedReview.author}
                  </p>
                  <p className="text-[10px] md:text-xs text-[#2d2416] opacity-60">
                    Review for: <span className="font-semibold">{currentProduct.name}</span>
                  </p>
                  <p className="text-[9px] md:text-[11px] text-[#2d2416] opacity-50">
                    {new Date(displayedReview.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-8">
              <button
                onClick={handlePrevReview}
                className="p-2 rounded-full border-2 border-[#d92b7a] text-[#d92b7a] hover:bg-[#d92b7a] hover:text-white transition-all"
              >
                <ChevronLeft size={14} className="md:w-4 md:h-4" />
              </button>
              <span className="text-[#2d2416] text-[10px] md:text-xs font-bold flex items-center">
                {reviewIndex + 1} / {currentReviews.length}
              </span>
              <button
                onClick={handleNextReview}
                className="p-2 rounded-full border-2 border-[#d92b7a] text-[#d92b7a] hover:bg-[#d92b7a] hover:text-white transition-all"
              >
                <ChevronRight size={14} className="md:w-4 md:h-4" />
              </button>
            </div>

            {/* Product Indicator Dots */}
            <div className="flex justify-center gap-1.5 mt-5 md:mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => { setActiveIndex(idx); setReviewIndex(0) }}
                  animate={{
                    width: activeIndex === idx ? 24 : 6,
                    backgroundColor: activeIndex === idx ? '#D4AF37' : '#D4AF37/30'
                  }}
                  className="h-1.5 rounded-full transition-all"
                />
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          </div>
      </section>

      {/* --- 📏 Size Selection Popup --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#2d2416]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#FFFFF0] w-full max-w-xs rounded-xl p-5 md:p-6 shadow-lg border-2 border-[#D4AF37]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-[#2d2416] opacity-50 hover:text-[#D4AF37] transition-colors"
              >
                <X size={16} className="md:w-4 md:h-4" />
              </button>

              <div className="text-center space-y-2 md:space-y-3">
                <span className="text-[#D4AF37] text-[7px] md:text-[9px] font-bold uppercase tracking-[0.3em] block">Select Size</span>
                <h3 className="text-base md:text-xl font-serif text-[#2d2416]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-2 py-3 md:py-4">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 font-bold text-[10px] transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#2d2416] text-white border-[#2d2416]' 
                        : 'border-[#D4AF37] text-[#2d2416] hover:bg-[#F8C8DC]/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#2d2416] text-white py-2.5 md:py-3 rounded-full font-bold uppercase text-[7px] md:text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#2d2416] transition-all"
                >
                  <Check size={10} className="md:w-3 md:h-3" /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}