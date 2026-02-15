'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.log('Using sample blog posts')
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
        console.log('No blog posts in database, using samples')
        setPosts([])
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.log('Using sample blog posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Sample posts if database is empty
  const samplePosts = [
    {
      id: '1',
      title: '5 Benefits of Dry Fruits for Your Health',
      slug: 'benefits-dry-fruits',
      excerpt: 'Discover the amazing health benefits of incorporating dry fruits into your daily diet. From boosting immunity to improving heart health.',
      author: 'YUMMIGO Team',
      created_at: new Date().toISOString(),
      image_url: '/images/blog-1.jpg',
    },
    {
      id: '2',
      title: 'Best Snacks for Your Workout Routine',
      slug: 'workout-snacks',
      excerpt: 'Learn which snacks can boost your energy and help you achieve your fitness goals. Perfect nutrition for before and after workouts.',
      author: 'YUMMIGO Team',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      image_url: '/images/blog-2.jpg',
    },
    {
      id: '3',
      title: 'Healthy Snacking Tips for Busy Professionals',
      slug: 'healthy-snacking-tips',
      excerpt: 'Stay energized throughout your workday with these simple snacking strategies. Quick, nutritious, and convenient options.',
      author: 'YUMMIGO Team',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      image_url: '/images/blog-3.jpg',
    },
    {
      id: '4',
      title: 'The Ultimate Guide to Trail Mix',
      slug: 'guide-trail-mix',
      excerpt: 'Everything you need to know about trail mix - from ingredients to benefits. Create your perfect custom blend.',
      author: 'YUMMIGO Team',
      created_at: new Date(Date.now() - 259200000).toISOString(),
      image_url: '/images/blog-4.jpg',
    },
    {
      id: '5',
      title: 'Superfoods You Should Be Eating Daily',
      slug: 'superfoods-daily',
      excerpt: 'Explore the power of superfoods and how they can transform your health. Essential nutrients in every bite.',
      author: 'Nutrition Expert',
      created_at: new Date(Date.now() - 345600000).toISOString(),
      image_url: '/images/blog-5.jpg',
    },
    {
      id: '6',
      title: 'Snacking Smart: Portion Control Tips',
      slug: 'portion-control-tips',
      excerpt: 'Master the art of portion control for healthier snacking habits. Simple strategies for mindful eating.',
      author: 'YUMMIGO Team',
      created_at: new Date(Date.now() - 432000000).toISOString(),
      image_url: '/images/blog-6.jpg',
    },
  ]

  const displayPosts = posts.length > 0 ? posts : samplePosts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">YUMMIGO Blog</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Tips, recipes, and insights for healthier living. Stay updated with the latest in nutrition and wellness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {displayPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card group cursor-pointer h-full flex flex-col"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <div className="h-64 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                          📝
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Calendar size={16} className="mr-2" />
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                            <User size={16} className="ml-4 mr-2" />
                            {post.author || 'YUMMIGO Team'}
                          </div>
                          
                          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>
                          
                          <div className="text-primary-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                            Read More
                            <ArrowRight size={18} className="ml-2" />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-6">📝</div>
                  <h2 className="text-3xl font-bold mb-4">No Posts Yet</h2>
                  <p className="text-gray-600 mb-8">Check back soon for exciting content!</p>
                  <Link href="/">
                    <button className="btn-primary">Back to Home</button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Info Banner */}
          {posts.length === 0 && !loading && (
            <div className="mt-12 bg-primary-50 border-2 border-primary-200 rounded-xl p-6 text-center">
              <p className="text-primary-800">
                <strong>Note:</strong> These are sample blog posts. Create your own posts in the{' '}
                <Link href="/admin" className="underline font-bold">Admin Panel</Link> to see them here!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section (Optional) */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Get the latest health tips, recipes, and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 outline-none"
              />
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}