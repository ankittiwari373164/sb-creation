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
    <div className="min-h-screen bg-[#fffdfa]">
      {/* 👋 Simple Hero Section */}
      <section className="relative py-24 bg-[#0F2C3E] text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
              The SB Blog
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">
              Our <span className="italic font-light text-[#D4AF37]">Stories</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto font-light leading-relaxed">
              Read about the history of Firozabad glass, styling tips for your jewelry, and how we make our bangles.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </section>

      {/* 📜 Blog Feed */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db2777]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                    {/* Cover Image */}
                    <div className="relative h-72 overflow-hidden bg-gray-50">
                      <Image 
                        src={post.image_url || '/placeholder.jpg'} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-[#0F2C3E]">
                        {post.category || 'Jewelry'}
                      </div>
                    </div>

                    {/* Post Text */}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mb-4">
                        <Calendar size={12} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4 group-hover:text-[#db2777] transition-colors leading-snug">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E] group-hover:gap-4 transition-all gap-2">
                        Read More <ArrowRight size={14} className="text-[#db2777]" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 📧 Newsletter Section */}
      <section className="py-20 bg-[#FAF9F6] border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <Sparkles className="text-[#D4AF37] mx-auto" size={28} />
            <h2 className="text-3xl font-serif text-[#0F2C3E]">Join Our Email List</h2>
            <p className="text-gray-500 text-sm">Get new jewelry launches and stories sent to you.</p>
            <div className="flex gap-2 p-2 bg-white rounded-full border border-gray-200 shadow-sm max-w-md mx-auto">
               <input type="email" placeholder="Your email" className="bg-transparent flex-1 px-4 outline-none text-sm" />
               <button className="bg-[#0F2C3E] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-[#db2777]">Join</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}