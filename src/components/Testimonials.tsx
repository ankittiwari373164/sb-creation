"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, Sparkles } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "The craftsmanship is unlike anything I've seen. They have a weight and shine that screams luxury. Truly preserved the Firozabad heritage.",
    title: "Heritage Collection"
  },
  {
    id: 2,
    name: "Ananya Iyer",
    text: "I ordered the Bridal Zardosi mix for my wedding. The highlight of my attire. The gold plating is exquisite and didn't lose luster.",
    title: "Bridal Special"
  },
  {
    id: 3,
    name: "Meera Kapoor",
    text: "International shipping was fast. The packaging was so royal—opening the box felt like uncovering a treasure. Highly recommended.",
    title: "Global Order"
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);

  return (
    <section className="bg-[#F4F1EE] py-24 px-6 md:px-10 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* 🖼️ LEFT SIDE: Large Artistic Creative (7 Columns) */}
          <div className="lg:col-span-7 relative h-[600px] w-full group">
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden border-[12px] border-white shadow-2xl">
              <Image 
                src="/testimonial-creative.jpg" // 👈 Add a high-end model/artistic shot here
                alt="SB Creation Luxury"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C3E]/60 via-transparent to-transparent" />
            </div>
            
            {/* Floating Trust Badge */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -left-10 w-40 h-40 hidden md:flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#D4AF37]">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"/>
                <text className="text-[10px] font-bold uppercase tracking-[2px]">
                  <textPath xlinkHref="#circlePath">SB Creation • Handcrafted Excellence •</textPath>
                </text>
              </svg>
            </motion.div>
          </div>

          {/* 💍 RIGHT SIDE: The Overlapping Card Stack (5 Columns) */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-start">
            <div className="mb-12">
              <span className="flex items-center gap-2 text-[#db2777] text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
                <Sparkles size={14} /> The Royal Experience
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] uppercase tracking-tighter">
                What they <br /> <span className="italic font-light lowercase text-[#D4AF37]">feel</span>
              </h2>
            </div>

            <div className="relative w-full h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, rotate: 5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -50, rotate: -5 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-pink-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl font-serif italic text-[#0F2C3E] leading-relaxed">
                      &quot;{reviews[index].text}&quot;
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-8 pt-8 border-t border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#0F2C3E]">{reviews[index].name}</h4>
                      <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mt-1">{reviews[index].title}</p>
                    </div>
                    <button 
                      onClick={next}
                      className="w-14 h-14 rounded-full bg-[#0F2C3E] text-white flex items-center justify-center hover:bg-[#db2777] transition-colors shadow-lg group"
                    >
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative "Next Card" behind the main card */}
              <div className="absolute inset-0 bg-[#FAF9F6] border border-[#D4AF37]/20 rounded-[2.5rem] -z-10 translate-x-4 translate-y-4 shadow-xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;