'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useCartStore } from '../../lib/cartStore'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

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

  const moveToCart = (item: any) => {
    addItem(item.product)
    removeFromWishlist(item.id)
    toast.success('Moved to your bag!', {
      style: { background: '#db2777', color: '#fff', borderRadius: '50px' }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#db2777]" size={40} />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6">
        <div className="text-center">
          <div className="w-20 md:w-24 h-20 md:h-24 bg-[#fff1f2] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Heart size={32} className="md:w-10 md:h-10 text-[#db2777]" fill="#db2777" />
          </div>
          <h2 className="text-2xl md:text-4xl font-serif text-[#0F2C3E] mb-2 md:mb-4">Your Wishlist is Empty</h2>
          <p className="text-sm md:text-lg mb-6 md:mb-10">
            <Link href="/sign-in" className="text-[#db2777] font-extrabold hover:underline">
              Sign in
            </Link>
            {' '}to add to wishlist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 md:mb-10 border-b border-gray-100 pb-4 md:pb-4 flex justify-between items-end gap-2">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif text-[#0F2C3E]">My <span className="italic font-semibold text-[#d92b7a]">Favorites</span></h1>
            <p className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1 md:mt-2">The Collection</p>
          </div>
          <p className="text-[10px] md:text-sm text-gray-300 font-bold uppercase tracking-widest">
            {wishlistItems.length} Artifacts
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-10">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-lg md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col"
              >
                {/* Remove Icon */}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 md:top-4 right-2 md:right-4 z-10 p-1.5 md:p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-300 hover:text-red-500 shadow-sm transition-colors"
                >
                  <Trash2 size={14} className="md:w-[18px] md:h-[18px]" />
                </button>

                {/* Image Section */}
                <Link href={`/product/${item.product.slug}`} className="relative aspect-square bg-[#F9FAFB] overflow-hidden">
                  <Image 
                    src={item.product.image_url || '/placeholder.jpg'} 
                    alt={item.product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </Link>

                {/* Details Section */}
                <div className="p-3 md:p-6 flex flex-col flex-1 text-center bg-white">
                  <div className="flex items-center justify-between gap-1 mb-3 md:mb-2">
                    <h3 className="text-[#0F2C3E] font-bold text-xs md:text-base lg:text-lg uppercase truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[#db2777] font-serif text-lg md:text-xl lg:text-2xl shrink-0">₹{item.product.price.toLocaleString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => moveToCart(item)}
                    className="mt-auto w-full bg-[#0F2C3E] text-white py-2 md:py-4 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 md:gap-3 hover:bg-[#db2777] transition-all shadow-md"
                  >
                    Move to Bag <ShoppingBag size={12} className="md:w-4 md:h-4" />
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