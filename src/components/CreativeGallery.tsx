"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SAMPLE_CATEGORIES = [
  { id: 1, name: 'Glass Bangles', slug: 'glass-bangles', href: '/category/glass-bangles', image: '/bangles.jpeg', tagline: 'Vibrant & Colourful' },
  { id: 2, name: 'Metal Bangles/Kadas', slug: 'metal-bangles-kadas', href: '/category/metal-bangles-kadas', image: '/bangles1.jpeg', tagline: 'Bold & Timeless' },
  { id: 3, name: 'Bangle Sets', slug: 'bangle-sets', href: '/category/bangle-sets', image: '/bangles2.jpeg', tagline: 'Stack in Style' },
  { id: 4, name: 'Bangles Box', slug: 'bangles-box', href: '/category/bangles-box', image: '/bangles3.jpeg', tagline: 'Gift & Storage' },
  { id: 5, name: 'Bracelets & Watches', slug: 'bracelets-watches', href: '/category/bracelets-watches', image: '/bangle2.png', tagline: 'Everyday Elegance' },
];

interface Category {
  id: number;
  name: string;
  slug: string;
  href: string;
  image: string;
  tagline?: string;
}

const CreativeGallery = ({ categories }: { categories?: Category[] }) => {
  const allCategories = categories && categories.length > 0 ? categories : SAMPLE_CATEGORIES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselCategories = allCategories.slice(0, 3);
  const sideCategories = allCategories.slice(3, 5);

  useEffect(() => {
    if (carouselCategories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselCategories.length]);

  return (
    <section className="bg-[#FFFFF0] py-4 md:py-5 px-3 md:px-8">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-3 md:mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-1">
          <div>
            <span className="text-[#0F5A7E] text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase mb-1 block">
              explore by category
            </span>
            <h2 className="text-lg md:text-2xl lg:text-[26px] font-serif text-[#2d2416] uppercase tracking-tighter leading-tight">
              Shop by <span className="italic font-semibold text-[#d92b7a]">Collection</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[9px] md:text-[11px] font-bold tracking-widest uppercase border-b border-[#2d2416] pb-0.5 hover:text-[#0F5A7E] hover:border-[#0F5A7E] transition-all whitespace-nowrap">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-3.5">

          {/* LEFT: Main Carousel */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md border-2 border-[#D4AF37]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[180px] md:h-[230px] lg:h-[300px]"
              >
                {carouselCategories[currentIndex] && (
                  <>
                    <Image
                      src={carouselCategories[currentIndex].image}
                      alt={carouselCategories[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2d2416]/70 via-[#2d2416]/30 to-transparent flex items-center p-4 md:p-6 lg:p-8">
                      <div>
                        <motion.p
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-1.5"
                        >
                          {carouselCategories[currentIndex].tagline ?? 'Explore'}
                        </motion.p>
                        <motion.h3
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-white text-lg md:text-2xl lg:text-[34px] font-serif mb-3 leading-[1.1]"
                        >
                          {carouselCategories[currentIndex].name}
                        </motion.h3>
                        <motion.div
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            href={carouselCategories[currentIndex].href}
                            className="bg-white text-[#2d2416] px-3.5 md:px-5 py-1.5 md:py-2 rounded-full font-bold text-[10px] md:text-xs hover:bg-[#D4AF37] hover:text-white transition-all inline-flex items-center gap-1.5 shadow-lg"
                          >
                            Shop Now <ChevronRight size={13} />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-2.5 right-4 flex gap-2 z-30">
              {carouselCategories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Side Grid */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 md:gap-3.5">
            {sideCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -4 }}
                className="relative flex-1 group overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md border-2 border-[#D4AF37] min-h-[110px] md:min-h-[135px]"
              >
                <Link href={category.href}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2416]/85 via-transparent to-transparent flex items-end p-3 md:p-4">
                    <div className="text-white">
                      <p className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5">
                        {category.tagline ?? 'Category'}
                      </p>
                      <h4 className="text-xs md:text-[15px] font-serif leading-tight">{category.name}</h4>
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