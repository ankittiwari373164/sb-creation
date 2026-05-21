'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Hammer, Palette, Crown, CheckCircle } from 'lucide-react'

export default function AboutPage() {
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

  // ✅ FIX 3: Real Google images of bangle workers from Firozabad
  const artisanImages = [
    '/bangle.avif',
    '/bangle2.webp',
    '/bangle3.jpg',
    '/bangle4.webp',
  ]

  return (
    <div className="min-h-screen bg-[#F5E9DC] selection:bg-[#F8C8DC]/10">
      
      {/* ✅ FIX 1 & 2: Hero — tightened py, pulled content closer together */}
      <section className="relative py-6 md:py-8 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#F8C8DC] rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-[#FFFFF0] rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 px-4 py-1 rounded-full bg-white shadow-sm border-2 border-[#D4AF37] flex items-center gap-3"
            >
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] font-bold tracking-[0.3em] uppercase">• Firozabad</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair text-[#2C2C2C] leading-[1.1] mb-3"
            >
              Crafted with Love, <span className="text-[#D4AF37] italic">Worn with Pride.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#4A4A4A] text-sm max-w-xl font-poppins font-light leading-snug opacity-85"
            >
              The story of SB Creation is written in fire and glass. The timeless soul of India's Glass City.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ✅ FIX 1: Story Section — reduced py drastically to close the gap */}
      <section className="py-6 md:py-8 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-[#D4AF37] text-[9px] font-bold tracking-[0.5em] uppercase mb-2 font-poppins">The Legacy</h2>
              <h3 className="text-3xl md:text-4xl font-playfair text-[#2C2C2C] mb-4 leading-tight">
                From the Furnace of <br/> 
                <span className="italic text-[#D4AF37]">Sitaram Bhagwandas</span>
              </h3>
            </div>

            <div className="space-y-4 text-[#4A4A4A] font-poppins text-base leading-relaxed">
              <p className="text-base text-[#2C2C2C] font-light">
                At SB Creation, we believe bangles are more than accessories—they are timeless expressions of tradition, elegance, and individuality. Rooted in Firozabad, Uttar Pradesh, famously known as the City of Bangles, our brand carries forward a rich legacy of craftsmanship perfected over generations.
              </p>
              
              <p className="text-base text-[#2C2C2C] font-light">
                Born from a strong foundation in bangle manufacturing, where Sitaram Bhagwandas & Co. have been a trusted name among wholesalers across India, strengthened by sister companies—Pankaj & Co., S. Deepak Bangle Store, and SB & Co.—SB Creation marks our evolution into the retail space—bringing our finest creations worldwide directly to you.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-4 border-t-2 border-[#D4AF37]/30">
                <div className="border-l-4 border-[#D4AF37] pl-4 py-2">
                  <p className="text-[#2C2C2C] font-playfair font-bold text-sm">Sitaram Bhagwandas & Co.</p>
                </div>
                <div className="border-l-4 border-[#F8C8DC] pl-4 py-2">
                  <p className="text-[#2C2C2C] font-playfair font-bold text-sm">Pankaj & Co.</p>
                </div>
                <div className="border-l-4 border-[#D4AF37] pl-4 py-2">
                  <p className="text-[#2C2C2C] font-playfair font-bold text-sm">S. Deepak Bangle</p>
                </div>
                <div className="border-l-4 border-[#F8C8DC] pl-4 py-2">
                  <p className="text-[#2C2C2C] font-playfair font-bold text-sm">SB & Co.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ✅ FIX 4 & 5: Visionaries — moved up, reduced py, compact founder cards */}
      <section className="py-8 md:py-10 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-playfair text-[#2C2C2C] mb-1">The Visionaries</h2>
              <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-bold uppercase font-poppins">Meet the Founders</p>
              <div className="w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] mx-auto mt-3 rounded-full" />
            </div>

            {/* ✅ FIX 5: Compact founder cards — smaller image, tighter text, all visible at once */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Piyush Gupta', role: 'Co-Founder', quote: 'Driving innovation while honoring tradition in every design.' },
                { name: 'Sejal Gupta', role: 'Co-Founder', quote: 'Creating experiences that celebrate the art of craftsmanship.' },
                { name: 'Vaishali Gupta', role: 'Co-Founder', quote: 'Bringing the spirit of Firozabad to the world stage.' }
              ].map((founder, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-3 flex justify-center">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#F5E9DC] to-[#FBF6F0] border-4 border-[#D4AF37]/30 overflow-hidden shadow-md flex items-center justify-center">
                      <Image
                        src={`/founder-${idx + 1}.jpg`}
                        alt={founder.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-16 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg" />
                    <div className="absolute bottom-0 left-1/2 translate-x-11 w-5 h-5 border-b-2 border-r-2 border-[#F8C8DC] rounded-br-lg" />
                  </div>

                  <CheckCircle className="text-[#D4AF37] mx-auto mb-2" size={18} />
                  <h3 className="text-lg font-playfair text-[#2C2C2C] mb-0.5 font-semibold">{founder.name}</h3>
                  <p className="text-[#D4AF37] font-poppins font-bold text-[9px] uppercase tracking-[0.3em] mb-2">{founder.role}</p>
                  <p className="text-[#4A4A4A] font-poppins text-xs leading-relaxed italic">{founder.quote}</p>
                </motion.div>
              ))}
            </div>

            {/* Collective Quote */}
            <div className="mt-8 text-center bg-gradient-to-r from-[#F5E9DC] to-[#FFFFF0] rounded-2xl p-6 md:p-8 border-2 border-[#D4AF37]/20">
              <svg className="w-6 h-6 text-[#D4AF37] mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.86-2.07-2-2.07C6.73 2.93 4.5 5 4.5 8v8c0 2.76 1.34 5 3.5 5zm12 0c3 0 7-1 7-8V5c0-1.25-.86-2.07-2-2.07C18.73 2.93 16.5 5 16.5 8v8c0 2.76 1.34 5 3.5 5z" />
              </svg>
              <p className="text-base md:text-lg font-playfair text-[#2C2C2C] italic mb-2">
                "Bangles are a bridge between tradition and the modern woman."
              </p>
              <p className="text-xs font-poppins text-[#4A4A4A] uppercase tracking-widest">Piyush, Sejal & Vaishali Gupta</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Alchemy Section — tightened py */}
      <section className="py-8 md:py-10 bg-gradient-to-b from-[#FFFFF0] to-[#FBF6F0] relative">
        <div className="container mx-auto px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-playfair text-[#2C2C2C] mb-1">The Alchemy</h2>
            <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-bold uppercase font-poppins">How We Craft Perfection</p>
            <div className="w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] mx-auto mt-3 rounded-full" />
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {process.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`relative p-6 rounded-2xl transition-all duration-300 group hover:shadow-xl ${
                  i === 1 
                    ? 'bg-white shadow-lg border-2 border-[#D4AF37] z-10 scale-105' 
                    : 'bg-white/50 border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] flex items-center justify-center text-white font-playfair font-bold text-base shadow-lg">
                  {i + 1}
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  i === 1 
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] text-white' 
                    : 'bg-[#F8C8DC]/40 text-[#D4AF37] group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#F8C8DC] group-hover:text-white'
                }`}>
                  <item.icon size={24} strokeWidth={2} />
                </div>

                <h4 className="text-lg font-playfair text-[#2C2C2C] mb-2 font-semibold">{item.title}</h4>
                <p className="text-[#4A4A4A] text-sm leading-relaxed font-poppins">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ✅ FIX 3: Artisan Gallery with real bangle-worker images */}
          <div>
            <h3 className="text-xl md:text-2xl font-playfair text-[#2C2C2C] mb-1">Our Artisans at Work</h3>
            <p className="text-[#4A4A4A] font-poppins text-sm mb-6 opacity-80">Every bangle is crafted by skilled hands in our Firozabad workshop</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {artisanImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative h-48 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]"
                >
                  <Image
                    src={img}
                    alt={`Artisan working ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white font-playfair text-xs font-semibold">Handcrafted Excellence</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#F8C8DC]/20 to-[#F5E9DC] relative text-center overflow-hidden">
        <div className="absolute top-10 right-10 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#F8C8DC]/10 rounded-full blur-2xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-[#2C2C2C] mb-3 leading-tight">
              Wear a Piece of <br/> <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC]">History.</span>
            </h2>
            <p className="text-[#4A4A4A] font-poppins text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed">
              Explore our collections and discover the perfect bangle set that tells your unique story.
            </p>
            <Link href="/shop">
              <button className="inline-block bg-gradient-to-r from-[#2C2C2C] to-[#4A4A4A] hover:from-[#D4AF37] hover:to-[#F8C8DC] text-white px-10 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg transition-all duration-300 transform hover:scale-105">
                Explore Shop
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer wave */}
      <div className="h-12 bg-white relative">
        <svg className="absolute top-0 w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="url(#gradient)">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#F8C8DC" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>

    </div>
  )
}