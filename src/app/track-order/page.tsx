'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  // Auto-track if ?id= is passed from dashboard
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setOrderId(id)
      trackOrder(id)
    }
  }, [])

  const trackOrder = async (idToSearch: string) => {
    const trimmed = idToSearch.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      // Try full UUID match first
      let { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))')
        .eq('id', trimmed)
        .maybeSingle()

      // If not found, try matching by short ID prefix (first 8 chars)
      if (!data && trimmed.length <= 8) {
        const upper = trimmed.toUpperCase()
        const { data: allOrders } = await supabase
          .from('orders')
          .select('*, order_items(*, products(name, image_url))')
          .order('created_at', { ascending: false })
          .limit(200)
        data = (allOrders || []).find((o: any) => o.id.substring(0, 8).toUpperCase() === upper) || null
      }

      if (data) {
        setOrder(data)
      } else {
        toast.error('Order not found. Check your Order ID.')
        setOrder(null)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    await trackOrder(orderId)
  }

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { icon: any; label: string; color: string; bg: string; description: string }> = {
      pending: {
        icon: Package,
        label: 'Order Placed',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        description: 'We have received your order.',
      },
      processing: {
        icon: Package,
        label: 'Preparing',
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        description: 'We are getting your jewelry ready.',
      },
      shipped: {
        icon: Truck,
        label: 'On the Way',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        description: 'Your package is out for delivery.',
      },
      delivered: {
        icon: CheckCircle,
        label: 'Delivered',
        color: 'text-green-600',
        bg: 'bg-green-50',
        description: 'Your order has arrived!',
      },
      cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-red-600',
        bg: 'bg-red-50',
        description: 'This order was cancelled.',
      },
    }
    return statusMap[status] || statusMap.pending
  }

  const statusInfo = order ? getStatusInfo(order.status) : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Pink Aesthetic */}
      <section className="bg-[#fff1f2] py-12 md:py-16 overflow-hidden relative">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#db2777] text-[10px] font-bold tracking-[0.5em] uppercase mb-3 block">
              Order Status
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-4">Track Your <span className="italic text-[#db2777]">Order</span></h1>
            <div className="w-16 h-[1px] bg-[#db2777] mx-auto opacity-20" />
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px]" />
      </section>

      <section className="py-10 md:py-14">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* Search Box */}
            <form onSubmit={handleTrack} className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-6 md:p-8 mb-8">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 ml-4">
                Enter Order ID
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Paste ID here..."
                  required
                  className="flex-1 bg-[#F9FAFB] border-none rounded-full py-3 px-6 text-sm text-[#0F2C3E] outline-none focus:ring-1 focus:ring-[#db2777] transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-[#db2777] transition-all disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Searching...' : 'Track Now'}
                </button>
              </div>
            </form>

            {/* Results Section */}
            {order && statusInfo && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-10">
                {/* Status Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center ${statusInfo.bg} ${statusInfo.color} mb-4 shadow-sm`}>
                    <statusInfo.icon size={32} />
                  </div>
                  <h2 className="text-3xl font-serif text-[#0F2C3E] mb-1">{statusInfo.label}</h2>
                  <p className="text-gray-400 text-sm font-light">{statusInfo.description}</p>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-3xl p-6 mb-6 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase tracking-widest font-bold">Order ID</span>
                    <span className="font-bold text-[#0F2C3E]">#{order.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase tracking-widest font-bold">Date</span>
                    <span className="font-bold text-[#0F2C3E]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase tracking-widest font-bold">Payment</span>
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${order.payment_method === 'cod' ? 'bg-blue-50 text-blue-600' : order.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                      {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_status === 'paid' ? '✓ Paid Online' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
                    <span className="text-gray-400 uppercase tracking-widest font-bold">Total</span>
                    <span className="font-serif text-lg text-[#db2777]">₹{(order.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Order Items */}
                {order.order_items?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Items Ordered</h3>
                    <div className="space-y-3">
                      {order.order_items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-[#fff1f2]/40 rounded-2xl border border-[#db2777]/10">
                          {item.products?.image_url && (
                            <img src={item.products.image_url} alt={item.products?.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#0F2C3E] truncate">{item.products?.name || 'Product'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-serif text-[#0F2C3E] shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="mb-8 p-5 bg-gray-50 rounded-3xl">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Delivery Address</h3>
                    <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
                      <p className="font-bold text-[#0F2C3E]">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address}</p>
                      <p>{order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ''} {order.shipping_address.pincode}</p>
                      <p>{order.shipping_address.country}</p>
                      {order.shipping_address.phone && <p className="text-[#db2777] font-medium">📞 {order.shipping_address.phone}</p>}
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="border-t border-gray-50 pt-8">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Delivery Timeline</h3>
                  <div className="space-y-5">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const info = getStatusInfo(status)
                      const isFinished = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index
                      const isCurrent = order.status === status
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isFinished ? 'bg-[#0F2C3E] text-white shadow-md' : 'bg-gray-100 text-gray-300'
                          }`}>
                            {isFinished && !isCurrent ? <CheckCircle size={16} /> : <info.icon size={16} />}
                          </div>
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-widest ${isFinished ? 'text-[#0F2C3E]' : 'text-gray-300'}`}>
                              {info.label}
                            </p>
                            {isCurrent && <p className="text-[10px] text-[#db2777] font-medium mt-0.5">{info.description}</p>}
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