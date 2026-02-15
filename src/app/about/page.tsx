'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Award, Users } from 'lucide-react'

export default function AboutPage() {
  const values = [
    { icon: Heart, title: 'Quality First', description: 'Premium ingredients sourced with care' },
    { icon: Target, title: 'Health Focus', description: '100% natural with no preservatives' },
    { icon: Award, title: 'Excellence', description: 'Committed to the highest standards' },
    { icon: Users, title: 'Customer Love', description: 'Your satisfaction is our priority' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-bold mb-6">About YUMMIGO</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Healthy snacking for the on-the-go generation. We're on a mission to make nutritious snacking 
              accessible, delicious, and convenient for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
  <h2 className="text-4xl font-bold mb-6">Our Story</h2>
  <p className="text-gray-700 leading-relaxed mb-4">
    A K KASIOUS LLP is an Assam-based diversified company with an established presence 
    in hospitality, construction, and property development. Built on strong business 
    fundamentals and regional expertise, the company stands for quality, reliability, and trust.
  </p>
  <p className="text-gray-700 leading-relaxed mb-4">
    As part of its growth journey, A K KASIOUS LLP has diversified into the FMCG space, 
    introducing YUMMIGO – a range of healthy, dry fruits-based snacks for today's 
    health-conscious consumers.
  </p>
  <p className="text-gray-700 leading-relaxed">
    Our focus is on premium ingredients, hot air roasted with 0% oil, hygienic processing, 
    and great taste – making nutritious snacking convenient and enjoyable for modern India.
  </p>
</div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl h-96"></div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 text-center"
              >
                <value.icon className="mx-auto text-primary-600 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}