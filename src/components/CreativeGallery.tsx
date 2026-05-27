"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const SAMPLE_CATEGORIES = [
  { id: 1, name: 'Glass Bangles',        href: '/category/glass-bangles',        image: '/glass-bangles.png',  tagline: 'Vibrant & Colourful' },
  { id: 2, name: 'Metal Bangles/Kadas',  href: '/category/metal-bangles-kadas',  image: '/kada.png', tagline: 'Bold & Timeless' },
  { id: 3, name: 'Bangles Box',          href: '/category/bangles-box',          image: '/box.png', tagline: 'Gift & Storage' },
  { id: 4, name: 'Bangle Sets',          href: '/category/bangle-sets',          image: '/set.png', tagline: 'Stack in Style' },
  { id: 5, name: 'Bracelets & Watches',  href: '/category/bracelets-watches',    image: '/bracelets.png',   tagline: 'Everyday Elegance' },
];

interface Category {
  id: number;
  name: string;
  href: string;
  image: string;
  tagline?: string;
}

const CategoryCard = ({ category, tall = false, delay = 0 }: { category: Category; tall?: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className={`group relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-sm border border-[#F8C8DC] hover:border-[#db2777] hover:shadow-md transition-all duration-300 ${tall ? 'h-full' : ''}`}
  >
    <Link href={category.href} className="block h-full">
      <div className={`relative w-full ${tall ? 'h-full min-h-[140px] md:min-h-[160px]' : 'aspect-[4/3]'}`}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C3E]/80 via-[#0F2C3E]/10 to-transparent" />

        {/* Text */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
          <p className="text-[#F8C8DC] text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5">
            {category.tagline}
          </p>
          <h4 className="text-white text-sm md:text-base font-serif leading-tight">
            {category.name}
          </h4>
        </div>

        {/* Shop Now on hover */}
        <div className="absolute inset-x-0 top-0 flex justify-center pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white text-[#0F2C3E] px-3 py-1 rounded-full font-bold text-[9px] md:text-[10px] flex items-center gap-1 shadow">
            Shop Now <ChevronRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const CreativeGallery = ({ categories }: { categories?: Category[] }) => {
  const display = (categories && categories.length >= 5 ? categories : SAMPLE_CATEGORIES).slice(0, 5);
  // Layout: [left-top, left-bottom] | [centre BIG] | [right-top, right-bottom]
  const leftTop    = display[0];
  const leftBottom = display[1];
  const centre     = display[2];
  const rightTop   = display[3];
  const rightBottom= display[4];

  return (
    <section className="bg-[#FFFFFF] py-6 md:py-10 px-3 md:px-8">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-5 md:mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-1">
          <div>
            <span className="text-[#0F5A7E] text-[9px] md:text-[11px] font-bold tracking-[0.3em] uppercase mb-1 block">
              explore by category
            </span>
            <h2 className="text-xl md:text-2xl lg:text-[28px] font-serif text-[#0F2C3E] uppercase tracking-tighter leading-tight">
              Shop by <span className="italic font-semibold text-[#db2777]">Collection</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[9px] md:text-[11px] font-bold tracking-widest uppercase border-b border-[#0F2C3E] pb-0.5 hover:text-[#db2777] hover:border-[#db2777] transition-all whitespace-nowrap">
            View All
          </Link>
        </div>

        {/* Desktop layout: 3 columns — left(2 stacked) | centre(1 tall) | right(2 stacked) */}
        <div className="hidden md:grid grid-cols-3 gap-3 lg:gap-4" style={{ height: '340px' }}>

          {/* Left column — 2 stacked */}
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="flex-1"><CategoryCard category={leftTop} tall delay={0} /></div>
            <div className="flex-1"><CategoryCard category={leftBottom} tall delay={0.1} /></div>
          </div>

          {/* Centre — full height tall card */}
          <div className="h-full">
            <CategoryCard category={centre} tall delay={0.2} />
          </div>

          {/* Right column — 2 stacked */}
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="flex-1"><CategoryCard category={rightTop} tall delay={0.3} /></div>
            <div className="flex-1"><CategoryCard category={rightBottom} tall delay={0.4} /></div>
          </div>

        </div>

        {/* Mobile layout: 2-col grid, centre card spans full width on row 2 */}
        <div className="grid md:hidden grid-cols-2 gap-2.5">
          <CategoryCard category={leftTop} delay={0} />
          <CategoryCard category={leftBottom} delay={0.1} />
          <div className="col-span-2"><CategoryCard category={centre} delay={0.2} /></div>
          <CategoryCard category={rightTop} delay={0.3} />
          <CategoryCard category={rightBottom} delay={0.4} />
        </div>

      </div>
    </section>
  );
};

export default CreativeGallery;