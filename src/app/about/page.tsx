'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Hammer, Palette, Crown, CheckCircle } from 'lucide-react'

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

  // Artisan gallery images
  const artisanImages = [
    '/artisan-1.jpg',
    '/artisan-2.jpg',
    '/artisan-3.jpg',
    '/artisan-4.jpg',
  ]

  return (
    <div className="min-h-screen bg-[#F5E9DC] selection:bg-[#F8C8DC]/10">
      
      {/* 🏛️ HERO SECTION */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#F8C8DC] rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-[#FFFFF0] rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 px-4 py-1 rounded-full bg-white shadow-sm border-2 border-[#D4AF37] flex items-center gap-3"
            >
              <Sparkles size={12} className="text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-[9px] font-bold tracking-[0.3em] uppercase">• Firozabad</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-playfair text-[#2C2C2C] leading-[1.1] mb-4"
            >
              Crafted with Love, <span className="text-[#D4AF37] italic">Worn with Pride.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#4A4A4A] text-base md:text-lg max-w-xl font-poppins font-light leading-snug opacity-85"
            >
              The story of SB Creation is written in fire and glass. The timeless soul of India's Glass City.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 📜 THE STORY SECTION - Full Width Text */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-10">
              <h2 className="text-[#D4AF37] text-[9px] font-bold tracking-[0.5em] uppercase mb-3 font-poppins">The Legacy</h2>
              <h3 className="text-3xl md:text-4xl font-playfair text-[#2C2C2C] mb-8 leading-tight">
                From the Furnace of <br/> 
                <span className="italic text-[#D4AF37]">Sitaram Bhagwandas</span>
              </h3>
            </div>

            {/* Main Content */}
            <div className="space-y-6 text-[#4A4A4A] font-poppins text-base leading-relaxed">
              <p className="text-lg text-[#2C2C2C] font-light">
                At SB Creation, we believe bangles are more than accessories—they are timeless expressions of tradition, elegance, and individuality. Rooted in Firozabad, Uttar Pradesh, famously known as the City of Bangles, our brand carries forward a rich legacy of craftsmanship perfected over generations.
              </p>
              
              <p className="text-lg text-[#2C2C2C] font-light">
                Born from a strong foundation in bangle manufacturing, where Sitaram Bhagwandas & Co. have been a trusted name among wholesalers across India, strengthened by sister companies—Pankaj & Co., S. Deepak Bangle Store, and SB & Co.—SB Creation marks our evolution into the retail space—bringing our finest creations worldwide directly to you.
              </p>

              {/* Sister Companies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-8 border-t-2 border-[#D4AF37]/30">
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

      {/* 🛠️ THE ALCHEMY SECTION - Improved with Images */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#FFFFF0] to-[#FBF6F0] relative">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-playfair text-[#2C2C2C] mb-2">The Alchemy</h2>
            <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-bold uppercase font-poppins">How We Craft Perfection</p>
            <div className="w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] mx-auto mt-4 rounded-full" />
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {process.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`p-8 rounded-2xl transition-all duration-300 group hover:shadow-xl ${
                  i === 1 
                    ? 'bg-white shadow-lg border-2 border-[#D4AF37] relative z-10 scale-105' 
                    : 'bg-white/50 border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]'
                }`}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] flex items-center justify-center text-white font-playfair font-bold text-lg shadow-lg">
                  {i + 1}
                </div>

                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  i === 1 
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] text-white' 
                    : 'bg-[#F8C8DC]/40 text-[#D4AF37] group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#F8C8DC] group-hover:text-white'
                }`}>
                  <item.icon size={28} strokeWidth={2} />
                </div>

                <h4 className="text-xl md:text-2xl font-playfair text-[#2C2C2C] mb-3 font-semibold">{item.title}</h4>
                <p className="text-[#4A4A4A] text-sm md:text-base leading-relaxed font-poppins">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Artisan Gallery */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-playfair text-[#2C2C2C] mb-3">Our Artisans at Work</h3>
            <p className="text-[#4A4A4A] font-poppins text-sm md:text-base mb-10 opacity-80">Every bangle is crafted by skilled hands in our Firozabad workshop</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisanImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative h-64 md:h-72 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]"
                >
                  <Image
                    src={img}
                    alt={`Artisan working ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-playfair text-sm font-semibold">Handcrafted Excellence</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📊 STATS SECTION */}
      
      {/* 👥 THE FOUNDERS SECTION */}
      <section className="py-16 md:py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-playfair text-[#2C2C2C] mb-2">The Visionaries</h2>
              <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] font-bold uppercase font-poppins">Meet the Founders</p>
              <div className="w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] mx-auto mt-4 rounded-full" />
            </div>

            {/* Founders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Piyush Gupta', role: 'Co-Founder' },
                { name: 'Sejal Gupta', role: 'Co-Founder' },
                { name: 'Vaishali Gupta', role: 'Co-Founder' }
              ].map((founder, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-center"
                >
                  {/* Image Placeholder */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[#F5E9DC] to-[#FBF6F0] border-4 border-[#D4AF37]/30 overflow-hidden shadow-lg flex items-center justify-center">
                      <Image
                        src={`/founder-${idx + 1}.jpg`}
                        alt={founder.name}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Corner accent */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#F8C8DC] rounded-br-lg" />
                  </div>

                  <CheckCircle className="text-[#D4AF37] mx-auto mb-3" size={24} />
                  <h3 className="text-2xl font-playfair text-[#2C2C2C] mb-1 font-semibold">{founder.name}</h3>
                  <p className="text-[#D4AF37] font-poppins font-bold text-[9px] uppercase tracking-[0.3em] mb-3">{founder.role}</p>
                  
                  <p className="text-[#4A4A4A] font-poppins text-sm leading-relaxed italic">
                    {idx === 0 && "Driving innovation while honoring tradition in every design."}
                    {idx === 1 && "Creating experiences that celebrate the art of craftsmanship."}
                    {idx === 2 && "Bringing the spirit of Firozabad to the world stage."}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Collective Quote */}
            <div className="mt-16 text-center bg-gradient-to-r from-[#F5E9DC] to-[#FFFFF0] rounded-2xl p-8 md:p-12 border-2 border-[#D4AF37]/20">
              <svg className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-7 3.75-7 5v11c0 1.25 2 4 7 4z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-7 3.75-7 5v11c0 1.25 2 4 7 4z" />
              </svg>
              <p className="text-lg md:text-xl font-playfair text-[#2C2C2C] italic mb-3">
                "Bangles are a bridge between tradition and the modern woman."
              </p>
              <p className="text-sm font-poppins text-[#4A4A4A] uppercase tracking-widest">Piyush, Sejal & Vaishali Gupta</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💍 CTA SECTION */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F8C8DC]/20 to-[#F5E9DC] relative text-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#F8C8DC]/10 rounded-full blur-2xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair text-[#2C2C2C] mb-4 leading-tight">
              Wear a Piece of <br/> <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC]">History.</span>
            </h2>
            <p className="text-[#4A4A4A] font-poppins text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Explore our collections and discover the perfect bangle set that tells your unique story.
            </p>
            <Link href="/shop">
              <button className="inline-block bg-gradient-to-r from-[#2C2C2C] to-[#4A4A4A] hover:from-[#D4AF37] hover:to-[#F8C8DC] text-white px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-lg transition-all duration-300 transform hover:scale-105">
                Explore Shop
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer wave decoration */}
      <div className="h-16 bg-white relative">
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