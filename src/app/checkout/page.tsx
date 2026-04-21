'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Country, State, City } from 'country-state-city' // 🌍 Global Location Data
import { motion } from 'framer-motion'
import { Truck, ShieldCheck, ArrowLeft, CreditCard, Lock, Tag } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  
  // --- Coupon States ---
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isApplying, setIsApplying] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    countryCode: '', 
    state: '',
    stateCode: '',   
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  })

  // Calculations
  const subtotal = getTotalPrice()
  const discountAmount = (subtotal * discount) / 100
  const finalTotal = subtotal - discountAmount

  // --- Coupon Logic ---
  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setIsApplying(true)
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        toast.error('Invalid or expired coupon')
        setDiscount(0)
      } else {
        setDiscount(data.discount_percent)
        toast.success(`Applied: ${data.discount_percent}% off!`)
      }
    } catch (err) {
      toast.error('Error applying coupon')
    } finally {
      setIsApplying(false)
    }
  }

  // 🔄 Handle Simple Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 🌍 Handle Country Change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value
    const selectedCountry = Country.getAllCountries().find(c => c.name === countryName)
    setFormData(prev => ({
      ...prev,
      country: countryName,
      countryCode: selectedCountry?.isoCode || '',
      state: '',
      stateCode: '',
      city: ''
    }))
  }

  // 📍 Handle State Change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value
    const selectedState = State.getStatesOfCountry(formData.countryCode).find(s => s.name === stateName)
    setFormData(prev => ({
      ...prev,
      state: stateName,
      stateCode: selectedState?.isoCode || '',
      city: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please login to place your order')
        router.push('/login'); return
      }

      // Create the order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: finalTotal, // Use final total with discount
          status: 'pending',
          shipping_address: formData,
          coupon_used: discount > 0 ? couponCode.toUpperCase() : null
        })
        .select().single()

      if (orderError) throw orderError

      // Save the items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      clearCart()
      toast.success('Order placed! Thank you for choosing SB Creation.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error('Something went wrong. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && items.length === 0) router.push('/cart')
  }, [items, loading, router])

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-[#fffdfa] py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/cart" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#db2777]">
              <ArrowLeft size={14} className="mr-2" /> Back to Cart
            </Link>
            <h1 className="text-4xl font-serif text-[#0F2C3E]">Finalize Order</h1>
            <div className="flex items-center gap-2 text-green-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* 📋 Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-8 border-b pb-4">
                    <Truck size={20} className="text-[#D4AF37]" />
                    <h2 className="text-xl font-serif text-[#0F2C3E]">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm focus:ring-1 focus:ring-[#D4AF37]" placeholder="Name of recipient" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm focus:ring-1 focus:ring-[#D4AF37]" placeholder="Mobile Number" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm focus:ring-1 focus:ring-[#D4AF37]" placeholder="ZIP/Postal Code" />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Full Address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={2} className="w-full bg-[#FAF9F6] border-none rounded-[1.5rem] py-4 px-6 text-sm focus:ring-1 focus:ring-[#D4AF37] resize-none" placeholder="House no, Street, Area..." />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Country</label>
                      <select name="country" value={formData.country} onChange={handleCountryChange} required className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none">
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">State</label>
                      <select name="state" value={formData.state} onChange={handleStateChange} required disabled={!formData.country} className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-30">
                        <option value="">Select State</option>
                        {State.getStatesOfCountry(formData.countryCode).map((s) => (
                          <option key={s.isoCode} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">City</label>
                      <select name="city" value={formData.city} onChange={handleInputChange} required disabled={!formData.state} className="w-full bg-[#FAF9F6] border-none rounded-full py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-30">
                        <option value="">Select City</option>
                        {City.getCitiesOfState(formData.countryCode, formData.stateCode).map((city) => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-serif text-[#0F2C3E] mb-6 flex items-center gap-4">
                    <CreditCard className="text-[#D4AF37]" /> Payment Method
                  </h2>
                  <label className="flex items-center p-5 border border-[#D4AF37] bg-[#FAF9F6] rounded-2xl cursor-pointer">
                    <input type="radio" checked readOnly className="mr-3" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#0F2C3E]">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-400">Pay at your door</p>
                    </div>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#0F2C3E] text-white py-5 rounded-full flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest hover:bg-[#db2777] shadow-lg disabled:opacity-50">
                  {loading ? "Confirming..." : <><Lock size={16} /> Place Order Now</>}
                </button>
              </form>
            </div>

            {/* 💰 Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0F2C3E] rounded-[2rem] p-8 sticky top-24 text-white shadow-xl">
                <h2 className="text-xl font-serif mb-8 text-[#D4AF37]">Order Summary</h2>
                
                {/* --- Coupon Input --- */}
                <div className="mb-6">
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-white/10 border-none rounded-full px-4 py-2 text-xs focus:ring-1 focus:ring-[#D4AF37] outline-none"
                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode}
                        className="bg-[#D4AF37] text-[#0F2C3E] px-4 py-2 rounded-full text-[10px] font-bold uppercase"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                   </div>
                </div>

                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                      <p className="font-bold uppercase tracking-wide truncate max-w-[60%]">{item.product.name}</p>
                      <p>₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-green-400">
                      <span>Discount ({discount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase opacity-60">Grand Total</span>
                  <span className="text-3xl font-serif text-[#D4AF37]">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}