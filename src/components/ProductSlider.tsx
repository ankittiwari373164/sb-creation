'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Eye, X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '../lib/cartStore'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const MIN_COPIES = 8 // ensures enough width even with 1-2 products

const ProductSlider = ({ products }: { products: any[] }) => {
  const addItem = useCartStore((state) => state.addItem)
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [tempSize, setTempSize] = useState<string>('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const dragMoved = useRef(false)

  const cardStepRef = useRef(0)   // width of ONE card + gap, in px
  const setWidthRef = useRef(0)   // width of ONE full "products" set, in px

  // Safe fallback: never let this component crash if products is missing/empty
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : []

  const loopedProducts = useMemo(() => {
    if (safeProducts.length === 0) return []
    const copies = Math.max(MIN_COPIES, Math.ceil((MIN_COPIES * 3) / safeProducts.length))
    return Array.from({ length: copies }, () => safeProducts).flat()
  }, [safeProducts])

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', user.id)
          if (data) setWishlistIds(data.map(item => item.product_id))
        }
      } catch (err) {
        console.error('Wishlist fetch failed:', err)
      }
    }
    fetchWishlist()
  }, [])

  // Measure real card width + one "set" width, then re-measure on resize/image load,
  // and start the scroll roughly in the middle so we can loop either direction.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || safeProducts.length === 0) return

    let centered = false

    const measure = () => {
      const children = el.children
      if (!children || children.length < 2) return

      const first = children[0] as HTMLElement
      const second = children[1] as HTMLElement
      if (!first || !second) return

      const step = second.offsetLeft - first.offsetLeft
      if (!step || step <= 0) return

      cardStepRef.current = step

      const totalSets = loopedProducts.length / safeProducts.length
      setWidthRef.current = step * safeProducts.length

      if (!centered && setWidthRef.current > 0) {
        el.scrollLeft = setWidthRef.current * Math.floor(totalSets / 2)
        centered = true
      }
    }

    const t = setTimeout(measure, 50)

    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure())
      ro.observe(el)
    }

    return () => {
      clearTimeout(t)
      ro?.disconnect()
    }
  }, [loopedProducts, safeProducts.length])

  const normalizeScroll = () => {
    const el = scrollRef.current
    const setWidth = setWidthRef.current
    if (!el || !setWidth) return

    let guard = 0
    while (el.scrollLeft < setWidth && guard < 20) {
      el.scrollLeft += setWidth
      guard++
    }
    guard = 0
    while (el.scrollLeft > el.scrollWidth - setWidth * 2 && guard < 20) {
      el.scrollLeft -= setWidth
      guard++
    }
  }

  const handleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Please login to save favorites'); return }
      if (wishlistIds.includes(productId)) {
        const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
        if (!error) { setWishlistIds(prev => prev.filter(id => id !== productId)); toast.success('Removed from favorites') }
      } else {
        const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId })
        if (!error) { setWishlistIds(prev => [...prev, productId]); toast.success('Saved to favorites ❤️') }
      }
    } catch (err) {
      console.error('Wishlist toggle failed:', err)
    }
  }

  const handleAddToCartInitiate = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedProduct(product)
    setTempSize(product.sizes?.[0] || '2-4')
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize })
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        style: { background: '#2d2416', color: '#fff', borderRadius: '50px' }
      })
      setSelectedProduct(null)
    }
  }

  // Move exactly ONE card per arrow click
  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    const step = cardStepRef.current
    if (!el || !step) return
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' })
    setTimeout(normalizeScroll, 350)
  }

  // ---- Drag handlers (mouse) ----
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    isDragging.current = true
    dragMoved.current = false
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollStart.current = scrollRef.current.scrollLeft
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX.current
    if (Math.abs(walk) > 5) dragMoved.current = true
    scrollRef.current.scrollLeft = scrollStart.current - walk
  }

  const stopDragging = () => {
    isDragging.current = false
    normalizeScroll()
  }

  const onScroll = () => {
    normalizeScroll()
  }

  const onCardClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Don't render the slider strip at all if there's nothing to show —
  // avoids empty broken UI and any edge-case DOM measurement errors.
  if (safeProducts.length === 0) {
    return (
      <section className="bg-[#FFF0F5] py-6 overflow-hidden">
        <div className="container mx-auto px-0 mb-6 text-center">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block text-[#0F5A7E]">
            The Eternal Collection
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] mb-1">
            Bangles For Every<span className="italic font-semibold text-[#db2777]"> Mood</span>
          </h2>
        </div>
        <p className="text-center text-sm text-[#0F2C3E]/60 py-8">No products to display right now.</p>
      </section>
    )
  }

  return (
    <section className="bg-[#FFF0F5] py-6 overflow-hidden">
      <div className="container mx-auto px-0 mb-6 text-center">
        <span className="text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block text-[#0F5A7E]">
          The Eternal Collection
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] mb-1">
          Bangles For Every<span className="italic font-semibold text-[#db2777]"> Mood</span>
        </h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scrollByAmount('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/90 hover:bg-white text-[#0F2C3E] rounded-full shadow-md border border-[#F8C8DC] hover:border-[#db2777] transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => scrollByAmount('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 bg-white/90 hover:bg-white text-[#0F2C3E] rounded-full shadow-md border border-[#F8C8DC] hover:border-[#db2777] transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-3 md:gap-5 py-3 px-1 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none scroll-smooth"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          {loopedProducts.map((product, index) => {
            const primaryImage = product?.gallery?.[0] || product?.image_url || '/placeholder.jpg'
            const secondaryImage = product?.gallery?.[1] || product?.image_url || primaryImage
            const isLiked = wishlistIds.includes(product?.id)

            return (
              <div key={`${product?.id ?? 'p'}-${index}`} className="min-w-[180px] md:min-w-[230px] lg:min-w-[270px] flex-shrink-0">
                <Link
                  href={`/product/${product?.slug ?? ''}`}
                  className="block group"
                  onClickCapture={onCardClickCapture}
                  draggable={false}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-md border border-[#F8C8DC] hover:shadow-lg hover:border-[#db2777] transition-all duration-300">

                    <Image src={primaryImage} alt={product?.name ?? 'Product'} fill draggable={false} className="object-cover pointer-events-none transition-all duration-1000 group-hover:scale-110 group-hover:opacity-0" />
                    <Image src={secondaryImage} alt="Detail" fill draggable={false} className="object-cover pointer-events-none opacity-0 scale-125 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C3E]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5 z-30">
                      <button
                        onClick={(e) => handleAddToCartInitiate(e, product)}
                        className="p-1.5 bg-[#0F2C3E] text-white rounded-full shadow hover:bg-[#db2777] transition-all active:scale-95"
                      >
                        <ShoppingBag size={11} strokeWidth={2.5} />
                      </button>
                      <div className="p-1.5 bg-white/95 text-[#0F2C3E] rounded-full shadow border border-[#F8C8DC] hover:border-[#db2777] transition-all cursor-pointer active:scale-95">
                        <Eye size={11} strokeWidth={2.5} />
                      </div>
                      <button
                        onClick={(e) => handleWishlist(e, product?.id)}
                        className="p-1.5 bg-white/95 rounded-full shadow border border-[#F8C8DC] hover:border-[#db2777] transition-all active:scale-95"
                      >
                        <Heart size={11} strokeWidth={2.5} className={isLiked ? 'fill-[#db2777] text-[#db2777]' : 'text-[#0F2C3E]'} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    <h4 className="font-serif text-base md:text-lg text-[#0F2C3E] group-hover:text-[#db2777] transition-colors uppercase tracking-tight leading-tight line-clamp-1">
                      {product?.name}
                    </h4>
                    <p className="text-[#db2777] font-bold text-base md:text-lg mt-1">
                      ₹{Number(product?.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Size Selection Popup */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#0F2C3E]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border-2 border-[#F8C8DC]"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-[#0F2C3E] opacity-60 hover:text-[#db2777] transition-colors">
                <X size={18} />
              </button>
              <div className="text-center space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] block text-[#0F5A7E]">Select Size</span>
                <h3 className="text-xl font-serif text-[#0F2C3E]">{selectedProduct.name}</h3>
                <div className="flex justify-center gap-2 py-4">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2-2', '2-4', '2-6', '2-8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-11 h-11 rounded-full border-2 font-bold text-xs transition-all ${
                        tempSize === size
                          ? 'bg-[#0F2C3E] text-white border-[#0F2C3E]'
                          : 'border-[#F8C8DC] text-[#0F2C3E] hover:border-[#db2777]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={confirmAddToCart}
                  className="w-full bg-[#0F2C3E] text-white py-3 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#db2777] transition-all shadow-lg"
                >
                  <Check size={13} /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default ProductSlider