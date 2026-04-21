"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, ChevronLeft, X, Check } from 'lucide-react';
import { useCartStore } from '../lib/cartStore';
import toast from 'react-hot-toast';

const CreativeGallery = ({ products }: { products: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  
  // Size Popup States
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [tempSize, setTempSize] = useState<string>('');

  const carouselProducts = products?.slice(0, 3) || [];
  const sideProducts = products?.slice(3, 5) || [];

  useEffect(() => {
    if (carouselProducts.length > 0 && !selectedProduct) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselProducts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselProducts.length, selectedProduct]);

  const handleOpenSizePopup = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setTempSize(product.sizes?.[0] || '2.4');
  };

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem({ ...selectedProduct, selectedSize: tempSize });
      toast.success(`${selectedProduct.name} (${tempSize}) added`, {
        style: { background: '#1a1a2e', color: '#fff', borderRadius: '50px' }
      });
      setSelectedProduct(null);
    }
  };

  return (
    <section className="bg-pink-50 py-12 px-4 md:px-10">
      <div className="container mx-auto max-w-7xl">
        
        {/* Creative Header */}
        <div className="mb-12 flex items-end justify-between">
          <div className="text-left">
            <span className="text-[#e8378e] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">
              Curated Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a2e] uppercase tracking-tighter leading-tight">
              Featured <span className="italic font-light lowercase text-[#ffc857]">Artistry</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[11px] font-bold tracking-widest uppercase border-b border-[#1a1a2e] pb-1 hover:text-[#e8378e] hover:border-[#e8378e] transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* 🎡 LEFT SIDE: Main Interactive Carousel */}
          <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[400px] lg:h-full"
              >
                {carouselProducts[currentIndex] && (
                  <>
                    <Image
                      src={carouselProducts[currentIndex]?.images?.[0] || carouselProducts[currentIndex]?.image_url || '/placeholder.jpg'}
                      alt={carouselProducts[currentIndex]?.name}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/60 via-[#1a1a2e]/20 to-transparent flex items-center p-8 md:p-16">
                      <div className="max-w-md">
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-[#ffc857] text-xs font-bold tracking-widest uppercase mb-4"
                        >
                          Premium Collection
                        </motion.p>
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-white text-4xl md:text-6xl font-serif mb-8 leading-[1.1]"
                        >
                          {carouselProducts[currentIndex]?.name}
                        </motion.h3>
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }} 
                          animate={{ y: 0, opacity: 1 }} 
                          transition={{ delay: 0.2 }}
                        >
                           <button 
                            onClick={(e) => handleOpenSizePopup(e, carouselProducts[currentIndex])}
                            className="bg-white text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-sm hover:bg-[#e8378e] hover:text-white transition-all inline-flex items-center gap-2 shadow-lg"
                           >
                             Shop Now <ShoppingBag size={18} />
                           </button>
                        </motion.div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Carousel Nav Dots */}
            <div className="absolute bottom-8 right-8 flex gap-3 z-30">
              {carouselProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          {/* 🖼️ RIGHT SIDE: Creative Grid */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {sideProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="relative flex-1 group overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 min-h-[280px]"
              >
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={product.images?.[0] || product.image_url || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-transparent to-transparent flex items-end p-8">
                    <div className="text-white translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-[#ffc857] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">
                        {product.category || "Exclusive"}
                      </p>
                      <h4 className="text-2xl font-serif leading-tight">{product.name}</h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 📏 Size Selection Popup --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#1a1a2e]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#e8378e]"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <span className="text-[#e8378e] text-[10px] font-bold uppercase tracking-[0.4em] block">Select Size</span>
                <h3 className="text-2xl font-serif text-[#1a1a2e]">{selectedProduct.name}</h3>
                
                <div className="flex justify-center gap-3 py-6">
                  {(selectedProduct.sizes?.length > 0 ? selectedProduct.sizes : ['2.2', '2.4', '2.6', '2.8']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setTempSize(size)}
                      className={`w-12 h-12 rounded-full border-2 font-bold text-xs transition-all flex items-center justify-center ${
                        tempSize === size 
                        ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' 
                        : 'border-gray-200 text-[#1a1a2e] hover:border-[#e8378e]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={confirmAddToCart}
                  className="w-full bg-[#1a1a2e] text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#e8378e] transition-all"
                >
                  <Check size={14} /> Add to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CreativeGallery;