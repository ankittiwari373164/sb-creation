'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BlogDetailPage() {
  const params = useParams()
  
  // This syntax works ONLY in .tsx files
  const slug = params?.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Narrative not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0F2C3E]/40">Loading Narrative</span>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-4xl font-serif text-[#0F2C3E] mb-6 italic">Post not found</h2>
          <Link href="/blog">
            <button className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all">
              Return to Journal
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      {/* 🏛️ Header Section */}
      <section className="bg-[#FAF9F6] pt-32 pb-20 border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2C3E]/40 hover:text-[#db2777] mb-12 transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-6">
              <Calendar size={14} className="mr-2" />
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
              <span className="mx-4 opacity-20">|</span>
              <User size={14} className="mr-2" />
              {post.author || 'SBC Editorial'}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-8 leading-[1.1]">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-[#0F2C3E]/60 leading-relaxed font-light italic border-l-2 border-[#D4AF37] pl-8 py-2">
                {post.excerpt}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* 📜 Content Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="prose prose-lg max-w-none 
                prose-headings:font-serif prose-headings:text-[#0F2C3E] 
                prose-p:text-[#0F2C3E]/80 prose-p:leading-[1.9] prose-p:font-light
                prose-strong:text-[#0F2C3E]
                prose-a:text-[#db2777] prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[2rem]
                prose-blockquote:border-[#D4AF37] prose-blockquote:bg-[#FAF9F6] prose-blockquote:py-1"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </motion.article>

          <div className="mt-20 pt-10 border-t border-[#D4AF37]/10 text-center">
            <Sparkles size={24} className="text-[#D4AF37] mx-auto mb-6" />
            <Link href="/blog">
              <button className="border border-[#0F2C3E]/10 px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-[#0F2C3E] hover:bg-[#0F2C3E] hover:text-white transition-all">
                Discover More Narratives
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}