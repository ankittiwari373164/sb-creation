'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function JournalPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setPosts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        setPosts([])
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Sample posts curated for SB Creation
  const samplePosts = [
    {
      id: '1',
      title: 'The Art of Firozabad: A 200-Year Legacy',
      slug: 'firozabad-legacy',
      excerpt: 'Exploring the history of the "Glass City" and the master craftsmen who have kept the tradition of handcrafted bangles alive for centuries.',
      author: 'Master Artisan',
      created_at: new Date().toISOString(),
      image_url: '/images/journal-1.jpg',
      category: 'Heritage'
    },
    {
      id: '2',
      title: 'Bridal Trends: Pairing Bangles with Modern Lehengas',
      slug: 'bridal-trends-2026',
      excerpt: 'From glass to gold-plated zardosi, here is your ultimate guide to selecting the perfect bangle set for your big day.',
      author: 'Stylist Team',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      image_url: '/images/journal-2.jpg',
      category: 'Styling'
    },
    {
      id: '3',
      title: 'How to Care for Your Handcrafted Glass Jewelry',
      slug: 'care-guide',
      excerpt: 'Essential tips to maintain the luster and longevity of your SB Creation pieces, ensuring they stay as vibrant as the day you bought them.',
      author: 'Quality Team',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      image_url: '/images/journal-3.jpg',
      category: 'Care'
    }
  ]

  const displayPosts = posts.length > 0 ? posts : samplePosts

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      {/* 🏛️ Editorial Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#db2777] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 block">
              The SB Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] mb-8 leading-tight">
              Stories of <span className="italic font-light text-[#D4AF37]">Artistry</span>
            </h1>
            <p className="text-lg text-[#0F2C3E]/60 max-w-2xl mx-auto font-light leading-relaxed">
              Dive into the heritage of Firozabad, styling guides for the modern woman, and the intricate craftsmanship behind every SBC piece.
            </p>
          </motion.div>
        </div>
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-serif text-[#0F2C3E]/5 select-none pointer-events-none">
          Legacy
        </div>
      </section>

      {/* 📜 Journal Feed */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[450px] bg-gray-100 rounded-[2.5rem] mb-6" />
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-100 w-1/4" />
                    <div className="h-8 bg-gray-100 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {displayPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                    {/* Image Container with "Polaroid" style */}
                    <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl bg-[#FAF9F6]">
                      <div className="absolute inset-0 bg-[#0F2C3E]/10 group-hover:bg-transparent transition-colors z-10" />
                      {/* Using a placeholder box if image_url is missing, but styled elegantly */}
                      <div className="w-full h-full flex items-center justify-center text-4xl text-[#D4AF37]/20">
                         <BookOpen size={64} strokeWidth={1} />
                      </div>
                      
                      {/* Post Category Tag */}
                      <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E]">
                        {post.category || 'Lifestyle'}
                      </div>
                    </div>

                    <div className="flex-1 px-2">
                      <div className="flex items-center text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-4">
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="mx-3 opacity-30">•</span>
                        <span>{post.author}</span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] mb-4 group-hover:text-[#db2777] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-[#0F2C3E]/60 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center text-[11px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E] group-hover:text-[#db2777] transition-all">
                        Read Narrative
                        <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 💍 Luxury Newsletter CTA */}
      <section className="py-24 bg-[#0F2C3E] relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="text-[#D4AF37] mx-auto mb-8" size={32} />
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 uppercase tracking-tighter">
              Join the <span className="italic font-light text-[#D4AF37]">Inner Circle</span>
            </h2>
            <p className="text-white/50 text-base mb-10 max-w-xl mx-auto font-light">
              Receive artisan stories, bridal styling tips, and exclusive access to new collection launches directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-md mx-auto border-b border-white/20 pb-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent px-4 py-3 text-white outline-none w-full placeholder:text-white/20 text-sm"
              />
              <button className="text-[#D4AF37] hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] py-3 px-6 transition-all">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px]" />
      </section>
    </div>
  )
}