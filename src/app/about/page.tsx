'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, ShieldCheck, Globe, Sparkles, Hammer, Palette, Crown, CheckCircle, Users } from 'lucide-react'

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
      desc: 'We heat raw glass in traditional furnaces at very high temperatures to make it perfectly clear.' 
    },
    { 
      title: 'Shaping by Hand', 
      icon: Palette, 
      desc: 'Our master workers use traditional tools to spin and shape the glass into perfect bangles.' 
    },
    { 
      title: 'Final Details', 
      icon: Crown, 
      desc: 'We add crystals and gold plating by hand to give every piece its beautiful shine.' 
    }
  ]

  const beliefs = [
    { title: 'Handmade Quality', desc: 'Every single piece is made by hand, not by machines.' },
    { title: 'Fair Wages', desc: 'We support our local workers with fair pay and good conditions.' },
    { title: 'True Prices', desc: 'We bring jewelry directly from the factory to you at the best price.' }
  ]

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      
      {/* 🏛️ SECTION 1: Hero */}
      <section className="relative py-32 overflow-hidden bg-[#0F2C3E]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-6 block">
              Directly from Firozabad to your Door
            </span>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
              The Art of <br /> 
              <span className="italic font-light text-[#D4AF37]">Indian Jewelry</span>
            </h1>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mb-10" />
            <p className="text-[#FAF9F6]/60 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              We don’t just make bangles—we create beautiful jewelry that celebrates our culture and the hard work of Firozabad artisans.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
      </section>

      {/* 📜 SECTION 2: Our Story */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6 relative">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="relative z-20 rounded-[3rem] overflow-hidden border-[15px] border-white shadow-2xl">
                <Image src="/legacy-workshop.jpg" alt="Our Workshop" width={600} height={800} className="object-cover" />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-80 bg-[#D4AF37] -z-10 rounded-[3rem] opacity-20 hidden md:block" />
            </div>

            <div className="lg:col-span-6">
              <h2 className="text-[11px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase mb-6">Our History</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] mb-8">
                Generations of <span className="italic text-gray-400">Glass Making.</span>
              </h3>
              <div className="space-y-6 text-[#0F2C3E]/70 font-light leading-relaxed text-lg">
                <p>
                  Started by <strong>Sitaram Bhagwandas & Co.</strong>, we are based in Firozabad—known worldwide as the glass city. SB Creation was created to bring our high-quality wholesale jewelry directly to you.
                </p>
                <p>
                  With the support of our family businesses, Pankaj & Co. and SB & Co., we control everything from the furnace to the final packaging to ensure you get the best.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛠️ SECTION 3: The Process */}
      <section className="py-24 bg-[#FAF9F6] border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif text-[#0F2C3E] mb-4">How It Is Made</h2>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase">Handmade with Love</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {process.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="mb-8 relative inline-block">
                  <div className="w-20 h-20 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#0F2C3E] group-hover:text-white transition-all">
                    <item.icon size={32} strokeWidth={1} />
                  </div>
                </div>
                <h4 className="text-xl font-serif text-[#0F2C3E] mb-4">{item.title}</h4>
                <p className="text-[#0F2C3E]/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✨ NEW SECTION 4: Our Beliefs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {beliefs.map((belief, i) => (
              <div key={i} className="p-10 rounded-[2rem] bg-[#FAF9F6] border border-gray-50 flex flex-col items-center text-center">
                <CheckCircle className="text-[#db2777] mb-4" size={24} />
                <h4 className="text-[#0F2C3E] font-bold text-sm uppercase tracking-widest mb-2">{belief.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{belief.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 SECTION 5: Stats */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-8">
                <h3 className="text-5xl font-serif text-[#0F2C3E] mb-2">{stat.value}</h3>
                <p className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 NEW SECTION 6: Meet the Team */}
      <section className="py-24 bg-[#0F2C3E]/5">
        <div className="container mx-auto px-6 text-center">
          <Users className="text-[#D4AF37] mx-auto mb-6" size={32} />
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-12">Our Family</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="space-y-4">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg">
                {/* Add Founder Image */}
              </div>
              <div>
                <p className="font-bold text-[#0F2C3E]">Founder Name</p>
                <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Master Craftsman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💍 SECTION 7: Final CTA */}
      <section className="py-32 bg-[#0F2C3E] text-center relative overflow-hidden">
        <div className="container mx-auto max-w-3xl relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <Sparkles className="text-[#D4AF37] mx-auto mb-10" size={40} />
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
              A Story in <span className="italic font-light">Every Piece</span>
            </h2>
            <p className="text-white/50 text-lg mb-12 font-light">
              At SB Creation, we believe jewelry is more than just an accessory—it’s a piece of art that stays with you forever.
            </p>
            <Link href="/shop">
              <button className="bg-[#D4AF37] text-[#0F2C3E] px-16 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl">
                Browse Shop
              </button>
            </Link>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
      </section>
    </div>
  )
}