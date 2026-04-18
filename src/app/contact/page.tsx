'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Your inquiry has been received. Our concierge will contact you shortly.', {
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '12px' }
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      {/* 🏛️ Hero Section: Boutique Header */}
      <section className="relative py-28 overflow-hidden bg-[#0F2C3E]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 block">
              Client Concierge
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
              How can we <span className="italic font-light text-[#D4AF37]">assist you?</span>
            </h1>
            <div className="w-20 h-[1px] bg-[#D4AF37] mx-auto opacity-30" />
          </motion.div>
        </div>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* 📍 Info Column */}
            <motion.div 
              className="lg:col-span-5 space-y-12"
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-3xl font-serif text-[#0F2C3E] mb-6">Contact the Atelier</h2>
                <p className="text-[#0F2C3E]/60 font-light leading-relaxed mb-8">
                  Whether you have a question about our heritage collections, a bespoke bridal order, or shipping—our specialists are here to provide a seamless experience.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#0F2C3E] group-hover:text-white transition-all duration-500">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Email Concierge</h3>
                    <p className="text-[#0F2C3E] font-medium italic">hello@sbcreation.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#0F2C3E] group-hover:text-white transition-all duration-500">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Direct Line</h3>
                    <p className="text-[#0F2C3E] font-medium tracking-tighter">+91 91XXX XXXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#0F2C3E] group-hover:text-white transition-all duration-500">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">Boutique Address</h3>
                    <p className="text-[#0F2C3E] font-medium leading-relaxed">
                      SB Creation, Firozabad Heritage Complex <br />
                      Uttar Pradesh, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="p-8 bg-[#FAF9F6] rounded-[2rem] border border-[#D4AF37]/10">
                <div className="flex items-center gap-3 text-[#0F2C3E] mb-4">
                  <Clock size={18} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Atelier Hours</span>
                </div>
                <div className="space-y-2 text-sm text-[#0F2C3E]/60 font-light">
                  <div className="flex justify-between"><span>Mon — Sat</span><span>10:00 AM — 08:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>By Appointment Only</span></div>
                </div>
              </div>
            </motion.div>

            {/* ✉️ Form Column */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(15,44,62,0.08)] p-10 md:p-14 border border-gray-50">
                <div className="mb-10 text-center md:text-left">
                   <Sparkles className="text-[#D4AF37] mb-4 mx-auto md:mx-0" size={24} />
                   <h2 className="text-3xl font-serif text-[#0F2C3E]">Send a Message</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]/40 ml-4">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]/40 ml-4">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]/40 ml-4">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Custom Bridal Order / Wholesale Inquiry"
                      required
                      className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-8 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]/40 ml-4">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-[#FAF9F6] border-none rounded-[2rem] py-6 px-8 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all shadow-xl group">
                    Send Inquiry
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🟢 Floating WhatsApp Support */}
      <a 
        href="https://wa.me/91XXXXXXXXXX" 
        className="fixed bottom-24 right-8 md:bottom-12 md:right-12 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageCircle size={24} fill="white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          Live Concierge
        </span>
      </a>
    </div>
  )
}