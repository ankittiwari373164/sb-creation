'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      
      if (data) {
        setOrder(data)
      } else {
        toast.error('Order not found')
      }
    } catch (error) {
      toast.error('We could not find that order. Please check the ID.')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { icon: any; label: string; color: string; description: string }> = {
      pending: {
        icon: Package,
        label: 'Order Placed',
        color: 'text-blue-600',
        description: 'We have received your order.',
      },
      processing: {
        icon: Package,
        label: 'Preparing',
        color: 'text-yellow-600',
        description: 'We are getting your jewelry ready for shipping.',
      },
      shipped: {
        icon: Truck,
        label: 'On the Way',
        color: 'text-purple-600',
        description: 'Your package is out for delivery.',
      },
      delivered: {
        icon: CheckCircle,
        label: 'Delivered',
        color: 'text-green-600',
        description: 'Your order has arrived!',
      },
      cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-red-600',
        description: 'This order was cancelled.',
      },
    }
    return statusMap[status] || statusMap.pending
  }

  const statusInfo = order ? getStatusInfo(order.status) : null

  return (
    <div className="min-h-screen bg-[#fffdfa]">
      {/* Header Section */}
      <section className="bg-[#0F2C3E] py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-serif mb-4">Track Your Order</h1>
            <p className="text-lg opacity-70">
              Enter your Order ID to see where your jewelry is.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* Search Box */}
            <form onSubmit={handleTrack} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8">
              <label className="block text-sm font-bold uppercase tracking-widest text-[#0F2C3E] mb-4">
                Your Order ID
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Paste your ID here..."
                  required
                  className="flex-1 bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0F2C3E] text-white px-8 py-4 rounded-full flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-[#db2777] transition-all disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Track Now'}
                </button>
              </div>
            </form>

            {/* Results Section */}
            {order && statusInfo && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10">
                <div className="text-center mb-10">
                  <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gray-50 ${statusInfo.color} mb-6`}>
                    <statusInfo.icon size={40} />
                  </div>
                  <h2 className="text-3xl font-serif text-[#0F2C3E] mb-2">{statusInfo.label}</h2>
                  <p className="text-gray-500">{statusInfo.description}</p>
                </div>

                <div className="border-t border-gray-50 pt-8 space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-[#0F2C3E] mb-2">Order Details</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Order ID</span>
                    <span className="font-bold">#{order.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Price</span>
                    <span className="font-bold text-[#db2777]">₹{order.total}</span>
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="border-t border-gray-50 mt-8 pt-8">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-[#0F2C3E] mb-4">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-bold text-[#0F2C3E]">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                      <p className="pt-2">Phone: {order.shipping_address.phone}</p>
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="border-t border-gray-50 mt-8 pt-8">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-[#0F2C3E] mb-6">Delivery Steps</h3>
                  <div className="space-y-6">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const info = getStatusInfo(status)
                      const isFinished = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                      const isCurrent = order.status === status
                      
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isFinished ? 'bg-[#0F2C3E] text-white' : 'bg-gray-100 text-gray-300'
                          }`}>
                            {isFinished && !isCurrent ? <CheckCircle size={20} /> : <info.icon size={20} />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isFinished ? 'text-[#0F2C3E]' : 'text-gray-300'}`}>
                              {info.label}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}