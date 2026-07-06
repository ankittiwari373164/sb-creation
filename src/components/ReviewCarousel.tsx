"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

// Real customer screenshots — WhatsApp thank-yous & Instagram story reposts.
const reviewImages = Array.from({ length: 19 }, (_, i) => ({
  src: `/reviews/review-${String(i + 1).padStart(2, '0')}.png`,
  alt: `SB Creation customer review screenshot ${i + 1}`,
}));

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F2C3E]/90 backdrop-blur-sm p-4 md:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
      >
        <X size={18} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        className="relative w-full max-w-sm max-h-[85vh] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={reviewImages[index].src}
          alt={reviewImages[index].alt}
          fill
          className="object-contain bg-[#0F2C3E]"
        />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
      >
        <ChevronRight size={20} />
      </button>

      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-[11px] tracking-widest uppercase">
        {index + 1} / {reviewImages.length}
      </span>
    </div>
  );
}

const ReviewCarousel = () => {
  const [active, setActive] = useState<number | null>(null);

  const showPrev = () =>
    setActive((prev) => (prev === null ? 0 : (prev - 1 + reviewImages.length) % reviewImages.length));
  const showNext = () =>
    setActive((prev) => (prev === null ? 0 : (prev + 1) % reviewImages.length));

  // Duplicate the set so the marquee loops seamlessly.
  const track = [...reviewImages, ...reviewImages];

  return (
    <section className="relative bg-[#0F2C3E] py-10 md:py-16 overflow-hidden">
      {/* faint texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/bg-floral.png')",
          backgroundSize: '420px',
        }}
      />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <span className="flex items-center justify-center gap-2 text-[#D4AF37] text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase mb-2">
            <Quote size={12} /> Straight From Their Chats
          </span>
          <h2 className="text-2xl md:text-4xl font-serif text-white tracking-tight">
            Real Customers, <span className="italic font-light text-[#D4AF37]">Real Love</span>
          </h2>
          <p className="text-white/60 text-xs md:text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            No stock photos here — just screenshots from the WhatsApp and Instagram
            messages our customers send us after unboxing.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            <span className="text-white/70 text-[10px] md:text-[11px] uppercase tracking-[0.2em]">
              Verified buyer messages, unedited
            </span>
          </div>
        </div>
      </div>

      {/* Marquee row 1 */}
      <div className="relative group/marquee">
        <div className="flex gap-4 md:gap-5 w-max animate-[scroll-left_55s_linear_infinite] group-hover/marquee:[animation-play-state:paused] px-4 md:px-6">
          {track.map((img, i) => (
            <button
              key={`row1-${i}`}
              onClick={() => setActive(i % reviewImages.length)}
              className="relative flex-shrink-0 h-56 md:h-72 rounded-xl overflow-hidden border-2 border-white/10 shadow-xl hover:border-[#D4AF37]/60 hover:-translate-y-1 transition-all duration-300 bg-white"
              style={{ aspectRatio: '3/4' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="220px"
              />
            </button>
          ))}
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-24 bg-gradient-to-r from-[#0F2C3E] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-24 bg-gradient-to-l from-[#0F2C3E] to-transparent z-10" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-center text-white/40 text-[10px] md:text-[11px] mt-7 md:mt-9 tracking-widest uppercase">
          Tap any screenshot to view full size
        </p>
      </div>

      {active !== null && (
        <Lightbox
          index={active}
          onClose={() => setActive(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      <style jsx global>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default ReviewCarousel;