'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Star, Truck, ShieldCheck, ArrowRight, Heart, ZoomIn } from 'lucide-react'
import { Product, supabase } from '../../../lib/supabase'
import { useCartStore } from '../../../lib/cartStore'
import ProductCard from '../../../components/ProductCard'
import toast from 'react-hot-toast'

// ─── Magnifier ────────────────────────────────────────────────────────────────
function MagnifierImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const [lensVisible, setLensVisible] = useState(false)
  const [lensStyle, setLensStyle] = useState<React.CSSProperties>({})
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({})

  const LENS_SIZE = 220   // px — diameter of the magnifier circle
  const ZOOM = 2.8        // zoom factor

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Clamp so lens stays fully inside image
    const clampedX = Math.max(LENS_SIZE / 2, Math.min(rect.width  - LENS_SIZE / 2, x))
    const clampedY = Math.max(LENS_SIZE / 2, Math.min(rect.height - LENS_SIZE / 2, y))

    // Background-position so the zoomed area is centred in the lens
    const bgX = -(clampedX * ZOOM - LENS_SIZE / 2)
    const bgY = -(clampedY * ZOOM - LENS_SIZE / 2)

    setLensStyle({
      left: clampedX - LENS_SIZE / 2,
      top:  clampedY - LENS_SIZE / 2,
      width:  LENS_SIZE,
      height: LENS_SIZE,
    })
    setBgStyle({
      backgroundImage:    `url(${src})`,
      backgroundSize:     `${rect.width * ZOOM}px ${rect.height * ZOOM}px`,
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundRepeat:   'no-repeat',
    })
  }, [src, LENS_SIZE, ZOOM])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full group cursor-crosshair"
      onMouseEnter={() => setLensVisible(true)}
      onMouseLeave={() => setLensVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Base image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        unoptimized
      />

      {/* Zoom hint badge — disappears when lens is active */}
      {!lensVisible && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow border border-[#D4AF37]/40 pointer-events-none">
          <ZoomIn size={13} className="text-[#0F5A7E]" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#2d2416]">Hover to zoom</span>
        </div>
      )}

      {/* Magnifier lens */}
      {lensVisible && (
        <div
          ref={lensRef}
          className="absolute rounded-full border-[3px] border-[#D4AF37] shadow-2xl pointer-events-none z-20"
          style={{
            ...lensStyle,
            ...bgStyle,
            boxShadow: '0 0 0 2px #fff, 0 8px 32px rgba(0,0,0,0.28)',
          }}
        />
      )}
    </div>
  )
}
// ──────────────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [product, setProduct]             = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading]             = useState(true)
  const [quantity, setQuantity]           = useState(1)
  const [activeImg, setActiveImg]         = useState(0)
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [isWishlisted, setIsWishlisted]   = useState(false)
  const [selectedSize, setSelectedSize]   = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => { if (slug) fetchProduct() }, [slug])

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('wishlist').select('id')
          .eq('user_id', user.id).eq('product_id', product.id).single()
        if (data) setIsWishlisted(true)
      }
    }
    checkWishlist()
  }, [product])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products').select('*').eq('slug', slug).single()
      if (error) throw error
      setProduct(data)
      const sizes = data.sizes?.length ? data.sizes : ['2.2', '2.4', '2.6', '2.8']
      setSelectedSize(sizes[0])
      if (data.colors?.length) setSelectedColor(data.colors[0])
      const { data: similar } = await supabase
        .from('products').select('*')
        .eq('category', data.category).neq('id', data.id).limit(4)
      setSimilarProducts(similar || [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Please login to save favorites'); return }
    if (isWishlisted) {
      const { error } = await supabase.from('wishlist').delete()
        .eq('user_id', user.id).eq('product_id', product.id)
      if (!error) { setIsWishlisted(false); toast.success('Removed from favorites') }
    } else {
      const { error } = await supabase.from('wishlist')
        .insert({ user_id: user.id, product_id: product.id })
      if (!error) { setIsWishlisted(true); toast.success('Saved to favorites ❤️') }
    }
  }

  const productImages = product
    ? [product.image_url, ...(product.gallery || [])].filter(Boolean)
    : []

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, selectedSize, selectedColor }, quantity)
      toast.success('Added to your collection', {
        style: { background: '#2d2416', color: '#fff', borderRadius: '50px' },
      })
    }
  }

  // ── Loading / 404 ──────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F5A7E]" />
    </div>
  )
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl text-gray-400">
      Artifact Not Found
    </div>
  )

  const sizes = product.sizes?.length ? product.sizes : ['2.2', '2.4', '2.6', '2.8']

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 md:px-6 pt-2 pb-1 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#2d2416] opacity-60">
        <Link href="/" className="hover:text-[#0F5A7E] transition-colors">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-[#0F5A7E] transition-colors">Collections</Link>
        <span className="mx-1">/</span>
        <span className="opacity-40">{product.name}</span>
      </nav>

      {/* ── Main grid — fits in one viewport ── */}
      <div className="container mx-auto px-4 md:px-6">
        {/*
          KEY LAYOUT CHANGE:
          • lg:h-[calc(100vh-4rem)]  — grid fills the remaining viewport height
          • Image column: fixed height, no grow/scroll
          • Info column: overflow-y-auto if content is taller than viewport
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:h-[calc(100vh-4.5rem)]">

          {/* ── LEFT: Image panel ── */}
          <div className="lg:col-span-6 flex flex-col md:flex-row-reverse gap-2 md:gap-3
                          h-[52vw] md:h-[60vw] lg:h-full min-h-[280px] max-h-[calc(100vh-5rem)]">

            {/* Main image with magnifier */}
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex-1 rounded-xl md:rounded-[1.5rem] overflow-hidden
                         shadow-xl border-4 border-[#F5E9DC] bg-white"
            >
              {/* Wishlist button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-3 right-3 z-10 p-2 bg-[#FFFFF0]/95 backdrop-blur-sm
                           rounded-full shadow-md hover:scale-110 transition-transform border border-[#D4AF37]"
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? '#F8C8DC' : 'none'}
                  className={isWishlisted ? 'text-[#F8C8DC]' : 'text-[#2d2416] opacity-40'}
                />
              </button>

              <MagnifierImage
                src={productImages[activeImg] || '/placeholder.jpg'}
                alt={product.name}
              />
            </motion.div>

            {/* Thumbnail strip */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto
                            md:overflow-x-hidden pb-1 md:pb-0 md:w-16 no-scrollbar">
              {productImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-shrink-0 w-14 h-16 md:w-14 md:h-16 rounded-lg overflow-hidden
                              border-2 transition-all ${
                    activeImg === i
                      ? 'border-[#0F5A7E] scale-105 shadow-sm'
                      : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`view-${i}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product info — scrollable only when taller than viewport ── */}
          <div className="lg:col-span-6 lg:overflow-y-auto lg:pr-2
                          flex flex-col justify-center space-y-4 md:space-y-5 py-2">

            {/* Category + Title + Stars + Price */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-6 bg-[#0F5A7E]" />
                <span className="text-[#0F5A7E] text-[10px] font-bold uppercase tracking-[0.4em]">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#2d2416] leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-[#2d2416] opacity-70">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#D4AF37" className="text-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Handcrafted Heritage
                </span>
              </div>
              <p className="text-xl md:text-3xl font-serif text-[#D4AF37]">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <p className="text-[#2d2416] leading-relaxed font-light text-sm md:text-base
                          italic border-l-4 border-[#F8C8DC] pl-4 opacity-80 line-clamp-3">
              {product.description}
            </p>

            {/* Size + Colour */}
            <div className="space-y-4">
              {/* Size */}
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                  Select Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-full border-2 text-xs font-bold transition-all
                                  flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-[#2d2416] text-white border-[#2d2416] shadow-md'
                          : 'border-[#D4AF37] text-[#2d2416] hover:border-[#0F5A7E] hover:text-[#0F5A7E]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour */}
              {product.colors?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                    Colour Palette
                  </span>
                  <div className="flex gap-3">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor === color ? 'border-[#0F5A7E]' : 'border-transparent'
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

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#D4AF37]/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#0F5A7E] flex-shrink-0" size={15} />
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#2d2416] opacity-70">
                  Authentic Glass
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="text-[#0F5A7E] flex-shrink-0" size={15} />
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#2d2416] opacity-70">
                  Secure Delivery
                </span>
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-[#F5E9DC] rounded-full p-1 border-2 border-[#D4AF37]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#2d2416] opacity-60 hover:text-[#0F5A7E]"
                >
                  <Minus size={13} />
                </button>
                <span className="px-4 font-serif text-xl min-w-[2.5rem] text-center text-[#2d2416]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 text-[#2d2416] opacity-60 hover:text-[#0F5A7E]"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 w-full bg-[#2d2416] text-white py-3 rounded-full flex items-center
                           justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em]
                           hover:bg-[#0F5A7E] transition-all shadow-lg group disabled:opacity-30"
              >
                <ShoppingBag size={15} />
                {product.stock === 0 ? 'Unavailable' : 'Add to Collection'}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Below-fold: Reviews + Similar (unchanged layout) ── */}
      <div className="container mx-auto px-4 md:px-6">

        {/* Reviews */}
        <div className="mt-16 md:mt-20 pt-10 pb-10 border-t border-[#D4AF37]/20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-4xl font-serif text-[#2d2416]">
              Patron <span className="italic font-light text-[#D4AF37]">Notes</span>
            </h2>
            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#2d2416]
                         opacity-60 border-b-2 border-[#D4AF37] pb-1 hover:text-[#0F5A7E]
                         hover:border-[#0F5A7E] transition-all"
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
                <form className="bg-[#F5E9DC] p-6 md:p-10 rounded-2xl md:rounded-[3rem] mb-8
                                 grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-[#D4AF37]">
                  <input
                    placeholder="Name"
                    className="bg-white rounded-full py-3 px-6 text-sm border-none outline-none
                               focus:ring-2 focus:ring-[#0F5A7E]"
                  />
                  <div className="flex items-center gap-3 px-6">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#2d2416] opacity-60">
                      Rating:
                    </span>
                    <div className="flex text-[#D4AF37] gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Your experience..."
                    className="md:col-span-2 bg-white rounded-2xl p-6 text-sm border-none
                               outline-none focus:ring-2 focus:ring-[#0F5A7E] resize-none"
                    rows={4}
                  />
                  <button
                    className="bg-[#2d2416] text-white py-3 rounded-full text-[8px] font-bold
                               uppercase tracking-[0.2em] hover:bg-[#0F5A7E] transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white p-6 md:p-10 rounded-xl md:rounded-[2.5rem] border-2
                           border-[#D4AF37] hover:border-[#F8C8DC] transition-all shadow-sm"
              >
                <div className="flex text-[#D4AF37] mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="currentColor" />)}
                </div>
                <p className="font-light text-[#2d2416] text-sm md:text-base leading-relaxed italic opacity-80">
                  &quot;A timeless piece from Firozabad. The craftsmanship is evident in the subtle details.&quot;
                </p>
                <p className="mt-6 text-[8px] font-bold uppercase tracking-[0.2em] text-[#2d2416]">
                  Verified Patron
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <section className="mt-16 md:mt-20 pb-12">
            <h2 className="text-2xl md:text-4xl font-serif text-[#2d2416] mb-8">
              Related <span className="italic font-light text-[#D4AF37]">Heritage</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}