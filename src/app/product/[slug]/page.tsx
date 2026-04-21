'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Star, Truck, ShieldCheck, Sparkles, ArrowRight, X, Heart } from 'lucide-react'
import { Product, supabase } from '../../../lib/supabase'
import { useCartStore } from '../../../lib/cartStore'
import ProductCard from '../../../components/ProductCard'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return
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
  }, [product])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setProduct(data)
      
      const availableSizes = data.sizes && data.sizes.length > 0 ? data.sizes : ['2.2', '2.4', '2.6', '2.8']
      setSelectedSize(availableSizes[0])

      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0])
      }

      const { data: similar } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4)
      setSimilarProducts(similar || [])
    } catch (error) {
      console.error('Database Fetch Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async () => {
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

  const productImages = product 
    ? [product.image_url, ...(product.gallery || [])].filter(Boolean)
    : []

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, selectedSize, selectedColor }, quantity)
      toast.success(`Added to your collection`, {
        style: { background: '#db2777', color: '#fff', borderRadius: '50px' },
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db2777]"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-gray-400">
      Artifact Not Found
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-12">
      <nav className="container mx-auto px-6 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300">
        <Link href="/" className="hover:text-[#db2777] transition-colors">Home</Link> <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-[#db2777] transition-colors">Collections</Link> <span className="mx-1">/</span>
        <span className="text-gray-400">{product.name}</span>
      </nav>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            <motion.div 
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-xl border-[8px] border-[#FAF9F6] bg-white"
            >
              <button 
                onClick={toggleWishlist}
                className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
              >
                <Heart size={24} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'} />
              </button>

              <Image 
                src={productImages[activeImg] || '/placeholder.jpg'} 
                alt={product.name} 
                fill 
                className="object-cover transition-all duration-700 hover:scale-105"
                unoptimized 
              />
            </motion.div>
            
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
              {productImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-[#db2777] scale-105 shadow-sm' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`view-${i}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-[#db2777]" />
                <span className="text-[#db2777] text-xs font-bold uppercase tracking-[0.4em]">{product.category}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-gray-200">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#db2777" className="text-[#db2777]" />)}</div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Handcrafted Heritage</span>
              </div>
              <p className="text-4xl md:text-5xl font-serif text-[#0F2C3E] pt-2">₹{product.price.toLocaleString()}</p>
            </div>

            <p className="text-gray-600 leading-relaxed font-light text-xl italic border-l-4 border-[#fff1f2] pl-6">
              {product.description}
            </p>

            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Select Size</span>
                <div className="flex flex-wrap gap-3">
                  {(product.sizes && product.sizes.length > 0 ? product.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border-2 text-sm font-bold transition-all flex items-center justify-center ${
                        selectedSize === size 
                        ? 'bg-[#0F2C3E] text-white border-[#0F2C3E] shadow-md' 
                        : 'border-gray-100 text-gray-400 hover:border-[#db2777] hover:text-[#db2777]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Colour Palette</span>
                  <div className="flex gap-4">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === color ? 'border-[#db2777]' : 'border-transparent'
                        }`}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-inner" 
                          style={{ backgroundColor: color }} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#db2777]" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Authentic Glass</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-[#db2777]" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure Delivery</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center bg-[#F9FAFB] w-fit rounded-full p-2 border border-gray-100">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-500 hover:text-[#db2777]"><Minus size={18} /></button>
                <span className="px-6 font-serif text-3xl min-w-[3rem] text-center text-[#0F2C3E]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} 
                  className="p-3 text-gray-500 hover:text-[#db2777]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.3em] hover:bg-[#db2777] transition-all shadow-lg group disabled:opacity-30"
              >
                <ShoppingBag size={22} /> 
                {product.stock === 0 ? 'Unavailable' : 'Add to Collection'} 
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-gray-50">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl font-serif text-[#0F2C3E]">Patron <span className="italic font-light text-[#db2777]">Notes</span></h2>
              <button 
                onClick={() => setIsWritingReview(!isWritingReview)} 
                className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 border-b-2 border-gray-200 pb-1 hover:text-[#db2777] hover:border-[#db2777] transition-all"
              >
                {isWritingReview ? 'Close' : 'Share Narrative'}
              </button>
            </div>
            
            <AnimatePresence>
              {isWritingReview && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                 >
                  <form className="bg-[#FAF9F6] p-10 rounded-[3rem] mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100">
                     <input placeholder="Name" className="bg-white rounded-full py-4 px-8 text-base border-none outline-none focus:ring-2 focus:ring-[#db2777]" />
                     <div className="flex items-center gap-4 px-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Rating:</span>
                        <div className="flex text-[#db2777] gap-1"><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /></div>
                     </div>
                     <textarea placeholder="Your experience..." className="md:col-span-2 bg-white rounded-[2rem] p-8 text-base border-none outline-none focus:ring-2 focus:ring-[#db2777] resize-none" rows={4} />
                     <button className="md:col-span-1 bg-[#0F2C3E] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#db2777] transition-all">Submit Review</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-50 group hover:border-[#fff1f2] transition-all shadow-sm">
                  <div className="flex text-[#db2777] mb-6"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                  <p className="font-light text-gray-600 text-lg leading-relaxed italic">&quot;A timeless piece from Firozabad. The craftsmanship is evident in the subtle details.&quot;</p>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#0F2C3E]">Verified Patron</p>
                </div>
              ))}
            </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-4xl font-serif text-[#0F2C3E] mb-10">Related <span className="italic font-light text-[#db2777]">Heritage</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}