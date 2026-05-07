"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F5E9DC] text-[#2d2416] border-t-2 border-[#D4AF37]">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* 🏛️ Brand Info & Logo */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group hover:opacity-85 transition-opacity w-fit">
              <div className="relative h-16 w-16 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="SB Creation Logo" 
                  fill 
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex items-baseline gap-2 whitespace-nowrap">
                <span 
                  className="text-3xl md:text-3xl text-[#0F5A7E] italic font-bold"
                  style={{ 
                    fontFamily: '"Playfair Display", serif', 
                    fontWeight: 700,
                    lineHeight: '1'
                  }}
                >
                  SB
                </span>
                <span 
                  className="text-xl md:text-2xl text-[#D4AF37] font-semibold tracking-widest"
                  style={{ 
                    fontFamily: '"Poppins", sans-serif', 
                    fontWeight: 600,
                  }}
                >
                  CREATION
                </span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-[#5a4a42] max-w-xs font-sans">
              Handcrafted bangles and jewelry pieces from the heart of Firozabad. Bringing traditional glass art to the modern world, one piece at a time.
            </p>

            <div className="flex space-x-6">
              <a href="https://instagram.com/_sbcreation" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#F8C8DC] transition-colors p-2 rounded-full hover:bg-[#FFFFFF]/30">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/share/17fTCz8vQ8/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#F8C8DC] transition-colors p-2 rounded-full hover:bg-[#FFFFFF]/30">
                <Facebook size={20} />
              </a>
            </div>

            {/* Decorative element */}
            <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-sans">
              <Heart size={16} className="text-[#F8C8DC]" fill="#F8C8DC" />
              <span>Handcrafted with love</span>
            </div>
          </div>

          {/* 🔗 Shop Links */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] mb-8 font-sans">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Collections</Link></li>
              <li><Link href="/wishlist" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Wishlist</Link></li>
              <li><Link href="/blog" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Blogs</Link></li>
              <li><Link href="/about" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link href="/dashboard" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Dashboard</Link></li>
            </ul>
          </div>

          {/* 📞 Help & Support */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] mb-8 font-sans">Support</h3>
            <ul className="space-y-4">
              <li><Link href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20want%20to%20track%20my%20order" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Track Order</Link></li>
              <li><Link href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20want%20to%20customize%20my%20order" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Custom Orders</Link></li>
              <li><Link href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20have%20a%20bulk%20inquiry" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Bulk Enquiries</Link></li>
              <li><Link href="/contact" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Contact Us</Link></li>
              <li><Link href="/returns" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] transition-all font-sans hover:translate-x-1 inline-block">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* 📍 Contact Details */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] font-sans">Get in Touch</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5 group-hover:text-[#F8C8DC] transition-colors" />
                <span className="text-sm text-[#5a4a42] group-hover:text-[#2d2416] transition-colors font-sans">
                  Orchid Green, Raja ka taal, <br />
                  Firozabad, UP 283203
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-[#D4AF37] shrink-0 group-hover:text-[#F8C8DC] transition-colors" />
                <a href="mailto:contact@sbcreationofficial.com" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] font-sans transition-colors">
                  contact@sbcreation<br/>official.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-[#D4AF37] shrink-0 group-hover:text-[#F8C8DC] transition-colors" />
                <a href="tel:+919557111954" className="text-sm text-[#5a4a42] hover:text-[#D4AF37] font-sans transition-colors">
                  +91 9557 1119 54
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Decorative divider */}
        <div className="mt-16 pt-12 border-t-2 border-[#D4AF37]/30">
          {/* Top section with messaging */}
          <div className="mb-8 pb-8 border-b border-[#D4AF37]/20">
            <p className="text-sm text-[#5a4a42] leading-relaxed font-sans text-center">
              For international deliveries, <a href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20have%20an%20international%20order%20inquiry" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#F8C8DC] font-semibold transition-all inline-flex items-center gap-1">
                connect on WhatsApp <span className="text-xs">↗</span>
              </a> for shipping details and custom orders.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-[#5a4a42]/70 font-sans">
              © {new Date().getFullYear()} SB Creation. All rights reserved. | Handcrafted in Firozabad 💍
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-policy" className="text-xs text-[#5a4a42] hover:text-[#D4AF37] font-sans transition-all">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-[#5a4a42] hover:text-[#D4AF37] font-sans transition-all">Terms of Service</Link>
              {/* <Link href="/shipping-policy" className="text-xs text-[#5a4a42] hover:text-[#D4AF37] font-sans transition-all">Shipping Policy</Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;