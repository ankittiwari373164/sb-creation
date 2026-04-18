'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Star, ShieldCheck, Globe, Sparkles, Hammer, Palette, Crown } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { label: 'Artisans Empowered', value: '250+' },
    { label: 'Designs Created', value: '5000+' },
    { label: 'Years of Legacy', value: '30+' },
    { label: 'Global Shipments', value: '15k+' },
  ]

  const process = [
    { 
      title: 'The Melting Point', 
      icon: Hammer, 
      desc: 'Raw glass is heated in traditional furnaces at precise temperatures to achieve the perfect clarity.' 
    },
    { 
      title: 'Hand-Molding', 
      icon: Palette, 
      desc: 'Master craftsmen use age-old tools to spin and shape the glass into perfect circles.' 
    },
    { 
      title: 'Embellishment', 
      icon: Crown, 
      desc: 'Zardosi, crystals, and gold plating are applied by hand for that signature SBC luster.' 
    }
  ]

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      
      {/* 🏛️ SECTION 1: Ethereal Hero */}
      <section className="relative py-32 overflow-hidden bg-[#0F2C3E]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-6 block">
              Directly from Firozabad to your Door
            </span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[0.9]">
              The Soul of <br /> 
              <span className="italic font-light text-[#D4AF37] lowercase">Indian Artistry</span>
            </h1>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-10" />
            <p className="text-[#FAF9F6]/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              We don’t just manufacture bangles—we craft experiences that celebrate culture, style, and the heartbeat of Firozabad.
            </p>
          </motion.div>
        </div>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#db2777]/5 rounded-full blur-[100px]" />
      </section>

      {/* 📜 SECTION 2: Staggered Heritage Story */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            
            <div className="lg:col-span-6 relative">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative z-20 rounded-[3rem] overflow-hidden border-[15px] border-white shadow-2xl"
              >
                <Image src="/legacy-workshop.jpg" alt="SBC Heritage" width={600} height={800} className="object-cover" />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-80 bg-[#D4AF37] -z-10 rounded-[3rem] hidden md:block opacity-20" />
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-[11px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase mb-6">Our Roots</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] mb-8">
                Generations of <span className="italic">Glass Mastery.</span>
              </h3>
              <div className="space-y-6 text-[#0F2C3E]/70 font-light leading-relaxed text-lg">
                <p>
                  Born from the heritage of <strong>Sitaram Bhagwandas & Co.</strong>, we are rooted in Firozabad—the glass capital of the world. Our evolution into SB Creation marks a new chapter where we bring wholesale quality directly to the retail consumer.
                </p>
                <p>
                  Strengthened by our sister concerns—Pankaj & Co. and SB & Co.—we maintain a vertical grip on quality, from the raw furnace to the final velvet-lined box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ SECTION 3: The Process (Horizontal Grid) */}
      <section className="py-24 bg-[#FAF9F6] border-y border-[#D4AF37]/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-[#0F2C3E] mb-4 uppercase tracking-tighter">The Making</h2>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase">From Fire to Fashion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {process.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="mb-8 relative inline-block">
                  <div className="w-20 h-20 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#0F2C3E] group-hover:text-white transition-all duration-500">
                    <item.icon size={32} strokeWidth={1} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[40px] font-serif text-[#0F2C3E]/5 italic font-bold">0{i+1}</span>
                </div>
                <h4 className="text-xl font-serif text-[#0F2C3E] mb-4">{item.title}</h4>
                <p className="text-[#0F2C3E]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 SECTION 4: Impact Stats */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                className="p-8 border-x border-gray-50"
              >
                <h3 className="text-5xl font-serif text-[#0F2C3E] mb-2">{stat.value}</h3>
                <p className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💍 SECTION 5: The Promise (Final CTA) */}
      <section className="py-32 bg-[#0F2C3E] text-center relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <Sparkles className="text-[#D4AF37] mx-auto mb-10" size={40} />
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
              A Story in <span className="italic font-light">Every Click</span>
            </h2>
            <p className="text-white/50 text-lg mb-12 font-light">
              At SB Creation, luxury isn’t just about the price—it’s about the soul of the handcrafted piece that finds its way to your wrist.
            </p>
            <button className="bg-[#D4AF37] text-[#0F2C3E] px-16 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl">
              Visit the Atelier
            </button>
          </motion.div>
        </div>
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
      </section>
    </div>
  )
}