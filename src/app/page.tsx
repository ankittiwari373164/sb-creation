'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Award, Heart, ArrowRight, Star, Shield, Zap, Users, CheckCircle, Quote } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const features = [
  {
    icon: Heart,
    title: 'Premium Quality',
    description: 'Carefully selected dry fruits and nuts for maximum nutrition',
  },
  {
    icon: Award,
    title: '100% Natural',
    description: 'No artificial flavors, colors, or preservatives',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to your doorstep',
  },
  {
    icon: ShoppingBag,
    title: 'Perfect Portions',
    description: '100g packs ideal for on-the-go snacking',
  },
]

const productCategories = [
  {
    name: 'Travel Treats',
    emoji: '✈️',
    description: 'Your perfect travel companion',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'Lunch Box Trails',
    emoji: '🥗',
    description: 'Wholesome mid-day munch',
    color: 'from-green-400 to-green-600',
  },
  {
    name: 'Workout Boost',
    emoji: '💪',
    description: 'Power-packed energy mix',
    color: 'from-red-400 to-red-600',
  },
  {
    name: 'Yogic Superfoods',
    emoji: '🧘',
    description: 'Mindful and nourishing',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Festival Bliss',
    emoji: '🎉',
    description: 'Celebration in every bite',
    color: 'from-pink-400 to-pink-600',
  },
  {
    name: 'Smart Snacks',
    emoji: '🧠',
    description: 'Brain-fueling goodness',
    color: 'from-yellow-400 to-yellow-600',
  },
]

const benefits = [
  {
    icon: Zap,
    title: 'Energy Boost',
    description: 'Natural sugars and proteins provide sustained energy throughout your day',
  },
  {
    icon: Shield,
    title: 'Immunity Support',
    description: 'Rich in antioxidants and vitamins to strengthen your immune system',
  },
  {
    icon: Heart,
    title: 'Heart Health',
    description: 'Omega-3 fatty acids and healthy fats support cardiovascular wellness',
  },
  {
    icon: Award,
    title: 'Weight Management',
    description: 'High fiber content keeps you full and satisfied between meals',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Fitness Enthusiast',
    content: 'YUMMIGO Workout Boost has become my go-to pre-workout snack. The energy it provides is incredible!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Software Engineer',
    content: 'Smart Snacks keep me focused during long coding sessions. Perfect balance of taste and nutrition.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Yoga Instructor',
    content: 'Yogic Superfoods align perfectly with my holistic lifestyle. Natural, pure, and delicious!',
    rating: 5,
  },
]

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '50,000+', label: 'Orders Delivered' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '4.9/5', label: 'Average Rating' },
]

const whyChooseUs = [
  'Hot Air Roasted & 0% Oil – Healthy & Guilt-Free',
  'Premium dry fruits sourced from trusted suppliers',
  'Unique Flavours – Global Tasted, Indian Twist',
  'Convenient Small Packs – Perfect for Anytime, Anywhere',
  'No artificial preservatives, colors, or flavors',
  'Attractive Packaging – Modern & Eye-Catching',
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using empty products')
        setProducts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setProducts([])
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <span className="bg-primary-100 text-primary-700 px-6 py-2 rounded-full text-sm font-semibold">
                🌟 Healthy Snacking Made Easy
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
  <span className="block text-gray-900">YUMMIGO</span>
  <span className="block text-3xl md:text-4xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mt-2">
    POP, CRUNCH, REPEAT!
  </span>
</h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
  India's fast on-the-go generation healthy snacks. Premium dry fruits, perfectly portioned. 
  <span className="text-primary-600 font-semibold"> Hot air roasted, 0% oil, 100% natural.</span>
</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <button className="btn-primary text-lg px-8 py-4 group">
                  Shop Now
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Link>
              <Link href="/about">
                <button className="btn-outline text-lg px-8 py-4">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mb-4">
                  <feature.icon className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Signature Collection</h2>
            <p className="section-subtitle">
              Six unique blends designed for every moment of your day
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer"
              >
                <div className={`h-48 bg-gradient-to-br ${category.color} flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300`}>
                  {category.emoji}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Health Benefits</h2>
            <p className="section-subtitle">
              Discover why dry fruits and nuts are essential for your wellbeing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
                  <benefit.icon className="text-primary-600" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Explore our best-selling healthy snacks
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <button className="btn-primary text-lg px-8 py-4">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">Why Choose YUMMIGO?</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We're committed to providing you with the highest quality snacks that support your healthy lifestyle. 
                  Here's what makes us different:
                </p>
                
                <div className="space-y-4">
                  {whyChooseUs.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <p className="text-gray-700">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl h-96 flex items-center justify-center text-9xl"
              >
                🥜
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Join thousands of happy customers who've transformed their snacking habits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 relative"
              >
                <Quote className="text-primary-200 absolute top-4 right-4" size={40} />
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Getting your healthy snacks is easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Choose Your Mix', description: 'Select from our 6 signature blends tailored for different occasions', icon: '🛍️' },
              { step: '2', title: 'Place Your Order', description: 'Quick checkout with secure payment and free shipping', icon: '📦' },
              { step: '3', title: 'Enjoy & Repeat', description: 'Receive fresh snacks at your door and reorder anytime', icon: '😋' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-5xl">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Healthy Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of happy customers enjoying premium, nutritious snacks delivered to their door
            </p>
            <Link href="/shop">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}