'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { Product, supabase } from '../lib/supabase'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isWishlisted, setIsWishlisted] = useState(false)

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
      // Remove from wishlist
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
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product.id })

      if (!error) {
        setIsWishlisted(true)
        toast.success('Saved to favorites ❤️')
      }
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success('Added to cart!', {
      icon: '🛒',
    })
  }

  return (
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
                onClick={handleAddToCart}
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
  )
}