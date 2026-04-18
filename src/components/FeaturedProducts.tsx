"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCartStore } from '../lib/cartStore'; // Import your Yummigo cart logic
import toast from 'react-hot-toast';

const FeaturedProducts = ({ products }: { products: any[] }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added!`, {
      icon: '💍',
      style: { background: '#0F2C3E', color: '#fff', borderRadius: '10px' }
    });
  };

  return (
    <section className="bg-white py-20 px-4 md:px-10">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="text-[#db2777] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">
            Trending Now
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#0F2C3E] uppercase tracking-tight">
            Our <span className="italic font-light lowercase text-gray-400">Featured</span> Collection
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37] mt-4" />
        </div>

        {/* Product Display */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-8 scrollbar-hide pb-6">
          {products.map((product) => {
            // Yummigo DB Check: Handle both single image_url and images array
            const primaryImage = product.images?.[0] || product.image_url || '/placeholder.jpg';
            const secondaryImage = product.images?.[1] || product.image_url || primaryImage;
            const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null;

            return (
              <div key={product.id} className="min-w-[260px] md:min-w-0 group cursor-pointer">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f8f8f8]">
                    
                    {/* Discount Badge - Auto Calculated */}
                    {discount && discount > 0 && (
                      <div className="absolute top-4 left-4 z-30 bg-[#db2777] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                        -{discount}%
                      </div>
                    )}

                    {/* Image Swap Logic */}
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                    />

                    <Image
                      src={secondaryImage}
                      alt={`${product.name} detail`}
                      fill
                      className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
                    />

                    {/* Interactive Action Buttons */}
                    <div className="absolute inset-0 flex items-end justify-center pb-8 gap-3 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-3 bg-white rounded-full shadow-xl hover:bg-[#0F2C3E] hover:text-white transition-all transform hover:scale-110"
                      >
                        <ShoppingBag size={18} strokeWidth={2.5} />
                      </button>
                      <button className="p-3 bg-white rounded-full shadow-xl hover:bg-[#db2777] hover:text-white transition-all transform hover:scale-110">
                        <Heart size={18} strokeWidth={2.5} />
                      </button>
                      <button className="p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-all transform hover:scale-110">
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-1.5 px-1">
                    <h3 className="text-[#0F2C3E] text-[13px] font-medium leading-snug line-clamp-2 uppercase tracking-wide opacity-90">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[#db2777] font-bold text-[15px]">
                        ₹{product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through text-[12px] font-light">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;