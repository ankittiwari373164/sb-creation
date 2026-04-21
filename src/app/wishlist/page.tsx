'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useCartStore } from '../../lib/cartStore'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  // 🔄 Fetch Wishlist from Supabase
  const fetchWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product:products (
            id,
            name,
            price,
            image_url,
            slug,
            description
          )
        `)

      if (error) throw error
      setWishlistItems(data || [])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  // 🗑️ Remove from Wishlist
  const removeFromWishlist = async (wishlistId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistId)

      if (error) throw error

      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId))
      toast.success('Removed from your favorites')
    } catch (error) {
      toast.error('Could not remove item')
    }
  }

  // 🛒 Move to Cart
  const moveToCart = (item: any) => {
    addItem(item.product)
    removeFromWishlist(item.id)
    toast.success('Moved to your bag!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdfa]">
        <Loader2 className="animate-spin text-[#db2777]" size={40} />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-gray-200" />
          </div>
          <h2 className="text-3xl font-serif text-[#0F2C3E] mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mb-10">Save your favorite jewelry here to buy them later.</p>
          <Link href="/shop">
            <button className="bg-[#0F2C3E] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 border-b border-gray-100 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-serif text-[#0F2C3E]">My <span className="italic font-light text-gray-400">Favorites</span></h1>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2">Saved Jewelry</p>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            {wishlistItems.length} Items
          </p>
        </div>

        {/* 2-Column Mobile Grid / 4-Column Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-50 shadow-sm relative flex flex-col"
              >
                {/* Remove Icon */}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                {/* Image Section */}
                <Link href={`/product/${item.product.slug}`} className="relative aspect-square bg-[#FAF9F6] overflow-hidden">
                  <Image 
                    src={item.product.image_url || '/placeholder.jpg'} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </Link>

                {/* Details Section */}
                <div className="p-4 flex flex-col flex-1 text-center">
                  <h3 className="text-[#0F2C3E] font-bold text-[11px] md:text-sm uppercase mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-[#db2777] font-bold text-sm md:text-lg mb-4">₹{item.product.price}</p>
                  
                  <button 
                    onClick={() => moveToCart(item)}
                    className="mt-auto w-full bg-[#0F2C3E] text-white py-3 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#db2777] transition-all active:scale-95 shadow-md"
                  >
                    Move to Bag <ShoppingBag size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}