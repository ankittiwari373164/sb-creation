"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-[#FAF9F6] overflow-hidden px-6 py-12 lg:py-16">
      
      {/* Background Decor - Subtle Pink Glow */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#db2777]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">
          
          {/* TEXT SECTION */}
          <div className="col-span-1 lg:col-span-7 text-left lg:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="h-[1px] w-6 bg-[#D4AF37]" />
                <span className="text-[#0F2C3E] text-[10px] font-bold tracking-[0.4em] uppercase opacity-70">
                  Firozabad Heritage
                </span>
              </div>

              <h1 className="text-[42px] md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#0F2C3E] leading-[1] mb-6 uppercase tracking-tighter">
                Refined <br />
                <span className="italic font-light lowercase text-[#D4AF37]">bangles</span> <br />
                For Modern Women
              </h1>

              <p className="text-[#0F2C3E]/60 text-sm md:text-base leading-relaxed tracking-wide font-light max-w-md mb-10 italic">
                &quot;Handcrafted artistry, perfected over generations in the city of glass. Every piece tells a story of tradition.&quot;
              </p>

              <div className="flex flex-row gap-8 items-center">
                <Link href="/shop" className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#0F2C3E] border-b-2 border-[#0F2C3E] pb-1 hover:text-[#db2777] hover:border-[#db2777] transition-all">
                  Shop Collection
                </Link>
                <Link href="/about" className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#0F2C3E]/40 hover:text-[#0F2C3E] transition-all">
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>

          {/* IMAGE SECTION */}
          <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative w-full max-w-[320px] md:max-w-[420px] aspect-[4/5]"
            >
              {/* Main Arch-Top Image */}
              <div className="relative z-10 w-full h-full rounded-t-[140px] overflow-hidden shadow-2xl border border-black/5 bg-[#f0f0f0]">
                <Image 
                  src="/bangle.png" 
                  alt="SB Creation Collection" 
                  fill 
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              
              {/* Overlapping Detail Circle */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 bottom-[15%] z-30 w-[48%] aspect-square rounded-full overflow-hidden border-[6px] border-[#FAF9F6] shadow-2xl"
              >
                <Image 
                  src="/bangle2.png" 
                  alt="Bangle Detail" 
                  fill 
                  className="object-cover"
                />
              </motion.div>

              {/* Minimalist Arrival Badge */}
              <div className="absolute top-[15%] -left-4 z-40 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-gray-100">
                <span className="w-1.5 h-1.5 rounded-full bg-[#db2777] animate-pulse" />
                <span className="text-[9px] font-bold text-[#0F2C3E] tracking-widest uppercase">New Arrival</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;