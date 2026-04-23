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
      style: { background: '#db2777', color: '#fff', borderRadius: '50px', fontSize: '12px' }
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 🏛️ Header Section - Tightened Padding */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-[#fff1f2]">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#db2777] text-[9px] font-bold tracking-[0.5em] uppercase mb-2 block">
              Support
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-4">
              How can we <span className="italic font-light text-[#db2777]">help?</span>
            </h1>
            <div className="w-16 h-[1px] bg-[#db2777] mx-auto opacity-20" />
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 📍 Contact Information - Minimalist Spacing */}
            <motion.div 
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-serif text-[#0F2C3E] mb-3">Get in Touch</h2>
                <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
                  Have a question about our jewelry, a custom order, or shipping? Our team is here to help you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#db2777] border border-gray-100">
                    <Mail size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Email ID</h3>
                    <p className="text-[#0F2C3E] text-sm font-medium">sbcreation1808@gmail.com,  contact@sbcreationofficial.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#db2777] border border-gray-100">
                    <Phone size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Contact</h3>
                    <p className="text-[#0F2C3E] text-sm font-medium">+91-9557111954</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#db2777] border border-gray-100">
                    <MapPin size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Address</h3>
                    <p className="text-[#0F2C3E] text-sm font-medium leading-tight">
                      Orchid Green, Raja ka taal, Firozabad, Uttar Pradesh (283203)
                    </p>
                  </div>
                </div>
              </div>

              {/* Opening Hours - Compact Box */}
              <div className="p-6 bg-[#F9FAFB] rounded-3xl border border-gray-100">
                <div className="flex items-center gap-2 text-[#0F2C3E] mb-2">
                  <Clock size={14} className="text-[#db2777]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Business Hours</span>
                </div>
                <div className="text-xs text-gray-500 font-light">
                  <div className="flex justify-between"><span>Mon — Sun</span><span>10:00 AM — 08:00 PM</span></div>
                </div>
              </div>
            </motion.div>

            {/* ✉️ Message Form - Refined Design */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 p-8 md:p-10 border border-gray-50">
                <div className="mb-6 flex items-center gap-2">
                   <Sparkles className="text-[#db2777]" size={18} />
                   <h2 className="text-xl font-serif text-[#0F2C3E]">Send a Message</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="w-full bg-[#F9FAFB] border-none rounded-full py-3 px-6 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#db2777] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full bg-[#F9FAFB] border-none rounded-full py-3 px-6 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#db2777] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Regarding..."
                      required
                      className="w-full bg-[#F9FAFB] border-none rounded-full py-3 px-6 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#db2777] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-4">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="How can we help?"
                      className="w-full bg-[#F9FAFB] border-none rounded-[1.5rem] py-4 px-6 text-sm text-[#0F2C3E] focus:ring-1 focus:ring-[#db2777] outline-none transition-all resize-none"
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-[#0F2C3E] text-white py-4 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#db2777] transition-all shadow-md group">
                    Send Message
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🟢 WhatsApp Support - Compact */}
      <a 
        href="https://wa.me/919557111954" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[100] bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
      >
        <MessageCircle size={20} fill="white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
          Chat Support
        </span>
      </a>
    </div>
  )
}