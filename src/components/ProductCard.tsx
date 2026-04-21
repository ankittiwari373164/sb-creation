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
      icon: '🛒',
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
              className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
            >
              <Heart 
                size={18} 
                className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
              />
            </button>

            <div className="relative h-64 overflow-hidden">
              <Image
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Only {product.stock} left
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center mb-2">
                <Star className="text-yellow-400 fill-current" size={16} />
                <Star className="text-yellow-400 fill-current" size={16} />
                <Star className="text-yellow-400 fill-current" size={16} />
                <Star className="text-yellow-400 fill-current" size={16} />
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="text-sm text-gray-600 ml-2">(5.0)</span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  onClick={handleAddToCartInitiate}
                  disabled={product.stock === 0}
                  className="btn-primary py-2 px-4 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-gray-100"
            >
              <button 
                onClick={() => setShowSizePopup(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <span className="text-primary-600 text-[10px] font-bold uppercase tracking-[0.4em]">Select Bangle Size</span>
                <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                
                <div className="flex justify-center gap-3 py-6">
                  {((product as any).sizes?.length > 0 ? (product as any).sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg' 
                        : 'border-gray-100 text-gray-600 hover:border-primary-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-primary-600 text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl"
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