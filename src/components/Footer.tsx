"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2B1D17] text-[#F5E9DC] border-t border-[#D4AF37]/30">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* 🏛️ Brand Info & Logo */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity w-fit">
              <div className="relative h-20 w-20 shrink-0 bg-[#FFFFFF] rounded-full p-1 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="SB Creation Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </Link>

            <p className="text-sm md:text-base leading-relaxed text-[#F5E9DC]/85 max-w-xs font-sans">
              Handcrafted bangles and jewelry pieces from the heart of Firozabad.
              Bringing traditional glass art to the modern world, one piece at a time.
            </p>

            <div className="flex space-x-0">
              <a
                href="https://instagram.com/_sbcreation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8C8DC] hover:text-[#D4AF37] transition-all p-2 rounded-full hover:bg-[#FFFFFF]/5"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.facebook.com/share/17fTCz8vQ8/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F8C8DC] hover:text-[#D4AF37] transition-all p-2 rounded-full hover:bg-[#FFFFFF]/5"
              >
                <Facebook size={20} />
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm md:text-base text-[#D4AF37] font-medium font-sans">
              <Heart size={16} className="text-[#F8C8DC]" fill="#F8C8DC" />
              <span>Handcrafted with love</span>
            </div>
          </div>

          {/* 🔗 Explore */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-8 font-sans">
              Explore
            </h3>

            <ul className="space-y-4">
              {[
                ["Collections", "/shop"],
                ["Wishlist", "/wishlist"],
                ["Blogs", "/blog"],
                ["About Us", "/about"],
                ["Sign In", "/dashboard"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm md:text-base text-[#F5E9DC]/85 hover:text-[#F8C8DC] transition-all font-sans hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 Support */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-8 font-sans">
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
                    className="text-sm md:text-base text-[#F5E9DC]/85 hover:text-[#F8C8DC] transition-all font-sans hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📍 Contact */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-widest text-[#D4AF37] font-sans">
              Get in Touch
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin
                  size={18}
                  className="text-[#F8C8DC] shrink-0 mt-0.5 group-hover:text-[#D4AF37] transition-colors"
                />

                <span className="text-sm md:text-base text-[#F5E9DC]/85 group-hover:text-[#FFFFFF] transition-colors font-sans">
                  Orchid Green, Raja ka taal, <br />
                  Firozabad, UP 283203
                </span>
              </li>

              <li className="flex items-center gap-3 group">
                <Mail
                  size={18}
                  className="text-[#F8C8DC] shrink-0 group-hover:text-[#D4AF37] transition-colors"
                />

                <a
                  href="mailto:contact@sbcreationofficial.com"
                  className="text-sm md:text-base text-[#F5E9DC]/85 hover:text-[#FFFFFF] font-sans transition-colors"
                >
                  contact@sbcreation
                  <br />
                  official.com
                </a>
              </li>

              <li className="flex items-center gap-3 group">
                <Phone
                  size={18}
                  className="text-[#F8C8DC] shrink-0 group-hover:text-[#D4AF37] transition-colors"
                />

                <a
                  href="tel:+919557111954"
                  className="text-sm md:text-base text-[#F5E9DC]/85 hover:text-[#FFFFFF] font-sans transition-colors"
                >
                  +91 9557 1119 54
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-16 pt-12 border-t border-[#D4AF37]/20">

          {/* International Delivery */}
          <div className="mb-8 pb-8 border-b border-[#D4AF37]/10">
            <p className="text-sm md:text-base text-[#F5E9DC]/85 leading-relaxed font-sans text-center">
              For international deliveries,{" "}
              <a
                href="https://wa.me/919557111954?text=Hi%20SB%20Creation!%20I%20have%20an%20international%20order%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#F8C8DC] font-semibold transition-all inline-flex items-center gap-1"
              >
                connect on WhatsApp <span className="text-xs">↗</span>
              </a>{" "}
              for shipping details and custom orders.
            </p>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs md:text-sm text-[#F5E9DC]/60 font-sans">
              © {new Date().getFullYear()} SB Creation. All rights reserved. |
              Handcrafted in Firozabad 💍
            </p>

            <div className="flex gap-8">
              <Link
                href="/privacy-policy"
                className="text-xs md:text-sm text-[#F5E9DC]/80 hover:text-[#D4AF37] font-sans transition-all"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-xs md:text-sm text-[#F5E9DC]/80 hover:text-[#D4AF37] font-sans transition-all"
              >
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