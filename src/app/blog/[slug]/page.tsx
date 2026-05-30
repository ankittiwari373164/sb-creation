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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#db2777]"></div>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h2 className="text-3xl font-serif mb-6 text-[#0F2C3E]">Story not found</h2>
      <Link href="/blog" className="text-[#db2777] font-bold border-b-2 border-[#db2777] pb-1 uppercase text-xs tracking-widest">Back to Blog</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* 🖼️ Featured Header - Tightened Spacing */}
      <section className="relative h-[50vh] min-h-[350px] w-full bg-[#F9FAFB]">
        <Image src={post.image_url || '/placeholder.jpg'} alt="" fill className="object-cover opacity-80" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="container mx-auto max-w-4xl">
            <Link href="/blog" className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-[#0F2C3E] mb-6 bg-white/90 px-5 py-2 rounded-full shadow-md hover:bg-[#db2777] hover:text-white transition-all">
              <ArrowLeft size={14} className="mr-2" /> Back to stories
            </Link>
            <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C3E] leading-tight mb-4 drop-shadow-sm">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#db2777]">
               <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-md"><Calendar size={14} /> {new Date(post.created_at).toDateString()}</div>
               <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-md"><User size={14} /> {post.author || 'SB Creation'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 Reading Content - Increased Font Size & Reduced Padding */}
      <section className="py-10 px-6">
        <div className="container mx-auto max-w-3xl">
          {post.excerpt && (
            <p className="text-2xl text-gray-500 font-light leading-relaxed mb-10 italic border-l-4 border-[#fff1f2] pl-8">
              {post.excerpt}
            </p>
          )}

          <div 
            className="prose prose-xl max-w-none 
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-light
              prose-headings:font-serif prose-headings:text-[#0F2C3E]
              prose-strong:font-bold prose-strong:text-[#0F2C3E]
              prose-img:rounded-[2.5rem] prose-img:shadow-xl prose-img:border-[8px] prose-img:border-[#FAF9F6]
              prose-a:text-[#db2777] prose-a:font-bold prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* Bottom Footer - Minimalist */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300">
              Share the heritage
            </div>
            <div className="flex gap-3">
               {['Facebook', 'WhatsApp', 'Instagram'].map(platform => (
                 <button key={platform} className="px-6 py-2.5 rounded-full bg-[#F9FAFB] text-[#0F2C3E] text-[10px] font-bold uppercase tracking-widest hover:bg-[#db2777] hover:text-white transition-all border border-gray-100 shadow-sm">
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