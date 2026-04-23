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
    <section className="bg-pink-50 py-10 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        
        {/* 🎨 SB Creation Custom Title */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a2e] uppercase tracking-tighter mb-4">
              Social <span className="italic font-light text-[#ffc857]">Vibe</span>
            </h2>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e8378e]">
              Live from our Workshop
            </p>
          </div>
          <div className="h-[1px] flex-grow bg-gray-200 mx-8 hidden md:block" />
          <Instagram size={32} className="text-[#e8378e] opacity-30" />
        </div>

        {/* ⚙️ SociableKIT Widget Container */}
        <div 
          className="sk-instagram-feed" 
          data-embed-id="25673738"
        ></div>

        {/* 🔘 Custom Follow CTA */}
        <div className="mt-4 flex justify-center">
           
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
          border-radius: 1.5rem !important;
          overflow: hidden !important;
          border: 1px solid #f3e8ff !important;
          box-shadow: 0 4px 12px rgba(232, 55, 142, 0.08) !important;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease !important;
          background: white !important;
        }

        .sk_instagram_feed_item:hover {
          transform: translateY(-6px) scale(1.02) !important;
          box-shadow: 0 12px 24px rgba(232, 55, 142, 0.15) !important;
          z-index: 10;
        }

        .sk-instagram-feed {
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Optional: Style the images within items */
        .sk_instagram_feed_item img {
          transition: filter 0.4s ease !important;
        }

        .sk_instagram_feed_item:hover img {
          filter: brightness(1.05) !important;
        }
      `}</style>
    </section>
  );
};

export default PublicInstaFeed;