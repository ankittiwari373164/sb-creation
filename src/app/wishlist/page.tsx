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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#fff1f2] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-[#db2777]" fill="#db2777" />
          </div>
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-400 text-lg mb-10">Sign in to add to wishlist.</p>
          <Link href="/shop">
            <button className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all shadow-lg">
              Go Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-4 px-6"> {/* Removed top spacing */}
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10 border-b border-gray-100 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-serif text-[#0F2C3E]">My <span className="italic font-light text-[#db2777]">Favorites</span></h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">The Collection</p>
          </div>
          <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">
            {wishlistItems.length} Artifacts
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col"
              >
                {/* Remove Icon */}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-300 hover:text-red-500 shadow-sm transition-colors"
                >
                  <Trash2 size={18} />
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
                <div className="p-6 flex flex-col flex-1 text-center bg-white">
                  <h3 className="text-[#0F2C3E] font-bold text-base md:text-lg uppercase mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-[#db2777] font-serif text-xl md:text-2xl mb-6">₹{item.product.price.toLocaleString()}</p>
                  
                  <button 
                    onClick={() => moveToCart(item)}
                    className="mt-auto w-full bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#db2777] transition-all shadow-md"
                  >
                    Move to Bag <ShoppingBag size={16} />
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