"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCartStore } from '../lib/cartStore';
import toast from 'react-hot-toast';

const ProductSlider = ({ products }: { products: any[] }) => {
  const addItem = useCartStore((state) => state.addItem);

  // We clone the products array to ensure there's no "gap" in the infinite loop
  const infiniteProducts = [...products, ...products];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to bag!`, {
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '12px' }
    });
  };

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <span className="text-[#db2777] text-[10px] font-bold tracking-[0.4em] uppercase mb-3 block">
          Infinite Collection
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-[#0F2C3E] uppercase tracking-tighter">
          Our <span className="italic font-light text-[#D4AF37] lowercase">Signature</span> Series
        </h2>
      </div>

      {/* ♾️ Infinite Marquee Container */}
      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee hover:pause-marquee gap-8 py-4">
          {infiniteProducts.map((product, index) => (
            <motion.div 
              key={`${product.id}-${index}`}
              className="min-w-[300px] md:min-w-[380px] group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[#FAF9F6] mb-6 shadow-sm border border-gray-50">
                {/* 📸 Image 1 (Default) */}
                <Image 
                  src={product.images?.[0] || product.image_url || '/placeholder.jpg'} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                />

                {/* 📸 Image 2 (Hover) */}
                <Image 
                  src={product.images?.[1] || product.images?.[0] || product.image_url} 
                  alt={`${product.name} detail`} 
                  fill 
                  className="object-cover opacity-0 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-110"
                />

                {/* 🔘 Interactive Buttons */}
                <div className="absolute inset-0 flex items-end justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/5 backdrop-blur-[2px] pb-20">
                   <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-4 bg-white rounded-full shadow-xl hover:bg-[#db2777] hover:text-white transition-all transform hover:scale-110"
                   >
                     <ShoppingBag size={20} />
                   </button>
                   <button className="p-4 bg-white rounded-full shadow-xl hover:bg-pink-50 transition-all transform hover:scale-110">
                     <Heart size={20} className="text-[#db2777]" />
                   </button>
                   <Link href={`/product/${product.slug}`} className="p-4 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-all transform hover:scale-110">
                     <Eye size={20} className="text-[#0F2C3E]" />
                   </Link>
                </div>
              </div>

              <div className="text-center">
                <h4 className="font-serif text-lg text-[#0F2C3E] mb-1 uppercase tracking-widest">{product.name}</h4>
                <p className="text-[#D4AF37] font-bold tracking-widest text-sm">₹{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS for Infinite Loop & No Scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .pause-marquee {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;