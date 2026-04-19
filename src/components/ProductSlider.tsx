'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

const ProductSlider = ({ products }: { products: any[] }) => {
  const addItem = useCartStore((state) => state.addItem)
  const infiniteProducts = [...products, ...products]

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // 🛑 Prevents navigating to the product page
    e.stopPropagation(); // 🛑 Stops the click from bubbling up to the card link
    addItem(product)
    toast.success(`${product.name} added`, {
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '50px' }
    })
  }

  return (
    <section className="bg-[#fffdfa] py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center">
        <span className="text-[#db2777] text-[10px] font-bold tracking-[0.5em] uppercase mb-3 block">
          The Eternal Collection
        </span>
        <h2 className="text-5xl font-serif text-[#0F2C3E]">
          Signature <span className="italic font-light text-[#D4AF37]">Artifacts</span>
        </h2>
      </div>

      <div className="relative flex group/marquee">
        <div className="flex animate-marquee group-hover/marquee:pause-marquee gap-10 py-10">
          {infiniteProducts.map((product, index) => {
            const primaryImage = product.gallery?.[0] || product.image_url || '/placeholder.jpg'
            const secondaryImage = product.gallery?.[1] || product.image_url || primaryImage

            return (
              <div key={`${product.id}-${index}`} className="min-w-[320px] md:min-w-[400px]">
                
                {/* 🏺 WRAPPER LINK: Makes the whole card clickable */}
                <Link href={`/product/${product.slug}`} className="block group">
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-sm border border-gray-100">
                    
                    {/* Image Swap Logic */}
                    <Image src={primaryImage} alt={product.name} fill className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-0" />
                    <Image src={secondaryImage} alt="Detail" fill className="object-cover opacity-0 scale-125 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" />

                    {/* 🔘 PERMANENT ACTION BUTTONS */}
                    <div className="absolute inset-x-0 bottom-8 flex justify-center gap-3 z-30">
                       <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-4 bg-[#0F2C3E] text-white rounded-full shadow-2xl hover:bg-[#db2777] transition-all transform active:scale-95 z-40"
                       >
                         <ShoppingBag size={20} strokeWidth={2.5} />
                       </button>
                       
                       {/* This specific Eye button is redundant since the card is clickable, 
                           but we keep it for visual balance. We use a div instead of a link here
                           to avoid nested link errors. */}
                       <div className="p-4 bg-white/90 backdrop-blur-md text-[#0F2C3E] rounded-full shadow-2xl border border-white/20 hover:text-[#db2777] transition-all transform active:scale-95">
                         <Eye size={20} strokeWidth={2.5} />
                       </div>

                       <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="p-4 bg-white/90 backdrop-blur-md text-[#0F2C3E] rounded-full shadow-2xl border border-white/20 hover:text-[#db2777] transition-all transform active:scale-95"
                       >
                         <Heart size={20} strokeWidth={2.5} />
                       </button>
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="mt-8 text-center">
                    <h4 className="font-serif text-xl text-[#0F2C3E] mb-1 group-hover:text-[#db2777] transition-colors uppercase tracking-tight">
                      {product.name}
                    </h4>
                    <p className="text-[#db2777] font-bold tracking-widest text-sm">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 50s linear infinite;
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
  )
}

export default ProductSlider