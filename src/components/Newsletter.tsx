"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the SBC Inner Circle!", {
        style: { background: '#0F2C3E', color: '#fff', borderRadius: '12px' }
      });
      setEmail("");
    }
  };

  return (
    <section className="bg-[#0F2C3E] py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#db2777]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-8"
          >
            <Sparkles className="text-[#D4AF37]" size={28} />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tighter mb-6">
            Join the <span className="italic font-light text-[#D4AF37] lowercase">Atelier</span> Club
          </h2>
          
          <p className="text-[#FAF9F6]/60 text-sm md:text-base max-w-lg mb-12 leading-relaxed tracking-wide">
            Be the first to know about our exclusive handcrafted drops, heritage stories, and private seasonal sales.
          </p>

          <form 
            onSubmit={handleSubscribe}
            className="w-full max-w-md flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>
            
            <button 
              type="submit"
              className="bg-[#D4AF37] text-[#0F2C3E] px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
            Secure & Private • No Spam • Artisanal Quality
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;