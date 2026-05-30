'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, X, Check, Eye } from 'lucide-react'
import { Product, supabase } from '../lib/supabase'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Size Popup States
  const [showSizePopup, setShowSizePopup] = useState(false)
  const [tempSize, setTempSize] = useState<string>('')

  // Check if item is already in wishlist on load
  useEffect(() => {
    const checkWishlist = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single()

        if (data) setIsWishlisted(true)
      }
    }

    checkWishlist()
  }, [product.id])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Please login to save favorites')
      return
    }

    if (isWishlisted) {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id)

      if (!error) {
        setIsWishlisted(false)
        toast.success('Removed from favorites')
      }
    } else {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product.id })

      if (!error) {
        setIsWishlisted(true)
        toast.success('Saved to favorites ❤️')
      }
    }
  }

  const handleAddToCartInitiate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTempSize((product as any).sizes?.[0] || '2.4')
    setShowSizePopup(true)
  }

  const confirmAddToCart = () => {
    addItem({ ...product, selectedSize: tempSize } as any)

    toast.success(`${product.name} (${tempSize}) added!`, {
      icon: '💍',
      style: {
        background: '#2d2416',
        color: '#fff',
        borderRadius: '50px'
      }
    })

    setShowSizePopup(false)
  }

  const originalPrice = (product as any).original_price || Math.round(product.price * 1.3)
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)

  return (
    <>
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="h-full">
        <Link href={`/product/${product.slug}`} className="block h-full">
          <div className="group relative h-full bg-white rounded-[14px] overflow-hidden">
            <div className="relative overflow-hidden rounded-[14px] bg-[#f4f4f4] aspect-[1.5]">
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-20 bg-[#e4572e] text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-md">
                -{discount}%
              </div>

              {/* Product Image */}
              <Image
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Action Buttons */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <button
                  onClick={handleAddToCartInitiate}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                >
                  <ShoppingCart size={16} className="text-[#5a4634]" />
                </button>

                <button
                  onClick={toggleWishlist}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                >
                  <Heart
                    size={16}
                    className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5a4634]'}`}
                  />
                </button>

                <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                  <Eye size={16} className="text-[#5a4634]" />
                </div>
              </div>

              {/* Stock Overlay */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                  <span className="text-white text-lg font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* ─── Product Details: tighter padding ─── */}
            <div className="pt-2 px-1 pb-1">
              <h3 className="text-[15px] leading-[1.3] font-medium text-[#2b2b2b] line-clamp-2">
                {product.name}
              </h3>

              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-[15px] font-bold text-[#d14b3f]">
                  Rs. {product.price.toFixed(2)}
                </span>

                <span className="text-[13px] text-gray-500 line-through">
                  Rs. {originalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* --- Size Selection Popup --- */}
      <AnimatePresence>
        {showSizePopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizePopup(false)}
              className="absolute inset-0 bg-[#2d2416]/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#FFFFF0] w-full max-w-sm rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl border-2 border-[#D4AF37]"
            >
              <button
                onClick={() => setShowSizePopup(false)}
                className="absolute top-4 md:top-6 right-4 md:right-6 text-[#2d2416] opacity-50 hover:text-[#0F5A7E] transition-colors bg-[#F5E9DC] p-1.5 md:p-2 rounded-full"
              >
                <X size={16} className="md:w-5 md:h-5" />
              </button>

              <div className="text-center space-y-3 md:space-y-4">
                <span className="text-[#0F5A7E] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] block">
                  Select Bangle Size
                </span>

                <h3 className="text-lg md:text-2xl font-bold text-[#2d2416]">
                  {product.name}
                </h3>

                <div className="flex justify-center gap-2 md:gap-3 py-4 md:py-6 flex-wrap">
                  {((product as any).sizes?.length > 0
                    ? (product as any).sizes
                    : ['2.2', '2.4', '2.6', '2.8']
                  ).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size
                          ? 'bg-[#2d2416] text-white border-[#2d2416] shadow-lg'
                          : 'border-[#D4AF37] text-[#2d2416] hover:bg-[#F8C8DC]/30 hover:border-[#0F5A7E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  onClick={confirmAddToCart}
                  className="w-full bg-[#2d2416] text-white py-3 md:py-4 rounded-full font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#0F5A7E] transition-all shadow-xl hover:shadow-2xl"
                >
                  <Check size={12} className="md:w-3.5 md:h-3.5" /> Confirm & Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}