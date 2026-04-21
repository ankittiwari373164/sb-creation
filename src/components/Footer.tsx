"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#fffff] text-[#0F2C3E] border-t border-gray-200">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 🏛️ Brand Info */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="relative h-16 w-44 block">
              <Image 
                src="/logo.png" 
                alt="SB Creation Logo" 
                fill 
                className="object-contain"
              />
            </Link>
            
            <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
              Your destination for beautiful, handcrafted bangles. We bring the famous glass art of Firozabad straight to your home.
            </p>

            <div className="flex space-x-5">
              <a href="https://instagram.com/_sbcreation" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#db2777] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com/sbcreation" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#db2777] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com/sbcreation" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#db2777] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* 🔗 Shop Links */}
          <div className="md:col-span-2">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-800 mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Glass Sets</Link></li>
              <li><Link href="/shop" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Metal Kangan</Link></li>
              <li><Link href="/shop" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Bridal Wear</Link></li>
              <li><Link href="/shop" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Daily Use</Link></li>
            </ul>
          </div>

          {/* 📞 Help & Support */}
          <div className="md:col-span-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-800 mb-6">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/track-order" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Track Order</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Easy Returns</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-[#db2777] transition-all">Contact Us</Link></li>
            </ul>
          </div>

          {/* 📍 Contact Details */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-gray-800 mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#db2777] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  Orchid Green, Raja ka taal, <br />
                  Firozabad, UP (283203)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#db2777] shrink-0" />
                <a href="mailto:contact@sbcreationofficial.com" className="text-sm text-gray-600 hover:text-[#db2777]">
                  contact@sbcreationofficial.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#db2777] shrink-0" />
                <a href="tel:+919557111954" className="text-sm text-gray-600 hover:text-[#db2777]">
                  +91 95571 11954
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* 📜 Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SB Creation. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#db2777]">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-[#db2777]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;