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


export default function Home() {
  // 2. Set up a state to hold your products
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // 3. Create an async function inside useEffect
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').limit(8);
      if (data) setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <Hero />
      <Categories />
      {/* 4. Pass the fetched products to the component */}
      <FeaturedProducts products={products} />

      
      <CreativeGallery products={products} />
      <ProductSlider products={products.slice(0, 8)} />
      <Heritage />
      <Testimonials />
      <PublicInstaFeed />
      <Newsletter />
    </main>
  );
}