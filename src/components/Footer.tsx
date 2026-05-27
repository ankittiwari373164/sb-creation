"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#FFF0F5] text-[#2B1D17] border-t border-[#F8C8DC]/60">

      {/* 🌍 International Delivery Banner */}
      <div className="bg-[#2B1D17] py-4 px-6">
        <p className="text-sm md:text-base text-[#F5E9DC]/90 leading-relaxed font-sans text-center font-medium">
          For international deliveries,{" "}
          <a
            href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20have%20an%20international%20order%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:text-[#F8C8DC] font-bold transition-all inline-flex items-center gap-1"
          >
            connect on WhatsApp <span className="text-xs">↗</span>
          </a>{" "}
          for shipping details and custom orders.
        </p>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* 🏛️ Brand Info & Logo */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity w-fit">
              <div className="relative h-20 w-20 shrink-0 bg-white rounded-full p-1 shadow-lg border border-[#F8C8DC]/40">
                <Image
                  src="/logo.png"
                  alt="SB Creation Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </Link>

            <p className="text-sm md:text-base leading-relaxed text-[#C2185B] font-extrabold max-w-xs font-sans">
              Handcrafted bangles and jewelry pieces from the heart of Firozabad.
              Bringing traditional glass art to the modern world, one piece at a time.
            </p>

            {/* Social Icons - no gap, tightly packed */}
            <div className="flex items-center">
              <a
                href="https://instagram.com/_sbcreation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C2185B] hover:text-[#0F5A7E] transition-all p-1.5 rounded-full hover:bg-[#F8C8DC]/40"
              >
                <Instagram size={22} strokeWidth={2.5} />
              </a>
              <a
                href="https://www.facebook.com/share/17fTCz8vQ8/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C2185B] hover:text-[#0F5A7E] transition-all p-1.5 rounded-full hover:bg-[#F8C8DC]/40"
              >
                <Facebook size={22} strokeWidth={2.5} />
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm md:text-base text-[#C2185B] font-extrabold font-sans">
              <Heart size={16} className="text-[#C2185B]" fill="#C2185B" />
              <span>Handcrafted with love</span>
            </div>
          </div>

          {/* 🔗 Explore */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] md:text-sm font-extrabold uppercase tracking-widest text-[#0F5A7E] mb-8 font-sans">
              Explore
            </h3>
            <ul className="space-y-4">
              {[
                ["Collections", "/shop"],
                ["Wishlist", "/wishlist"],
                ["Blogs", "https://instagram.com/_sbcreation"],
                ["About Us", "/about"],
                ["Sign In", "/login"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm md:text-base text-[#C2185B] font-extrabold hover:text-[#0F5A7E] transition-all font-sans hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Support */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] md:text-sm font-extrabold uppercase tracking-widest text-[#0F5A7E] mb-8 font-sans">
              Support
            </h3>
            <ul className="space-y-4">
              {[
                ["Track Order", "https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20want%20to%20track%20my%20order"],
                ["Custom Orders", "https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20want%20to%20customize%20my%20order"],
                ["Bulk Enquiries", "https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20have%20a%20bulk%20inquiry"],
                ["Contact Us", "/contact"],
                ["Returns & Exchanges", "/returns"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-sm md:text-base text-[#C2185B] font-extrabold hover:text-[#0F5A7E] transition-all font-sans hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Contact */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-[11px] md:text-sm font-extrabold uppercase tracking-widest text-[#0F5A7E] font-sans">
              Get in Touch
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-[#C2185B] shrink-0 mt-0.5 group-hover:text-[#0F5A7E] transition-colors" strokeWidth={2.5} />
                <span className="text-sm md:text-base text-[#C2185B] font-extrabold group-hover:text-[#0F5A7E] transition-colors font-sans">
                  Orchid Green, Raja ka taal, <br />
                  Firozabad, UP 283203
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail size={18} className="text-[#C2185B] shrink-0 group-hover:text-[#0F5A7E] transition-colors" strokeWidth={2.5} />
                <a
                  href="mailto:contact@sbcreationofficial.com"
                  className="text-sm md:text-base text-[#C2185B] font-extrabold hover:text-[#0F5A7E] font-sans transition-colors"
                >
                  contact@sbcreation<br />official.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone size={18} className="text-[#C2185B] shrink-0 group-hover:text-[#0F5A7E] transition-colors" strokeWidth={2.5} />
                <a
                  href="tel:+919557111954"
                  className="text-sm md:text-base text-[#C2185B] font-extrabold hover:text-[#0F5A7E] font-sans transition-colors"
                >
                  +91 9557 1119 54
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Bottom */}
        <div className="mt-16 pt-12 border-t border-[#F8C8DC]/60">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs md:text-sm text-[#C2185B] font-extrabold font-sans">
              © {new Date().getFullYear()} SB Creation. All rights reserved. |
              Handcrafted in Firozabad 💍
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-policy" className="text-xs md:text-sm text-[#C2185B] font-extrabold hover:text-[#0F5A7E] font-sans transition-all">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs md:text-sm text-[#C2185B] font-extrabold hover:text-[#0F5A7E] font-sans transition-all">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;