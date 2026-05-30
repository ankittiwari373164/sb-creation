'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Country, State, City } from 'country-state-city'
import { motion } from 'framer-motion'
import { Truck, ShieldCheck, ArrowLeft, CreditCard, Lock, Tag } from 'lucide-react'
import { useCartStore } from '../../lib/cartStore'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart, coupon } = useCartStore()
  const [loading, setLoading] = useState(false)

  const [couponCode, setCouponCode] = useState(coupon?.code || '')
  const [discount, setDiscount] = useState(coupon?.discount_percent || 0)
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

  const subtotal = getTotalPrice()
  const discountAmount = (subtotal * discount) / 100
  const finalTotal = subtotal - discountAmount

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: finalTotal,
          status: 'pending',
          shipping_address: formData,
          coupon_used: discount > 0 ? couponCode.toUpperCase() : null
        })
        .select().single()

      if (orderError) throw orderError

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

  /* ── shared input classes ── */
  const inputCls = "w-full bg-[#F8C8DC]/10 border border-[#D4AF37]/50 rounded-full py-3 px-5 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans"
  const selectCls = "w-full bg-[#F8C8DC]/10 border border-[#D4AF37]/50 rounded-full py-3 px-5 text-sm text-[#2d2416] outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] appearance-none cursor-pointer font-sans"
  const labelCls = "text-xs font-bold uppercase tracking-widest text-[#0F5A7E] ml-1 font-sans"

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 gap-3 md:gap-6">
            <Link
              href="/cart"
              className="flex items-center text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#d92b7a] transition-colors"
            >
              <ArrowLeft size={14} className="mr-2" /> Back to Bag
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif text-[#2d2416]">
              Finalize <span className="italic font-semibold text-[#d92b7a]">Order</span>
            </h1>
            <div className="flex items-center gap-2 text-[#0F5A7E]">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Verified Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

            {/* ── Form Section ── */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-[#D4AF37]/40 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/30 pb-4">
                    <Truck size={18} className="text-[#0F5A7E]" />
                    <h2 className="text-xl font-serif text-[#2d2416]">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

                    <div className="md:col-span-2 space-y-1.5">
                      <label className={labelCls}>Full Name</label>
                      <input
                        type="text" name="fullName" value={formData.fullName}
                        onChange={handleInputChange} required
                        className={inputCls} placeholder="Name of recipient"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls}>Phone</label>
                      <input
                        type="tel" name="phone" value={formData.phone}
                        onChange={handleInputChange} required
                        className={inputCls} placeholder="Mobile Number"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls}>Pincode</label>
                      <input
                        type="text" name="pincode" value={formData.pincode}
                        onChange={handleInputChange} required
                        className={inputCls} placeholder="ZIP / Postal Code"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className={labelCls}>Full Address</label>
                      <textarea
                        name="address" value={formData.address}
                        onChange={handleInputChange} required rows={2}
                        className="w-full bg-[#F8C8DC]/10 border border-[#D4AF37]/50 rounded-2xl py-3 px-5 text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] resize-none outline-none font-sans"
                        placeholder="House no, Street, Area..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls}>Country</label>
                      <select
                        name="country" value={formData.country}
                        onChange={handleCountryChange} required
                        className={selectCls}
                      >
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelCls}>State</label>
                      <select
                        name="state" value={formData.state}
                        onChange={handleStateChange} required
                        disabled={!formData.country}
                        className={`${selectCls} disabled:opacity-40`}
                      >
                        <option value="">Select State</option>
                        {State.getStatesOfCountry(formData.countryCode).map((s) => (
                          <option key={s.isoCode} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className={labelCls}>City</label>
                      <select
                        name="city" value={formData.city}
                        onChange={handleInputChange} required
                        disabled={!formData.state}
                        className={`${selectCls} disabled:opacity-40`}
                      >
                        <option value="">Select City</option>
                        {City.getCitiesOfState(formData.countryCode, formData.stateCode).map((city) => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-8 border border-[#D4AF37]/40 shadow-sm">
                  <h2 className="text-xl font-serif text-[#2d2416] mb-5 flex items-center gap-3">
                    <CreditCard size={18} className="text-[#0F5A7E]" /> Payment Method
                  </h2>
                  <label className="flex items-center p-4 md:p-5 border border-[#D4AF37]/50 bg-[#F8C8DC]/10 rounded-xl md:rounded-2xl cursor-pointer hover:bg-[#F8C8DC]/20 transition-all">
                    <input type="radio" checked readOnly className="mr-3 accent-[#d92b7a]" />
                    <div>
                      <p className="text-sm font-bold text-[#2d2416] font-sans">Cash on Delivery</p>
                      <p className="text-xs text-[#5a4a42] font-sans mt-0.5">Pay upon delivery — no advance required</p>
                    </div>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2d2416] text-white py-4 rounded-full flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#0F5A7E] shadow-lg disabled:opacity-50 transition-all font-sans"
                >
                  {loading ? 'Confirming...' : <><Lock size={14} /> Place Order Now</>}
                </button>

              </form>
            </div>

            {/* ── Summary Sidebar ── */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-7 sticky top-24 border border-[#D4AF37]/50 shadow-md">
                <h2 className="text-xl font-serif mb-5 text-[#2d2416]">
                  Order <span className="italic text-[#d92b7a]">Summary</span>
                </h2>

                {/* Coupon Input */}
                <div className="mb-5 p-4 bg-[#F8C8DC]/10 rounded-xl border border-[#F8C8DC]/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F5A7E] mb-2 font-sans flex items-center gap-1.5">
                    <Tag size={11} /> Apply Coupon
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white border border-[#D4AF37]/50 rounded-full px-4 py-2 text-sm text-[#2d2416] placeholder-[#5a4a42]/40 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode}
                      className="bg-[#2d2416] text-white px-4 py-2 rounded-full text-xs font-bold uppercase transition-all hover:bg-[#0F5A7E] shrink-0 font-sans disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Item List */}
                <div className="space-y-3 mb-5 max-h-[280px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm border-b border-[#D4AF37]/20 pb-2.5">
                      <p className="font-semibold text-[#2d2416] truncate max-w-[60%] font-sans">{item.product.name}</p>
                      <p className="text-[#5a4a42] font-sans">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm text-[#5a4a42] font-sans">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2d2416]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm font-bold text-[#d92b7a] font-sans">
                      <span>Discount ({discount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-[#5a4a42]">Shipping</span>
                    <span className="text-[#0F5A7E] font-bold">Free</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/40 flex justify-between items-end">
                  <span className="text-sm font-bold uppercase tracking-wide text-[#5a4a42] font-sans">Total</span>
                  <span className="text-2xl md:text-3xl font-serif text-[#2d2416]">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}