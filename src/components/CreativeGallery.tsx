"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// ─── CATEGORIES — add your image paths below ──────────────────────────────────
// URL matches your navbar exactly: /category/<slug>
// Just fill in the image paths — names & slugs are already correct.
const SAMPLE_CATEGORIES = [
  // ── CAROUSEL (first 3 shown in the big left panel) ──
  {
    id: 1,
    name: 'Glass Bangles',
    slug: 'glass-bangles',
    href: '/category/glass-bangles',
    image: '/bangles.jpeg',    // ← add your image
    tagline: 'Vibrant & Colourful',
  },
  {
    id: 2,
    name: 'Metal Bangles/Kadas',
    slug: 'metal-bangles-kadas',
    href: '/category/metal-bangles-kadas',
    image: '/bangles1.jpeg',    // ← add your image
    tagline: 'Bold & Timeless',
  },
  {
    id: 3,
    name: 'Bangle Sets',
    slug: 'bangle-sets',
    href: '/category/bangle-sets',
    image: '/bangles2.jpeg',      // ← add your image
    tagline: 'Stack in Style',
  },
  // ── SIDE GRID (next 2 shown in the right column) ──
  {
    id: 4,
    name: 'Bangles Box',
    slug: 'bangles-box',
    href: '/category/bangles-box',
    image: '/bangles3.jpeg',      // ← add your image
    tagline: 'Gift & Storage',
  },
  {
    id: 5,
    name: 'Bracelets & Watches',
    slug: 'bracelets-watches',
    href: '/category/bracelets-watches',
    image: '/bangle2.pngs',// ← add your image
    tagline: 'Everyday Elegance',
  },
];
// ─────────────────────────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  slug: string;
  href: string;
  image: string;
  tagline?: string;
}

const CreativeGallery = ({ categories }: { categories?: Category[] }) => {
  // Fall back to sample data if no categories are passed in
  const allCategories = categories && categories.length > 0 ? categories : SAMPLE_CATEGORIES;

  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselCategories = allCategories.slice(0, 3);
  const sideCategories     = allCategories.slice(3, 5);

  useEffect(() => {
    if (carouselCategories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselCategories.length]);

  return (
    <section className="bg-[#FFFFF0] py-8 md:py-12 px-3 md:px-10">
      <div className="container mx-auto max-w-7xl">

        {/* Creative Header */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-left">
            <span className="text-[#0F5A7E] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase mb-1 md:mb-2 block">
              explore by category
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif text-[#2d2416] uppercase tracking-tighter leading-tight">
              Shop by{' '}
              <span className="italic font-light lowercase text-[#D4AF37]">
                Collection
              </span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[9px] md:text-[11px] font-bold tracking-widest uppercase border-b border-[#2d2416] pb-1 hover:text-[#0F5A7E] hover:border-[#0F5A7E] transition-all whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[400px] md:min-h-[600px]">

          {/* LEFT: Main Carousel */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md border-2 border-[#D4AF37]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[300px] md:h-[400px] lg:h-full"
              >
                {carouselCategories[currentIndex] && (
                  <>
                    <Image
                      src={carouselCategories[currentIndex].image}
                      alt={carouselCategories[currentIndex].name}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-[#2d2416]/70 via-[#2d2416]/30 to-transparent flex items-center p-4 md:p-8 lg:p-16">
                      <div className="max-w-md">
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-[#D4AF37] text-[8px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4"
                        >
                          {carouselCategories[currentIndex].tagline ?? 'Explore Category'}
                        </motion.p>
                        <motion.h3
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-white text-2xl md:text-4xl lg:text-6xl font-serif mb-4 md:mb-8 leading-[1.1]"
                        >
                          {carouselCategories[currentIndex].name}
                        </motion.h3>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            href={carouselCategories[currentIndex].href}
                            className="bg-white text-[#2d2416] px-5 md:px-8 py-2 md:py-4 rounded-full font-bold text-xs md:text-sm hover:bg-[#D4AF37] hover:text-white transition-all inline-flex items-center gap-2 shadow-lg"
                          >
                            Shop Now <ChevronRight size={16} className="md:w-[18px] md:h-[18px]" />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Nav Dots */}
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex gap-2 md:gap-3 z-30">
              {carouselCategories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${
                    i === currentIndex ? 'w-6 md:w-8 bg-[#D4AF37]' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Side Grid */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            {sideCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -5 }}
                className="relative flex-1 group overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-md border-2 border-[#D4AF37] min-h-[200px] md:min-h-[280px]"
              >
                <Link href={category.href}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2416]/85 via-transparent to-transparent flex items-end p-4 md:p-8">
                    <div className="text-white translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mb-0.5 md:mb-1">
                        {category.tagline ?? 'Category'}
                      </p>
                      <h4 className="text-lg md:text-2xl font-serif leading-tight">{category.name}</h4>
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