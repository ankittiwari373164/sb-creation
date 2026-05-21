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
      style: { background: '#0F5A7E', color: '#fff', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold' }
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <section className="relative py-10 md:py-14 overflow-hidden bg-white">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#0F5A7E]/8 blur-3xl pointer-events-none" />
        <div className="absolute -top-8 -right-12 w-48 h-48 rounded-full bg-[#d92b7a]/10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-[#d92b7a] text-[9px] font-bold tracking-[0.5em] uppercase mb-3 block font-sans">
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#0F2D40] mb-4">
              How can we <span className="italic font-semibold text-[#d92b7a]">help?</span>
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[2px] w-10 bg-[#0F5A7E] rounded-full" />
              <div className="h-2 w-2 rounded-full bg-[#d92b7a]" />
              <div className="h-[2px] w-10 bg-[#0F5A7E] rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main grid ── */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ── LEFT: Contact info ── */}
            <motion.div
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-serif text-[#0F2D40] mb-3">Get in Touch</h2>
                <p className="text-[#3a4a5a] text-sm font-light leading-relaxed font-sans">
                  Have a question about our jewellery, a custom order, or shipping? Our team is here to help.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 flex-shrink-0 rounded-2xl bg-[#0F5A7E]/10 flex items-center justify-center border-2 border-[#0F5A7E] group-hover:bg-[#0F5A7E] transition-colors">
                    <Mail size={16} strokeWidth={1.8} className="text-[#0F5A7E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#0F5A7E] mb-0.5 font-sans">Email ID</h3>
                    <p className="text-[#0F2D40] text-sm font-medium font-sans leading-snug">
                      sbcreation1808@gmail.com<br />contact@sbcreationofficial.com
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 flex-shrink-0 rounded-2xl bg-[#d92b7a]/10 flex items-center justify-center border-2 border-[#d92b7a] group-hover:bg-[#d92b7a] transition-colors">
                    <Phone size={16} strokeWidth={1.8} className="text-[#d92b7a] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#d92b7a] mb-0.5 font-sans">Contact</h3>
                    <p className="text-[#0F2D40] text-sm font-medium font-sans">+91-9557111954</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 flex-shrink-0 rounded-2xl bg-[#0F5A7E]/10 flex items-center justify-center border-2 border-[#0F5A7E] group-hover:bg-[#0F5A7E] transition-colors">
                    <MapPin size={16} strokeWidth={1.8} className="text-[#0F5A7E] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-bold uppercase tracking-widest text-[#0F5A7E] mb-0.5 font-sans">Address</h3>
                    <p className="text-[#0F2D40] text-sm font-medium leading-snug font-sans">
                      Orchid Green, Raja ka taal,<br />Firozabad, Uttar Pradesh (283203)
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours card */}
              <div className="p-6 bg-white rounded-3xl border-2 border-[#0F5A7E] shadow-[0_4px_24px_rgba(15,90,126,0.10)]">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={15} className="text-[#0F5A7E]" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A7E] font-sans">Business Hours</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#0F2D40] font-sans">
                  <span>Mon — Sun</span>
                  <span className="text-[#d92b7a] font-bold">10:00 AM — 08:00 PM</span>
                </div>
              </div>

              {/* Decorative accent card */}
              <div className="relative p-6 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F5A7E] to-[#0a3d57]">
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#d92b7a]/20" />
                <div className="absolute top-3 right-8 w-10 h-10 rounded-full bg-white/10" />
                <Sparkles size={20} className="text-[#F8C8DC] mb-3" />
                <p className="text-white text-sm font-light leading-relaxed font-sans relative z-10">
                  We craft every piece with love from Firozabad — the glass city of India.
                </p>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                  <div className="h-[2px] w-6 bg-[#d92b7a] rounded-full" />
                  <span className="text-[#F8C8DC] text-[9px] font-bold uppercase tracking-widest font-sans">
                    Since 1808
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Form ── */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(15,90,126,0.12)] p-8 md:p-10 border-2 border-[#0F5A7E]"
              >
                {/* Form heading */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#d92b7a]/15 flex items-center justify-center">
                    <Send size={15} className="text-[#d92b7a]" />
                  </div>
                  <h2 className="text-xl font-serif text-[#0F2D40]">Send a Message</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A7E] ml-4 font-sans">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="w-full bg-[#f4f8fb] border-2 border-[#0F5A7E]/30 rounded-full py-3 px-6
                                 text-sm text-[#0F2D40] placeholder-[#3a4a5a]/40
                                 focus:ring-2 focus:ring-[#d92b7a]/30 focus:border-[#d92b7a] outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A7E] ml-4 font-sans">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-[#f4f8fb] border-2 border-[#0F5A7E]/30 rounded-full py-3 px-6
                                 text-sm text-[#0F2D40] placeholder-[#3a4a5a]/40
                                 focus:ring-2 focus:ring-[#d92b7a]/30 focus:border-[#d92b7a] outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A7E] ml-4 font-sans">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Regarding..."
                      required
                      className="w-full bg-[#f4f8fb] border-2 border-[#0F5A7E]/30 rounded-full py-3 px-6
                                 text-sm text-[#0F2D40] placeholder-[#3a4a5a]/40
                                 focus:ring-2 focus:ring-[#d92b7a]/30 focus:border-[#d92b7a] outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#0F5A7E] ml-4 font-sans">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="How can we help?"
                      className="w-full bg-[#f4f8fb] border-2 border-[#0F5A7E]/30 rounded-[1.5rem] py-4 px-6
                                 text-sm text-[#0F2D40] placeholder-[#3a4a5a]/40
                                 focus:ring-2 focus:ring-[#d92b7a]/30 focus:border-[#d92b7a] outline-none transition-all resize-none font-sans"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-[#d92b7a] text-white py-4 rounded-full flex items-center justify-center
                               gap-2 text-[10px] font-bold uppercase tracking-[0.25em]
                               hover:bg-[#0F5A7E] transition-all duration-300 shadow-lg shadow-[#d92b7a]/25 group font-sans"
                  >
                    Send Message
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>

                  <p className="text-center text-[9px] text-[#3a4a5a]/60 font-sans tracking-wide">
                    We typically respond within 24 hours
                  </p>
                </div>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── WhatsApp FAB ── */}
      <a
        href="https://wa.me/919557111954"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[100]
                   bg-[#d92b7a] text-white p-3 rounded-full shadow-lg shadow-[#d92b7a]/40
                   hover:scale-110 hover:bg-[#0F5A7E] transition-all flex items-center gap-2 group"
      >
        <MessageCircle size={20} fill="currentColor" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500
                         text-[9px] font-bold uppercase tracking-widest whitespace-nowrap font-sans">
          Chat Support
        </span>
      </a>
    </div>
  )
}