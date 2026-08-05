"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type CollectionCover = {
  title: string
  subtitle: string
  image: string
  link: string
}

const FALLBACK_CATEGORIES: CollectionCover[] = [
  { title: "Glass Collection", subtitle: "Traditional Firozabad Artistry", image: "/cat-glass.jpg", link: "/shop" },
  { title: "Metal Sets", subtitle: "Durability Meets Grace", image: "/cat-metal.jpg", link: "/shop" },
  { title: "Designer Bridal", subtitle: "For Your Special Moments", image: "/cat-bridal.jpg", link: "/shop" },
  { title: "Daily Wear", subtitle: "Effortless Elegance", image: "/cat-daily.jpg", link: "/shop" },
];

// Grid layout classes cycle the same way the original hardcoded design did,
// regardless of how many collections the admin has configured.
const GRID_PATTERN = [
  { gridClass: "col-span-12 md:col-span-8", aspect: "aspect-[16/9] md:aspect-[21/9]" },
  { gridClass: "col-span-6 md:col-span-4", aspect: "aspect-[3/4] md:aspect-auto" },
  { gridClass: "col-span-6 md:col-span-4", aspect: "aspect-[3/4] md:aspect-auto" },
  { gridClass: "col-span-12 md:col-span-8", aspect: "aspect-[16/9] md:aspect-[21/9]" },
];

const Categories = () => {
  const [categories, setCategories] = useState<CollectionCover[]>(FALLBACK_CATEGORIES);

  // Cover images + titles are managed from the admin panel (Settings → Storefront Images).
  useEffect(() => {
    let active = true;
    fetch('/api/settings')
      .then(r => r.json())
      .then(s => {
        if (!active) return;
        if (Array.isArray(s.collections) && s.collections.length > 0) {
          setCategories(s.collections);
        }
      })
      .catch(() => {});
    return () => { active = false };
  }, []);

  return (
    <section className="bg-[#F4F1EE] py-20 px-6">
      <div className="container mx-auto max-w-6xl">

        {/* Section Header */}
        <div className="text-left mb-12">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">
            Curated Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F2C3E] uppercase tracking-tight">
            Shop by <span className="italic font-light lowercase text-[#D4AF37]">Material</span>
          </h2>
        </div>

        {/* Staggered Grid */}
        <div className="grid grid-cols-12 gap-4">
          {categories.map((cat, index) => {
            const pattern = GRID_PATTERN[index % GRID_PATTERN.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${pattern.gridClass} group relative overflow-hidden bg-white shadow-sm cursor-pointer`}
              >
                <Link href={cat.link || '/shop'} className="block">
                  {/* Image Container */}
                  <div className={`relative w-full ${pattern.aspect} overflow-hidden`}>
                    <Image
                      src={cat.image || '/placeholder.jpg'}
                      alt={cat.title}
                      fill
                      unoptimized={cat.image?.startsWith('http')}
                      className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C3E]/60 via-transparent to-transparent opacity-80" />

                    {/* Text Content Overlay */}
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                      <p className="text-[#D4AF37] text-[9px] font-bold tracking-[0.2em] uppercase mb-1">
                        {cat.subtitle}
                      </p>
                      <h3 className="text-white text-xl md:text-2xl font-serif tracking-wide mb-4">
                        {cat.title}
                      </h3>

                      {/* Subtle Shop Button */}
                      <div className="flex items-center gap-2 opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                        <span className="h-[1px] w-8 bg-white" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                          Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Gold Border on Hover */}
                <div className="absolute inset-0 border-[0px] group-hover:border-[1px] border-[#D4AF37]/30 transition-all duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;