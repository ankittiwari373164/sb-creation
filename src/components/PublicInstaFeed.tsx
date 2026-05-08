"use client";
import React, { useEffect } from 'react';
import { Instagram } from 'lucide-react';
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
    <section className="bg-white py-8 md:py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[#0F5A7E] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-2 md:mb-3">
            Follow Us
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#2d2416] mb-2 md:mb-4">
            The <span className="italic text-[#D4AF37]">SB Edit</span>
          </h2>
          <p className="text-[#2d2416] text-xs md:text-sm opacity-70">
            Curated moments from our Instagram feed
          </p>
        </div>

        {/* Widget Container */}
        <div 
          className="sk-instagram-feed" 
          data-embed-id="25679703"
        ></div>

        {/* CTA Button */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link 
            href="https://instagram.com/_sbcreation" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-[#2d2416] text-white rounded-full font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] shadow-lg hover:bg-[#0F5A7E] transition-all"
          >
            <Instagram size={12} className="md:w-3.5 md:h-3.5" />
            Follow on Instagram
          </Link>
        </div>
      </div>

      {/* Styling */}
      <style jsx global>{`
        /* Hide widget header */
        .sk_instagram_feed_header, 
        .sk-ww-instagram-profile-follow-btn-container,
        .sk_instagram_feed_info {
          display: none !important;
        }

        /* Feed items */
        .sk_instagram_feed_item {
          border-radius: 1.25rem !important;
          overflow: hidden !important;
          border: 1px solid #f0f0f0 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.3s ease !important;
        }

        .sk_instagram_feed_item:hover {
          box-shadow: 0 8px 24px rgba(15, 90, 126, 0.12) !important;
          transform: translateY(-4px) !important;
        }

        .sk-instagram-feed {
          padding: 0 !important;
          margin: 0 !important;
        }

        .sk_instagram_feed_item img {
          transition: transform 0.3s ease !important;
        }

        .sk_instagram_feed_item:hover img {
          transform: scale(1.05) !important;
        }
      `}</style>
    </section>
  );
};

export default PublicInstaFeed;