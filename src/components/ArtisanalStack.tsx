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
    
    image_url: "/testimonials/loved-thousands.jpg",
    
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
    
    image_url: "/testimonials/heritage.jpg",
    
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
    
    image_url: "/testimonials/artisan.jpg",
    
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
    
    image_url: "/testimonials/treasure.jpg",
    
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
      <section className="bg-[#F5E9DC] py-8 md:py-12 px-4 md:px-6 overflow-hidden min-h-[550px] flex items-center">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center">
          
          {/* 📜 Left Side: Testimonial Content */}
          <div className="order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 md:space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase">
                    Testimonials {activeIndex + 1}/{TESTIMONIALS.length}
                  </span>
                  <div className="h-[1px] w-8 md:w-12 bg-[#F8C8DC]/50" />
                </div>
                
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-[#2d2416] leading-tight">
                  {currentProduct.name}
                </h2>
                
                <p className="text-[#2d2416] text-sm md:text-lg leading-relaxed max-w-md italic opacity-75">
                  "{currentProduct.description}"
                </p>

                

                
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 🖼️ Right Side: The Interactive Card Stack */}
          <div className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center order-1 lg:order-2">
            {TESTIMONIALS.map((product, index) => {
              const isTop = index === activeIndex
              const position = index - activeIndex

              return (
                <motion.div
                  key={product.id}
                  style={{ zIndex: TESTIMONIALS.length - Math.abs(position) }}
                  animate={{
                    x: position * 40,
                    scale: 1 - Math.abs(position) * 0.05,
                    rotate: position * 5,
                    opacity: Math.abs(position) > 2 ? 0 : 1,
                  }}
                  whileHover={isTop ? { scale: 1.02, rotate: 0 } : {}}
                  onClick={() => { setActiveIndex(index); setReviewIndex(0) }}
                  className={`absolute cursor-pointer w-[220px] md:w-[300px] lg:w-[380px] aspect-[4/5] rounded-lg md:rounded-2xl overflow-hidden shadow-lg border-2 bg-white transition-shadow duration-500 ${isTop ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-[#F5E9DC] grayscale-[0.3]'}`}
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
                      className="absolute top-3 md:top-6 right-3 md:right-6"
                    >
                      <Sparkles className="text-white w-5 md:w-6 h-5 md:h-6" size={24} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== CUSTOMER REVIEWS SECTION ==================== */}
      <section className="bg-gradient-to-br from-[#FFFFF0] to-[#F8E8D8] py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase block mb-2 md:mb-4">
              Loved by Our Customers
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-serif text-[#2d2416] mb-3 md:mb-4">
              Why Our Customers Trust SB Creation?
            </h2>
            <p className="text-[#2d2416] text-xs md:text-lg opacity-75 max-w-2xl mx-auto">
              We ensure high-quality craftsmanship, durability, and skin-friendly comfort. Shop globally with our fast and secure international shipping services.
            </p>
          </div>

          {/* Reviews Carousel */}
          <div className="relative bg-white rounded-2xl md:rounded-3xl border-2 border-[#D4AF37] p-6 md:p-12 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeIndex}-${reviewIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-4 md:space-y-6"
              >
                {/* Star Rating */}
                <div className="flex justify-center gap-1 md:gap-2">
                  {[...Array(displayedReview.rating)].map((_, i) => (
                    <Star key={i} size={16} className="md:w-6 md:h-6 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                  {[...Array(5 - displayedReview.rating)].map((_, i) => (
                    <Star key={i + displayedReview.rating} size={16} className="md:w-6 md:h-6 text-[#D4AF37]/30" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg md:text-2xl lg:text-3xl font-serif text-[#2d2416] italic leading-relaxed">
                  "{displayedReview.text}"
                </blockquote>

                {/* Author & Product Info */}
                <div className="pt-4 md:pt-6 space-y-1 md:space-y-2">
                  <p className="text-base md:text-lg font-bold text-[#2d2416]">
                    {displayedReview.author}
                  </p>
                  <p className="text-xs md:text-sm text-[#2d2416] opacity-60">
                    Review for: <span className="font-semibold">{currentProduct.name}</span>
                  </p>
                  <p className="text-[10px] md:text-xs text-[#2d2416] opacity-50">
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
            <div className="flex justify-center gap-4 md:gap-6 mt-8 md:mt-12">
              <button
                onClick={handlePrevReview}
                className="p-2 md:p-3 rounded-full border-2 border-[#D4AF37] text-[#2d2416] hover:bg-[#D4AF37] hover:text-white transition-all"
              >
                <ChevronLeft size={16} className="md:w-5 md:h-5" />
              </button>
              <span className="text-[#2d2416] text-xs md:text-sm font-bold flex items-center">
                {reviewIndex + 1} / {currentReviews.length}
              </span>
              <button
                onClick={handleNextReview}
                className="p-2 md:p-3 rounded-full border-2 border-[#D4AF37] text-[#2d2416] hover:bg-[#D4AF37] hover:text-white transition-all"
              >
                <ChevronRight size={16} className="md:w-5 md:h-5" />
              </button>
            </div>

            {/* Product Indicator Dots */}
            <div className="flex justify-center gap-1.5 md:gap-2 mt-6 md:mt-8">
              {TESTIMONIALS.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => { setActiveIndex(idx); setReviewIndex(0) }}
                  animate={{
                    width: activeIndex === idx ? 32 : 8,
                    backgroundColor: activeIndex === idx ? '#D4AF37' : '#D4AF37/30'
                  }}
                  className="h-1.5 md:h-2 rounded-full transition-all"
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
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
              className="relative bg-[#FFFFF0] w-full max-w-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border-2 border-[#D4AF37]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 md:top-6 right-4 md:right-6 text-[#2d2416] opacity-50 hover:text-[#D4AF37] transition-colors"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>

              <div className="text-center space-y-3 md:space-y-4">
                <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] block">Select Size</span>
                <h3 className="text-lg md:text-2xl font-serif text-[#2d2416]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-2 md:gap-3 py-4 md:py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
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
                  className="w-full bg-[#2d2416] text-white py-3 md:py-4 rounded-full font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-[#2d2416] transition-all"
                >
                  <Check size={12} className="md:w-3.5 md:h-3.5" /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}