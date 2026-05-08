'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Eye, X, Check } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const ProductSlider = ({ products }: { products: any[] }) => {
  const addItem = useCartStore((state) => state.addItem)
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')
  
  const infiniteProducts = [...products, ...products]

  // --- 🔄 Sync Wishlist on Load ---
  useEffect(() => {
    const fetchWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', user.id)
        if (data) setWishlistIds(data.map(item => item.product_id))
      }
    }
    fetchWishlist()
  }, [])

  // --- ❤️ Wishlist Toggle Logic ---
  const handleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please login to save favorites')
      return
    }

    if (wishlistIds.includes(productId)) {
      const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
      if (!error) {
        setWishlistIds(prev => prev.filter(id => id !== productId))
        toast.success('Removed from favorites')
      }
    } else {
      const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
      if (!error) {
        setWishlistIds(prev => [...prev, productId])
        toast.success('Saved to favorites ❤️')
      }
    }
  }

  // --- 🛒 Add to Cart with Size Flow ---
  const handleAddToCartInitiate = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setSelectedProduct(product)
    // Default to the first available size or standard 2.4
    setTempSize(product.sizes?.[0] || '2.4')
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        style: { background: '#2d2416', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  return (
    <section className="bg-[#F5E9DC] py-8 overflow-hidden">
      <div className="container mx-auto px-0 mb-10 text-center">
        <span className="text-[10px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-3 block text-[#0F5A7E]">
          The Eternal Collection
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2d2416] mb-2">
          Bangles For Every<span className="italic font-light text-[#D4AF37]"> Mood</span>
        </h2>
      </div>

      <div className="relative flex group/marquee">
        <div className="flex animate-marquee group-hover/marquee:pause-marquee gap-4 md:gap-10 py-5">
          {infiniteProducts.map((product, index) => {
            const primaryImage = product.gallery?.[0] || product.image_url || '/placeholder.jpg'
            const secondaryImage = product.gallery?.[1] || product.image_url || primaryImage
            const isLiked = wishlistIds.includes(product.id)

            return (
              <div key={`${product.id}-${index}`} className="min-w-[240px] md:min-w-[320px] lg:min-w-[400px]">
                
                <Link href={`/product/${product.slug}`} className="block group">
                  <div className="relative aspect-[4/5] rounded-lg md:rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-[#D4AF37] hover:shadow-2xl hover:border-[#0F5A7E] transition-all duration-300">
                    
                    <Image src={primaryImage} alt={product.name} fill className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-0" />
                    <Image src={secondaryImage} alt="Detail" fill className="object-cover opacity-0 scale-125 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2d2416]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-x-0 bottom-4 md:bottom-8 flex justify-center gap-2 md:gap-3 z-30">
                        <button 
                         onClick={(e) => handleAddToCartInitiate(e, product)}
                         className="p-2 md:p-4 bg-[#2d2416] text-white rounded-full shadow-lg hover:bg-[#0F5A7E] transition-all transform active:scale-95 hover:shadow-xl hover:scale-110"
                        >
                          <ShoppingBag size={16} strokeWidth={2.5} className="md:w-5 md:h-5" />
                        </button>
                        
                        <div className="p-2 md:p-4 bg-[#FFFFF0]/95 backdrop-blur-sm text-[#2d2416] rounded-full shadow-lg border-2 border-[#D4AF37] hover:border-[#0F5A7E] hover:text-[#0F5A7E] transition-all transform active:scale-95 cursor-pointer hover:shadow-xl hover:scale-110">
                          <Eye size={16} strokeWidth={2.5} className="md:w-5 md:h-5" />
                        </div>

                        <button 
                         onClick={(e) => handleWishlist(e, product.id)}
                         className="p-2 md:p-4 bg-[#FFFFF0]/95 backdrop-blur-sm rounded-full shadow-lg border-2 border-[#F8C8DC] hover:border-[#D4AF37] transition-all transform active:scale-95 hover:shadow-xl hover:scale-110"
                        >
                          <Heart size={16} strokeWidth={2.5} className={`md:w-5 md:h-5 ${isLiked ? "fill-[#F8C8DC] text-[#F8C8DC]" : "text-[#2d2416]"}`} />
                        </button>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-6 text-center">
                    <h4 className="font-serif text-sm md:text-lg text-[#2d2416] group-hover:text-[#0F5A7E] transition-colors uppercase tracking-tight">
                      {product.name}
                    </h4>
                    <p className="text-[#D4AF37] font-bold tracking-widest text-xs md:text-sm mt-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- 📏 Size Selection Popup --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#2d2416]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-[#FFFFF0] to-[#F5E9DC] w-full max-w-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-[#D4AF37]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 md:top-6 right-4 md:right-6 text-[#2d2416] opacity-60 hover:text-[#0F5A7E] transition-colors"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>

              <div className="text-center space-y-3 md:space-y-4">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] block text-[#0F5A7E]">Select Size</span>
                <h3 className="text-lg md:text-2xl font-serif text-[#2d2416]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-2 md:gap-3 py-4 md:py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#2d2416] text-white border-[#2d2416]' 
                        : 'border-[#D4AF37] text-[#2d2416] hover:bg-[#F8C8DC]/40 hover:border-[#0F5A7E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#2d2416] text-white py-3 md:py-4 rounded-full font-bold uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#0F5A7E] transition-all shadow-lg hover:shadow-xl"
                >
                  <Check size={12} className="md:w-3.5 md:h-3.5" /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default ProductSlider;