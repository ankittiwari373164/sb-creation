'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Hammer, Palette, Crown, CheckCircle, Users } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { label: 'Artisans Working', value: '250+' },
    { label: 'Designs Created', value: '5000+' },
    { label: 'Years of History', value: '30+' },
    { label: 'Global Shipments', value: '15k+' },
  ]

  const process = [
    { 
      title: 'Melting the Glass', 
      icon: Hammer, 
      desc: 'We heat raw glass in traditional furnaces at high temperatures for clarity.' 
    },
    { 
      title: 'Shaping by Hand', 
      icon: Palette, 
      desc: 'Master workers use traditional tools to shape glass into perfect bangles.' 
    },
    { 
      title: 'Final Details', 
      icon: Crown, 
      desc: 'We add crystals and gold plating by hand for a beautiful shine.' 
    }
  ]

  return (
    <div className="min-h-screen bg-grey selection:bg-[#db2777]/10">
      
      {/* 🏛️ HERO: Tightened Layout */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#fff1f2] rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-gray-100 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 px-4 py-1 rounded-full bg-white shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <Sparkles size={12} className="text-[#db2777]" />
              <span className="text-[#db2777] text-[9px] font-bold tracking-[0.3em] uppercase">Est. 1994 • Firozabad</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-serif text-[#0F2C3E] leading-[0.9] mb-4"
            >
              Pure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#db2777] to-[#f472b6] italic">Artistry.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 text-base md:text-lg max-w-xl font-light leading-snug"
            >
              The story of SB Creation is written in fire and glass. The timeless soul of India’s Glass City.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 📜 THE STORY: Compact Grid */}
      <section className="py-10 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center rounded-[2rem] overflow-hidden shadow-xl">
            <div className="lg:col-span-5 h-[400px] lg:h-[500px] relative bg-gray-200">
              <Image src="/legacy-workshop.jpg" alt="Artisan" fill className="object-cover mix-blend-overlay opacity-80" />
            </div>

            <div className="lg:col-span-7 bg-[#fff1f2]/20 backdrop-blur-xl p-8 md:p-12 border-l border-white/20">
              <h2 className="text-[#db2777] text-[9px] font-bold tracking-[0.5em] uppercase mb-4">The Legacy</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-[#0F2C3E] mb-6 leading-tight">
                From the Furnace of <br/> 
                <span className="italic">Sitaram Bhagwandas</span>
              </h3>
              <div className="space-y-4 text-gray-600 font-light text-base leading-relaxed">
                <p>
                  Born in Firozabad, SB Creation is the face of a multi-generational legacy. A family atelier dedicated to the craft of glass-making.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border-l-2 border-[#db2777] pl-4">
                    <p className="text-black font-bold text-xs uppercase">Pankaj & Co.</p>
                  </div>
                  <div className="border-l-2 border-[#db2777] pl-4">
                    <p className="text-black font-bold text-xs uppercase">SB & Co.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ THE PROCESS: Reduced Spacing */}
      <section className="py-12 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="mb-10 text-center md:text-left">
             <h2 className="text-4xl font-serif text-[#0F2C3E]">The Alchemy</h2>
             <p className="text-gray-400 mt-1 uppercase text-[9px] tracking-[0.4em] font-bold">Handcrafted Timeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {process.map((item, i) => (
              <motion.div 
                key={i}
                className={`p-8 rounded-[2rem] ${
                  i === 1 ? 'bg-white shadow-lg border border-gray-100 z-10' : 'bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  i === 1 ? 'bg-[#db2777] text-white' : 'bg-white text-gray-300'
                }`}>
                  <item.icon size={24} />
                </div>
                <h4 className="text-xl font-serif text-[#0F2C3E] mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 STATS: Narrow Ribbon */}
      <section className="py-10 bg-[#db2777] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <p className="text-4xl md:text-5xl font-serif">{stat.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 THE FOUNDER: Compact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-48 h-48 md:w-60 md:h-60 rounded-[2rem] bg-gray-100 overflow-hidden relative shadow-lg" />
              <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-[#db2777] rounded-tl-2xl" />
            </div>
            
            <div className="text-left flex-1">
              <CheckCircle className="text-[#db2777] mb-4" size={24} />
              <h3 className="text-3xl font-serif text-[#0F2C3E] mb-2">Sunil Bansal</h3>
              <p className="text-[#db2777] font-bold text-[9px] uppercase tracking-[0.4em] mb-4">Founder</p>
              <p className="text-gray-500 text-base font-light italic leading-snug">
                "Bangles are a bridge between tradition and the modern woman."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💍 CTA: Low Profile */}
      <section className="py-20 bg-[#fff1f2]/30 relative text-center">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <h2 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] mb-6 leading-tight">
              Wear a Piece of <br/> <span className="italic text-[#db2777]">History.</span>
            </h2>
            <Link href="/shop">
              <button className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-[#db2777] transition-all">
                Explore Shop
              </button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-white rounded-t-[100%]" />
      </section>
    </div>
  )
}