"use client";
import React, { useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PublicInstaFeed = () => {
  useEffect(() => {
    // Load the main SociableKIT widget loader
    const script = document.createElement("script");
    script.src = "https://widgets.sociablekit.com/instagram-feed/widget.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="bg-grey py-14 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        
        {/* 🎨 SB Creation Custom Title */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] uppercase tracking-tighter mb-4">
              Social <span className="italic font-light text-[#D4AF37]">Vibe</span>
            </h2>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#D4AF37]">
              Live from our Atelier
            </p>
          </div>
          <div className="h-[1px] flex-grow bg-gray-100 mx-8 hidden md:block" />
          <Instagram size={32} className="text-[#db2777] opacity-20" />
        </div>

        {/* ⚙️ SociableKIT Widget Container */}
        <div 
          className="sk-instagram-feed" 
          data-embed-id="25673738"
        ></div>

        {/* 🔘 Custom Follow CTA */}
        <div className="mt-1 flex justify-center">
           
        </div>
      </div>

      {/* 💅 Custom Brand CSS */}
      <style jsx global>{`
        /* Hide unnecessary widget UI for a cleaner look */
        .sk_instagram_feed_header, 
        .sk-ww-instagram-profile-follow-btn-container,
        .sk_instagram_feed_info {
          display: none !important;
        }

        /* Luxury styling for items */
        .sk_instagram_feed_item {
          border-radius: 2rem !important;
          overflow: hidden !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }

        .sk_instagram_feed_item:hover {
          transform: translateY(-8px) scale(1.02) !important;
          z-index: 10;
        }

        .sk-instagram-feed {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default PublicInstaFeed;