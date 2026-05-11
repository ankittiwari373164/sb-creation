'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { Product } from '../lib/supabase'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false)

  const originalPrice = product.price + 350
  const discount = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  )

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group w-full cursor-pointer">
        
        {/* IMAGE CARD */}
        <div className="relative overflow-hidden rounded-[20px] bg-[#f8f4ef]">

          {/* Discount Badge */}
          <div className="absolute top-4 left-4 z-20 bg-[#f05a28] text-white text-[14px] font-semibold px-4 py-1 rounded-full shadow-md">
            -{discount}%
          </div>

          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Hover Icons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">

              <button
                onClick={(e) => {
                  e.preventDefault()
                  setLiked(!liked)
                }}
                className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition"
              >
                <Heart
                  size={18}
                  className={
                    liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-700'
                  }
                />
              </button>

              <button className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition">
                <ShoppingCart size={18} className="text-gray-700" />
              </button>

              <button className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition">
                <Eye size={18} className="text-gray-700" />
              </button>

            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-3 px-1">

          {/* Product Name */}
          <h3 className="text-[17px] md:text-[18px] leading-[28px] font-medium text-[#2b2b2b] line-clamp-2 hover:text-[#f05a28] transition-colors">
            {product.name}
          </h3>

          {/* PRICE SECTION */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">

            {/* Sale Price */}
            <span className="text-[#e44b2f] font-semibold text-[18px] md:text-[20px] leading-none">
              Rs. {product.price}.00
            </span>

            {/* Original Price */}
            <span className="text-gray-400 line-through text-[15px] md:text-[16px]">
              Rs. {originalPrice}.00
            </span>

          </div>
        </div>
      </div>
    </Link>
  )
}