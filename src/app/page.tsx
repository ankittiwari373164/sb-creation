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