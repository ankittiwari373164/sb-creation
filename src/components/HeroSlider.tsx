'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Replace these with the paths to your designed banner graphics
const banners = [
  { 
    id: 1, 
    src: '/banner.png', // Your pre-designed graphic
    alt: 'SB Creation Bridal Collection', 
    link: '/shop' 
  },
  { 
    id: 2, 
    src: '/banner2.png', 
    alt: 'SB Creation Glass Bangles', 
    link: '/shop' 
  },
  { 
    id: 3, 
    src: '/banners/banner-3.jpg', 
    alt: 'SB Creation 20% Off Sale', 
    link: '/shop' 
  },
]

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-play logic
  useEffect(() => {
    if (isHovered) return // Pause when user hovers over the banner

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000) // Changes every 5 seconds

    return () => clearInterval(timer)
  }, [isHovered])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  return (
    <section 
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-[#fff1f2]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* We wrap the image in a Link so the whole banner is clickable */}
          <Link href={banners[currentIndex].link} className="relative block w-full h-full cursor-pointer">
            <Image
              src={banners[currentIndex].src}
              alt={banners[currentIndex].alt}
              fill
              priority={currentIndex === 0} // Loads the first banner instantly
              className="object-cover object-center"
              quality={90}
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* --- Left / Right Navigation Arrows (Visible on Hover) --- */}
      <div className={`absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0 opacity-100'}`}>
        <button 
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white backdrop-blur-sm text-[#0F2C3E] rounded-full flex items-center justify-center shadow-lg pointer-events-auto transition-all transform hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white backdrop-blur-sm text-[#0F2C3E] rounded-full flex items-center justify-center shadow-lg pointer-events-auto transition-all transform hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* --- Bottom Navigation Dots --- */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              currentIndex === idx 
                ? 'w-8 bg-[#db2777]' // Active dot (Dark Pink)
                : 'w-2.5 bg-white/60 hover:bg-white' // Inactive dot
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}