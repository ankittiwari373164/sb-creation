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
        style: { background: '#1a1a2e', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  return (
    <section className="bg-white py-8 overflow-hidden">
      <div className="container mx-auto px-0 mb-10 text-center">
        <span className="text-[#e8378e] text-[10px] font-bold tracking-[0.5em] uppercase mb-3 block">
          The Eternal Collection
        </span>
        <h2 className="text-5xl font-serif text-[#1a1a2e] mb-2">
          Signature <span className="italic font-light text-[#ffc857]">Artifacts</span>
        </h2>
      </div>

      <div className="relative flex group/marquee">
        <div className="flex animate-marquee group-hover/marquee:pause-marquee gap-10 py-5">
          {infiniteProducts.map((product, index) => {
            const primaryImage = product.gallery?.[0] || product.image_url || '/placeholder.jpg'
            const secondaryImage = product.gallery?.[1] || product.image_url || primaryImage
            const isLiked = wishlistIds.includes(product.id)

            return (
              <div key={`${product.id}-${index}`} className="min-w-[320px] md:min-w-[400px]">
                
                <Link href={`/product/${product.slug}`} className="block group">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    
                    <Image src={primaryImage} alt={product.name} fill className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-0" />
                    <Image src={secondaryImage} alt="Detail" fill className="object-cover opacity-0 scale-125 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" />

                    <div className="absolute inset-x-0 bottom-8 flex justify-center gap-3 z-30">
                        <button 
                         onClick={(e) => handleAddToCartInitiate(e, product)}
                         className="p-4 bg-[#1a1a2e] text-white rounded-full shadow-lg hover:bg-[#e8378e] transition-all transform active:scale-95"
                        >
                          <ShoppingBag size={20} strokeWidth={2.5} />
                        </button>
                        
                        <div className="p-4 bg-white/90 backdrop-blur-sm text-[#1a1a2e] rounded-full shadow-lg border border-gray-100 hover:text-[#e8378e] transition-all transform active:scale-95 cursor-pointer">
                          <Eye size={20} strokeWidth={2.5} />
                        </div>

                        <button 
                         onClick={(e) => handleWishlist(e, product.id)}
                         className="p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 transition-all transform active:scale-95"
                        >
                          <Heart size={20} strokeWidth={2.5} className={isLiked ? "fill-[#e8378e] text-[#e8378e]" : "text-[#1a1a2e]"} />
                        </button>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <h4 className="font-serif text-lg text-[#1a1a2e] group-hover:text-[#e8378e] transition-colors uppercase tracking-tight">
                      {product.name}
                    </h4>
                    <p className="text-[#e8378e] font-bold tracking-widest text-sm mt-1">
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#e8378e]"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <span className="text-[#e8378e] text-[10px] font-bold uppercase tracking-[0.4em] block">Select Size</span>
                <h3 className="text-2xl font-serif text-[#1a1a2e]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-3 py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
                        : 'border-gray-200 text-[#1a1a2e] hover:border-[#e8378e]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#1a1a2e] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#e8378e] transition-all"
                >
                  <Check size={14} /> Add to Collection
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