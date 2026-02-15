'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious snacks to get started!</p>
          <Link href="/shop">
            <button className="btn-primary">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.product.image_url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Link href={`/product/${item.product.slug}`}>
                            <h3 className="text-xl font-bold hover:text-primary-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm">{item.product.category}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ₹{item.product.price * item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{item.product.price} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-semibold">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total</span>
                      <span className="text-3xl font-bold text-primary-600">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full btn-primary text-lg py-4 group">
                    Proceed to Checkout
                    <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
                </Link>

                <Link href="/shop">
                  <button className="w-full btn-outline mt-4 py-3">
                    Continue Shopping
                  </button>
                </Link>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎉 Free shipping on all orders!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}