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
    toast.success('Thank you. We have received your message and will get back to you soon.', {
      style: { background: '#D4AF37', color: '#2d2416', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold' }
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-[#F5E9DC]">
      {/* 🏛️ Header Section - Luxury Gradient */}
      <section className="relative py-5 md:py-5 overflow-hidden bg-gradient-to-br from-[#F5E9DC] via-[#FFFFF0] to-[#F5E9DC]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#D4AF37] text-[9px] font-bold tracking-[0.5em] uppercase mb-2 block font-sans">
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2d2416] mb-4">
              How can we <span className="italic font-semibold text-[#d92b7a]">help?</span>
            </h1>
            <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto opacity-40" />
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 📍 Contact Information */}
            <motion.div 
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-serif text-[#2d2416] mb-3">Get in Touch</h2>
                <p className="text-[#5a4a42] text-sm font-light leading-relaxed mb-6 font-sans">
                  Have a question about our jewelry, a custom order, or shipping? Our team is here to help you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37]">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37] font-sans">Email ID</h3>
                    <p className="text-[#2d2416] text-sm font-medium font-sans">sbcreation1808@gmail.com,  contact@sbcreationofficial.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37]">
                    <Phone size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37] font-sans">Contact</h3>
                    <p className="text-[#2d2416] text-sm font-medium font-sans">+91-9557111954</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37]">
                    <MapPin size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37] font-sans">Address</h3>
                    <p className="text-[#2d2416] text-sm font-medium leading-tight font-sans">
                      Orchid Green, Raja ka taal, Firozabad, Uttar Pradesh (283203)
                    </p>
                  </div>
                </div>
              </div>

              {/* Opening Hours - Compact Box */}
              <div className="p-6 bg-[#FFFFFF] rounded-3xl border-2 border-[#D4AF37]">
                <div className="flex items-center gap-2 text-[#2d2416] mb-2">
                  <Clock size={14} className="text-[#D4AF37]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest font-sans">Business Hours</span>
                </div>
                <div className="text-xs text-[#5a4a42] font-light font-sans">
                  <div className="flex justify-between"><span>Mon — Sun</span><span>10:00 AM — 08:00 PM</span></div>
                </div>
              </div>
            </motion.div>

            {/* ✉️ Message Form */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-[2rem] shadow-xl shadow-[#2d2416]/5 p-8 md:p-10 border-2 border-[#D4AF37]">
                <div className="mb-6 flex items-center gap-2">
                   <Sparkles className="text-[#D4AF37]" size={18} />
                   <h2 className="text-xl font-serif text-[#2d2416]">Send a Message</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] ml-4 font-sans">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-3 px-6 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] ml-4 font-sans">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-3 px-6 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] ml-4 font-sans">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Regarding..."
                      required
                      className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-3 px-6 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] ml-4 font-sans">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="How can we help?"
                      className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-[1.5rem] py-4 px-6 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none transition-all resize-none font-sans"
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-[#D4AF37] text-[#2d2416] py-4 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F8C8DC] transition-all shadow-md group font-sans">
                    Send Message
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 💬 WhatsApp Support */}
      <a 
        href="https://wa.me/919557111954" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[100] bg-[#D4AF37] text-[#2d2416] p-3 rounded-full shadow-lg hover:scale-110 hover:bg-[#F8C8DC] transition-all flex items-center gap-2 group"
      >
        <MessageCircle size={20} fill="currentColor" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap font-sans">
          Chat Support
        </span>
      </a>
    </div>
  )
}