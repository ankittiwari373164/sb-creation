'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
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
      console.log('Post not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Post not found</h2>
          <Link href="/blog">
            <button className="btn-primary">Back to Blog</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar size={18} className="mr-2" />
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              <User size={18} className="ml-6 mr-2" />
              {post.author || 'YUMMIGO Team'}
            </div>
            
            <h1 className="text-5xl font-bold mb-6">{post.title}</h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12"
          >
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </motion.article>

          {/* Related Posts Section (Optional) */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <Link href="/blog">
                <button className="btn-outline">
                  View All Posts
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}