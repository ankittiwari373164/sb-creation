'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Clock, Share2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (!error) setPost(data)
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fffdfa] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]"></div>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-serif mb-6">Page not found</h2>
      <Link href="/blog" className="text-[#db2777] font-bold border-b border-[#db2777] pb-1">Back to Blog</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fffdfa] pb-24">
      {/* 🖼️ Featured Header */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-[#0F2C3E]">
        <Image src={post.image_url || '/placeholder.jpg'} alt="" fill className="object-cover opacity-60" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fffdfa] to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E] mb-8 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
              <ArrowLeft size={14} className="mr-2" /> Back
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E]/60">
               <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.created_at).toDateString()}</div>
               <div className="flex items-center gap-2"><User size={14} /> {post.author || 'SB Creation'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 Reading Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          {post.excerpt && (
            <p className="text-xl text-gray-500 font-light leading-relaxed mb-12 italic border-l-4 border-[#D4AF37] pl-8">
              {post.excerpt}
            </p>
          )}

          <div 
            className="prose prose-lg max-w-none 
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-light
              prose-headings:font-serif prose-headings:text-[#0F2C3E]
              prose-strong:font-bold prose-strong:text-[#0F2C3E]
              prose-img:rounded-[2rem] prose-img:shadow-lg
              prose-a:text-[#db2777] prose-a:font-bold"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* Bottom Footer */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Share this story
            </div>
            <div className="flex gap-4">
               {['Facebook', 'WhatsApp', 'Instagram'].map(platform => (
                 <button key={platform} className="px-6 py-2 rounded-full bg-[#FAF9F6] text-[9px] font-bold uppercase tracking-widest hover:bg-[#0F2C3E] hover:text-white transition-all">
                   {platform}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}