"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Anchor, Sparkles } from 'lucide-react';

const Heritage = () => {
  return (
    <section className="bg-[#FAF9F6] py-24 px-6 relative overflow-hidden">
      {/* Decorative Gold Grain Background Detail */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('/grain.png')]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side: Overlapping Frames */}
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative z-10 w-[85%] aspect-[4/5] rounded-t-full overflow-hidden border-[12px] border-white shadow-2xl"
            >
              <Image 
                src="/heritage-1.jpg" 
                alt="Artisan at work" 
                fill 
                className="object-cover"
              />
            </motion.div>
            
            {/* Secondary Floating Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -bottom-10 -right-4 z-20 w-[50%] aspect-square rounded-full overflow-hidden border-[8px] border-[#FAF9F6] shadow-2xl"
            >
              <Image 
                src="/heritage-2.jpg" 
                alt="Glass bangles detail" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
                The City of Glass
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] leading-[1.1] mb-8 uppercase tracking-tighter">
                Our <span className="italic font-light lowercase text-[#D4AF37]">Legacy</span> <br />
                Of Craftsmanship
              </h2>

              <p className="text-[#0F2C3E]/70 text-base md:text-lg leading-relaxed mb-10 font-light">
                Every SB Creation piece is born in Firozabad, where the rhythmic clinking of glass has echoed for centuries. We don&apos;t just sell bangles; we preserve a heritage of hot-air roasting and manual precision that machines can never replicate.
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-[#D4AF37]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-[#0F2C3E] font-bold text-xs uppercase tracking-widest mb-1">Authenticity</h4>
                    <p className="text-[11px] text-[#0F2C3E]/50">100% Genuine Firozabad Glass</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-[#D4AF37]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-[#0F2C3E] font-bold text-xs uppercase tracking-widest mb-1">Modernity</h4>
                    <p className="text-[11px] text-[#0F2C3E]/50">Global Designs, Indian Heart</p>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ x: 10 }}
                className="mt-12 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]"
              >
                Learn More About Our Process <span className="h-[1px] w-12 bg-[#0F2C3E]" />
              </motion.button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Heritage;