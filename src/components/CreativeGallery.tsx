"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, ChevronLeft } from 'lucide-react';

const CreativeGallery = ({ products }: { products: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselProducts = products?.slice(0, 3) || [];
  const sideProducts = products?.slice(3, 5) || [];

  useEffect(() => {
    if (carouselProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselProducts.length]);

  return (
    <section className="bg-[#FAF9F6] py-10 px-4 md:px-10">
      <div className="container mx-auto max-w-7xl">
        
        {/* Creative Header */}
        <div className="mb-12 flex items-end justify-between">
          <div className="text-left">
            <span className="text-[#db2777] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">
              Curated Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#0F2C3E] uppercase tracking-tighter leading-tight">
              Featured <span className="italic font-light lowercase text-[#D4AF37]">Artistry</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[11px] font-bold tracking-widest uppercase border-b border-[#0F2C3E] pb-1 hover:text-[#db2777] hover:border-[#db2777] transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* 🎡 LEFT SIDE: Main Interactive Carousel */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-[2.5rem] bg-white shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[400px] lg:h-full"
              >
                {carouselProducts[currentIndex] && (
                  <>
                    <Image
                      src={carouselProducts[currentIndex]?.images?.[0] || carouselProducts[currentIndex]?.image_url || '/placeholder.jpg'}
                      alt={carouselProducts[currentIndex]?.name}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-center p-8 md:p-16">
                      <div className="max-w-md">
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4"
                        >
                          Premium Collection
                        </motion.p>
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-white text-4xl md:text-6xl font-serif mb-8 leading-[1.1]"
                        >
                          {carouselProducts[currentIndex]?.name}
                        </motion.h3>
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }} 
                          animate={{ y: 0, opacity: 1 }} 
                          transition={{ delay: 0.2 }}
                        >
                           <Link href={`/product/${carouselProducts[currentIndex]?.slug}`} className="bg-white text-[#0F2C3E] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#db2777] hover:text-white transition-all inline-flex items-center gap-2 shadow-lg">
                             Shop Now <ShoppingBag size={18} />
                           </Link>
                        </motion.div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Nav Dots */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-30">
              {carouselProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          {/* 🖼️ RIGHT SIDE: Creative Grid */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sideProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="relative flex-1 group overflow-hidden rounded-[2.5rem] bg-white shadow-lg min-h-[280px]"
              >
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images?.[0] || product.image_url || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                    <div className="text-white translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">
                        {product.category || "Exclusive"}
                      </p>
                      <h4 className="text-2xl font-serif leading-tight">{product.name}</h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CreativeGallery;