'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function JournalPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (!error) setPosts(data || [])
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 👋 Editorial Hero Section - Soft Pink */}
      <section className="relative py-10 md:py-14 bg-[#fff1f2] overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#db2777] text-[11px] font-bold tracking-[0.5em] uppercase mb-4 block">
              The Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] mb-6">
              Our <span className="italic font-light text-[#db2777]">Stories</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed text-base md:text-lg">
              Explore the heritage of Firozabad glass, styling narratives, and the artisanal journey behind our collections.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px]" />
      </section>

      {/* 📜 Blog Feed */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db2777]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                    {/* Cover Image */}
                    <div className="relative h-72 overflow-hidden bg-[#F9FAFB]">
                      <Image 
                        src={post.image_url || '/placeholder.jpg'} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E] shadow-sm">
                        {post.category || 'Heritage'}
                      </div>
                    </div>

                    {/* Post Text */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-[#db2777] uppercase tracking-widest mb-4">
                        <Calendar size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] mb-4 group-hover:text-[#db2777] transition-colors leading-tight">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3 font-light">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E] group-hover:gap-4 transition-all gap-2">
                        Read Narrative <ArrowRight size={16} className="text-[#db2777]" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 📧 Newsletter Section - Grey Aesthetic */}
      <section className="py-16 bg-[#F9FAFB] border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <Sparkles className="text-[#db2777] mx-auto" size={32} />
            <h2 className="text-3xl md:text-4xl font-serif text-[#0F2C3E]">The Inner Circle</h2>
            <p className="text-gray-500 text-base">Receive artisanal updates and exclusive launch stories directly.</p>
            <div className="flex items-center gap-2 p-2 bg-white rounded-full border border-gray-200 shadow-sm max-w-md mx-auto focus-within:border-[#db2777] transition-all">
               <input type="email" placeholder="Your email address" className="bg-transparent flex-1 px-5 outline-none text-sm text-[#0F2C3E]" />
               <button className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all shadow-md">Join</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}