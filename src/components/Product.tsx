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
          <div className="absolute top-3 left-3 z-20 bg-[#f05a28] text-white text-[12px] font-semibold px-3 py-[3px] rounded-full shadow-md">
            -{discount}%
          </div>

          {/* Product Image — aspect-[4/5] instead of aspect-square to save vertical space */}
          <div className="relative aspect-[5/5] overflow-hidden">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />

            {/* Hover Icons */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">

              <button
                onClick={(e) => {
                  e.preventDefault()
                  setLiked(!liked)
                }}
                className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition"
              >
                <Heart
                  size={15}
                  className={
                    liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-700'
                  }
                />
              </button>

              <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition">
                <ShoppingCart size={15} className="text-gray-700" />
              </button>

              <button className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition">
                <Eye size={15} className="text-gray-700" />
              </button>

            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="pt-2 px-1">

          {/* Product Name — line-clamp-1 to save space */}
          <h3 className="text-[14px] md:text-[15px] leading-[22px] font-medium text-[#2b2b2b] line-clamp-1 hover:text-[#f05a28] transition-colors">
            {product.name}
          </h3>

          {/* PRICE SECTION */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">

            {/* Sale Price */}
            <span className="text-[#e44b2f] font-semibold text-[15px] md:text-[16px] leading-none">
              Rs. {product.price}.00
            </span>

            {/* Original Price */}
            <span className="text-gray-400 line-through text-[13px]">
              Rs. {originalPrice}.00
            </span>

          </div>
        </div>

      </div>
    </Link>
  )
}