'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Heart, X, Check } from 'lucide-react'
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
      const { data: { user } } = await supabase.auth.getUser()
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

    const { data: { user } } = await supabase.auth.getUser()
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
      style: { background: '#2d2416', color: '#fff', borderRadius: '50px' }
    })
    setShowSizePopup(false)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/product/${product.slug}`}>
          <div className="card group cursor-pointer h-full relative">
            
            {/* ❤️ Wishlist Heart Icon */}
            <button 
              onClick={toggleWishlist}
              className="absolute top-4 left-4 z-10 p-2 bg-[#FFFFF0]/90 backdrop-blur-md rounded-full shadow-md hover:scale-110 transition-transform border border-[#D4AF37]"
            >
              <Heart 
                size={18} 
                className={isWishlisted ? 'fill-[#F8C8DC] text-[#F8C8DC]' : 'text-[#2d2416] opacity-40'} 
              />
            </button>

            <div className="relative h-64 overflow-hidden rounded-2xl border-2 border-[#D4AF37]">
              <Image
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-[#F8C8DC] text-[#2d2416] px-3 py-1 rounded-full text-sm font-semibold">
                  Only {product.stock} left
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-[#2d2416] bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center mb-2">
                <Star className="text-[#D4AF37] fill-current" size={16} />
                <Star className="text-[#D4AF37] fill-current" size={16} />
                <Star className="text-[#D4AF37] fill-current" size={16} />
                <Star className="text-[#D4AF37] fill-current" size={16} />
                <Star className="text-[#D4AF37] fill-current" size={16} />
                <span className="text-sm text-[#2d2416] opacity-60 ml-2">(5.0)</span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-[#2d2416] group-hover:text-[#0F5A7E] transition-colors">
                {product.name}
              </h3>

              <p className="text-[#2d2416] opacity-70 mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  onClick={handleAddToCartInitiate}
                  disabled={product.stock === 0}
                  className="bg-[#2d2416] hover:bg-[#0F5A7E] text-white py-2 px-4 rounded-full flex items-center gap-2 font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                >
                  <ShoppingCart size={18} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* --- 📏 Size Selection Popup --- */}
      <AnimatePresence>
        {showSizePopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
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
              className="relative bg-[#FFFFF0] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border-2 border-[#D4AF37]"
            >
              <button 
                onClick={() => setShowSizePopup(false)}
                className="absolute top-6 right-6 text-[#2d2416] opacity-50 hover:text-[#0F5A7E] transition-colors bg-[#F5E9DC] p-2 rounded-full"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <span className="text-[#0F5A7E] text-[10px] font-bold uppercase tracking-[0.4em] block">Select Bangle Size</span>
                <h3 className="text-2xl font-bold text-[#2d2416]">{product.name}</h3>
                
                <div className="flex justify-center gap-3 py-6">
                  {((product as any).sizes?.length > 0 ? (product as any).sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
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
                  className="w-full bg-[#2d2416] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#0F5A7E] transition-all shadow-xl hover:shadow-2xl"
                >
                  <Check size={14} /> Confirm & Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}