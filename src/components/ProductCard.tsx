'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '../lib/supabase'
import { useCartStore } from '../lib/cartStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

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
        <div className="card group cursor-pointer h-full">
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
                <span className="text-sm text-gray-500 ml-2">{product.weight}</span>
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