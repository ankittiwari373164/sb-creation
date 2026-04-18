'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Star, Truck, ShieldCheck, Sparkles, ArrowRight, X } from 'lucide-react'
import { Product, supabase } from '../../../lib/supabase'
import { useCartStore } from '../../../lib/cartStore'
import ProductCard from '@/components/ProductCard'
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
  
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (slug) fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setProduct(data)
      
      // Fetch Similar Products from same category
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

  // Combine main image and gallery array from your DB
  // Adjust 'gallery' to match your DB column name (e.g., gallery_urls)
  const productImages = product 
    ? [product.image_url, ...(product.gallery || [])].filter(Boolean)
    : []

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(`Added to your collection`, {
        style: { background: '#0F2C3E', color: '#fff', borderRadius: '50px' },
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]"></div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl">
      Artifact Not Found
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fffdfa] pb-20">
      {/* --- Breadcrumb --- */}
      <nav className="container mx-auto px-6 py-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#0F2C3E]/30">
        <Link href="/">Home</Link> <span className="mx-2">/</span>
        <Link href="/shop">Collections</Link> <span className="mx-2">/</span>
        <span className="text-[#0F2C3E]">{product.name}</span>
      </nav>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* 🖼️ DYNAMIC MULTI-IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-6">
            {/* Main Featured Image */}
            <motion.div 
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] w-full rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-[#FAF9F6]"
            >
              <Image 
                src={productImages[activeImg] || '/placeholder.jpg'} 
                alt={product.name} 
                fill 
                className="object-cover transition-all duration-700 hover:scale-105"
                unoptimized // Use this if your admin panel uploads to an external storage
              />
            </motion.div>
            
            {/* Thumbnails mapped from DB */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
              {productImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-[#D4AF37] scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`view-${i}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {/* 📜 CONTENT AREA */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-8 bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.5em]">{product.category}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] tracking-tighter leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-[#D4AF37]">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/40">Handcrafted Excellence</span>
              </div>
              <p className="text-4xl font-serif text-[#0F2C3E]">₹{product.price.toLocaleString()}</p>
            </div>

            <p className="text-[#0F2C3E]/60 leading-relaxed font-light text-lg italic border-l border-[#D4AF37]/20 pl-6">
              {product.description}
            </p>

            {/* ATELIER SERVICES */}
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-[#D4AF37]/10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#D4AF37]" size={20} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E]">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-[#D4AF37]" size={20} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E]">Bespoke Packaging</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center bg-[#FAF9F6] w-fit rounded-full p-2 border border-[#D4AF37]/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-[#db2777]"><Minus size={18} /></button>
                <span className="px-6 font-serif text-2xl min-w-[3rem] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} 
                  className="p-3 hover:text-[#db2777]"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#db2777] transition-all shadow-xl group disabled:opacity-50"
              >
                <ShoppingBag size={20} /> 
                {product.stock === 0 ? 'Out of Collection' : 'Add to Collection'} 
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* ⭐ REVIEWS SECTION */}
        <div className="mt-32 pt-20 border-t border-[#D4AF37]/10">
           <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl font-serif text-[#0F2C3E]">Patron <span className="italic font-light">Experiences</span></h2>
              <button 
                onClick={() => setIsWritingReview(!isWritingReview)} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-[#0F2C3E] pb-1"
              >
                {isWritingReview ? 'Close' : 'Share Experience'}
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
                 <form className="bg-[#FAF9F6] p-10 rounded-[3rem] mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 border border-[#D4AF37]/10">
                    <input placeholder="Full Name" className="bg-white rounded-full py-4 px-8 border-none outline-none focus:ring-1 focus:ring-[#D4AF37]" />
                    <div className="flex items-center gap-4 px-8">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Valuation:</span>
                       <div className="flex text-[#D4AF37] gap-1"><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /><Star size={16} /></div>
                    </div>
                    <textarea placeholder="Your experience with this piece..." className="md:col-span-2 bg-white rounded-[2rem] p-8 border-none outline-none focus:ring-1 focus:ring-[#D4AF37]" rows={4} />
                    <button className="md:col-span-1 bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">Submit Narrative</button>
                 </form>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 group hover:border-[#D4AF37]/30 transition-all">
                  <div className="flex text-[#D4AF37] mb-6"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                  <p className="font-light text-[#0F2C3E]/70 leading-relaxed italic">&quot;Truly a masterpiece from Firozabad. The way the glass catches the evening light is mesmerizing. A staple for my bridal collection.&quot;</p>
                  <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]">Aditi V. • Verified Patron</p>
                </div>
              ))}
           </div>
        </div>

        {/* 🏺 SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <section className="mt-32">
            <h2 className="text-4xl font-serif text-[#0F2C3E] mb-12 uppercase tracking-tighter">Heritage <span className="italic font-light">Related</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}