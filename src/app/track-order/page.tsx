'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
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
      toast.error('Order not found. Please check your order ID.')
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
        description: 'Your order has been received and is being processed',
      },
      processing: {
        icon: Package,
        label: 'Processing',
        color: 'text-yellow-600',
        description: 'We are preparing your order for shipment',
      },
      shipped: {
        icon: Truck,
        label: 'Shipped',
        color: 'text-purple-600',
        description: 'Your order is on its way',
      },
      delivered: {
        icon: CheckCircle,
        label: 'Delivered',
        color: 'text-green-600',
        description: 'Your order has been delivered',
      },
      cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-red-600',
        description: 'This order has been cancelled',
      },
    }
    return statusMap[status] || statusMap.pending
  }

  const statusInfo = order ? getStatusInfo(order.status) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">Track Your Order</h1>
            <p className="text-xl text-gray-700">
              Enter your order ID to see the current status
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleTrack} className="bg-white rounded-xl shadow-md p-8 mb-8">
              <label className="block text-lg font-semibold mb-4">
                Enter Order ID
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., 12345678"
                  required
                  className="flex-1 input-field"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    'Searching...'
                  ) : (
                    <>
                      <Search size={20} className="mr-2" />
                      Track
                    </>
                  )}
                </button>
              </div>
            </form>

            {order && statusInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <div className="text-center mb-8">
                  <statusInfo.icon className={`mx-auto ${statusInfo.color} mb-4`} size={64} />
                  <h2 className="text-3xl font-bold mb-2">{statusInfo.label}</h2>
                  <p className="text-gray-600">{statusInfo.description}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-xl mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold">{order.id.substring(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-primary-600 text-xl">
                        ₹{order.total}
                      </span>
                    </div>
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="border-t mt-6 pt-6">
                    <h3 className="font-bold text-xl mb-4">Shipping Address</h3>
                    <div className="text-gray-700">
                      <p className="font-semibold">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                      </p>
                      <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                    </div>
                  </div>
                )}

                {/* Order Timeline */}
                <div className="border-t mt-6 pt-6">
                  <h3 className="font-bold text-xl mb-6">Order Timeline</h3>
                  <div className="space-y-4">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const info = getStatusInfo(status)
                      const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                      const isCurrent = order.status === status
                      
                      return (
                        <div key={status} className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isCurrent ? (
                              <info.icon size={20} />
                            ) : isActive ? (
                              <CheckCircle size={20} />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-current" />
                            )}
                          </div>
                          <div className="ml-4">
                            <p className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                              {info.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-gray-600">{info.description}</p>
                            )}
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