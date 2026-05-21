"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

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
  const prev = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="bg-[#F4F1EE] py-8 md:py-12 px-6 md:px-10 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT: Image */}
          <div className="lg:col-span-7 relative h-[320px] md:h-[420px] w-full group">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-[8px] border-white shadow-2xl">
              <Image
                src="/testimonial-creative.jpg"
                alt="SB Creation Luxury"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C3E]/60 via-transparent to-transparent" />
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -left-8 w-28 h-28 hidden md:flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full fill-[#D4AF37]">
                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"/>
                <text className="text-[10px] font-bold uppercase tracking-[2px]">
                  <textPath xlinkHref="#circlePath">SB Creation • Handcrafted Excellence •</textPath>
                </text>
              </svg>
            </motion.div>
          </div>

          {/* RIGHT: Review Card */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-start">

            {/* Heading */}
            <div className="mb-6">
              <span className="flex items-center gap-2 text-[#db2777] text-[9px] font-bold tracking-[0.4em] uppercase mb-2">
                <Sparkles size={12} /> The Royal Experience
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] uppercase tracking-tighter">
                What they <br />
                <span className="italic font-light lowercase text-[#D4AF37]">feel</span>
              </h2>
            </div>

            {/* Card */}
            <div className="relative w-full h-[200px] md:h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40, rotate: 3 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -40, rotate: -3 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white px-6 py-5 md:px-8 md:py-6 rounded-[1.5rem] shadow-xl border border-pink-50 flex flex-col justify-between"
                >
                  {/* Stars */}
                  <div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-sm md:text-base font-serif italic text-[#0F2C3E] leading-relaxed line-clamp-3">
                      &quot;{reviews[index].text}&quot;
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <h4 className="text-[8px] font-bold uppercase tracking-widest text-[#0F2C3E]">
                        {reviews[index].name}
                      </h4>
                      <p className="text-[5px] text-[#D4AF37] uppercase tracking-widest mt-0.5">
                        {reviews[index].title}
                      </p>
                    </div>

                    {/* Nav buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prev}
                        className="w-8 h-8 rounded-full bg-[#F4F1EE] text-[#0F2C3E] flex items-center justify-center hover:bg-[#db2777] hover:text-white transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-[10px] text-[#0F2C3E] font-semibold">
                        {index + 1}/{reviews.length}
                      </span>
                      <button
                        onClick={next}
                        className="w-8 h-8 rounded-full bg-[#0F2C3E] text-white flex items-center justify-center hover:bg-[#db2777] transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Shadow card behind */}
              <div className="absolute inset-0 bg-[#FAF9F6] border border-[#D4AF37]/20 rounded-[1.5rem] -z-10 translate-x-3 translate-y-3 shadow-lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;