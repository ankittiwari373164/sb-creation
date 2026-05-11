"use client";
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import { supabase } from '../lib/supabase'
import Heritage from '../components/Heritage';
import CreativeGallery from '../components/CreativeGallery';
import ProductSlider from '../components/ProductSlider';
import Testimonials from '../components/Testimonials';
import PublicInstaFeed from '../components/PublicInstaFeed';
import Newsletter from '../components/Newsletter';
import ProductGrid from '../components/ProductGrid';
import ArtisanalStack from '../components/ArtisanalStack'
import ProductVault from '../components/ProductVault'
import VideoShowcase from '../components/VideoShowcase';
import HeroSlider from '../components/HeroSlider';
import Product from '../components/Product';




export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await supabase.from('products').select('*')
        setProducts(data || [])
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <HeroSlider />
      <section className="w-full bg-white py-8 md:py-12">
  <div className="max-w-[1500px] mx-auto px-4 md:px-6">

    {/* SECTION TITLE */}
<div className="text-center mb-10 md:mb-14">

  {/* Small Heading */}
  <span className="text-[10px] md:text-[11px] uppercase tracking-[0.45em] font-semibold text-[#0F5A7E] block mb-2">
    NEW ARRIVALS
  </span>

  {/* Main Heading */}
  <h2 className="text-[24px] md:text-[40px] leading-[1.2] font-serif text-[#2d2416] font-medium">
    Elegant
    <span className="italic font-semibold text-[#d92b7a]">
      {' '}Bangle Collection
    </span>
  </h2>

  {/* Subtitle */}
  <p className="text-[#6b6b6b] text-[13px] md:text-[15px] mt-3 max-w-xl mx-auto leading-[1.7]">
    Discover handcrafted bangles designed with timeless elegance
    and luxury for every special occasion.
  </p>

  {/* Decorative Divider */}
  <div className="flex items-center justify-center mt-5 gap-2">
    <div className="w-10 h-[1px] bg-[#D4AF37]"></div>

    <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>

    <div className="w-10 h-[1px] bg-[#D4AF37]"></div>
  </div>

</div>

    {/* PRODUCT GRID */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">

      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
        />
      ))}

    </div>

  </div>
</section>
      <ProductSlider products={products.slice(0, 8)} />
      <PublicInstaFeed />
      <CreativeGallery products={products} />
      {/* <ProductGrid products={products} title="Our Masterpieces" /> */}
      <ArtisanalStack products={products} />
      <ProductVault products={products} />
      {/* <VideoShowcase product={products[0]} /> */}
      {/* <Hero />
      <Categories /> */}
      {/* 4. Pass the fetched products to the component */}
      {/* <FeaturedProducts products={products} /> */}
      {/* <Heritage /> */}
      {/* <Testimonials /> */}
      
      {/* <Newsletter /> */}
    </main>
  );
}