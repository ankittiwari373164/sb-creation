"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#fffdfa] text-[#0F2C3E] border-t border-[#D4AF37]/10">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 🏛️ Brand & Philosophy (Spans 4 columns) */}
          <div className="md:col-span-4 space-y-8">
            <div className="flex flex-col">
              <span className="text-3xl font-serif tracking-tighter uppercase font-bold text-[#db2777]">
                SB <span className="text-[#0F2C3E]">Creation</span>
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-[1px] w-8 bg-[#D4AF37]" />
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">
                  Firozabad Heritage
                </span>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed text-[#0F2C3E]/70 max-w-xs font-light italic">
              "Preserving the timeless art of handcrafted glass and metal bangles. Every piece is a testament to the legacy of our artisans."
            </p>

            <div className="flex space-x-6">
              <a href="#" className="text-[#0F2C3E]/40 hover:text-[#db2777] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#0F2C3E]/40 hover:text-[#db2777] transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#0F2C3E]/40 hover:text-[#db2777] transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 🔗 Quick Links (Spans 2 columns) */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Collections</h3>
            <ul className="space-y-4">
              {['Glass Sets', 'Metal Kangan', 'Bridal Special', 'Daily Wear'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-sm font-medium hover:text-[#db2777] transition-all opacity-80 hover:opacity-100">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Customer Care (Spans 3 columns) */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Concierge</h3>
            <ul className="space-y-4">
              {['Track Order', 'Shipping Policy', 'Returns & Exchange', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-medium hover:text-[#db2777] transition-all opacity-80 hover:opacity-100">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Atelier Info (Spans 3 columns) */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Atelier</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D4AF37] mt-0.5" />
                <span className="text-sm leading-relaxed opacity-80">
                  Firozabad, Uttar Pradesh <br />
                  Heart of the Glass City, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4AF37]" />
                <a href="mailto:hello@sbcreation.com" className="text-sm opacity-80 hover:text-[#db2777]">
                  hello@sbcreation.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4AF37]" />
                <span className="text-sm opacity-80">+91 91XXX XXXXX</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 📜 Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-[#0F2C3E]/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40">
            &copy; {new Date().getFullYear()} SB Creation Heritage. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 hover:text-[#db2777]">Privacy</Link>
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40 hover:text-[#db2777]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;