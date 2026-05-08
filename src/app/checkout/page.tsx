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
  // Pulling coupon data from store
  const { items, getTotalPrice, clearCart, coupon } = useCartStore()
  const [loading, setLoading] = useState(false)
  
  // Initializing local states from store data
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
          total: finalTotal, 
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
    <div className="min-h-screen bg-[#F5E9DC] py-6 md:py-12 px-4 md:px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-3 md:gap-6">
            <Link href="/cart" className="flex items-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#F8C8DC] transition-colors">
              <ArrowLeft size={12} className="md:w-[14px] md:h-[14px] mr-2" /> Back to Bag
            </Link>
            <h1 className="text-2xl md:text-4xl font-serif text-[#2d2416]">Finalize <span className="italic text-[#D4AF37]">Order</span></h1>
            <div className="flex items-center gap-2 text-[#0F5A7E]">
              <ShieldCheck size={14} className="md:w-[18px] md:h-[18px]" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Verified Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* 📋 Form Section */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                
                <div className="bg-[#FFFFFF] rounded-xl md:rounded-[2rem] p-4 md:p-8 border-2 border-[#D4AF37] shadow-sm">
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 border-b-2 border-[#D4AF37] pb-3 md:pb-4">
                    <Truck size={16} className="md:w-5 md:h-5 text-[#D4AF37]" />
                    <h2 className="text-lg md:text-xl font-serif text-[#2d2416]">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans" placeholder="Name of recipient" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans" placeholder="Mobile Number" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans" placeholder="ZIP/Postal Code" />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">Full Address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={2} className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-2xl md:rounded-[1.5rem] py-3 md:py-4 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] placeholder-[#5a4a42]/50 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] resize-none outline-none font-sans" placeholder="House no, Street, Area..." />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">Country</label>
                      <select name="country" value={formData.country} onChange={handleCountryChange} required className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] appearance-none cursor-pointer font-sans">
                        <option value="">Select Country</option>
                        {Country.getAllCountries().map((c) => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">State</label>
                      <select name="state" value={formData.state} onChange={handleStateChange} required disabled={!formData.country} className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] disabled:opacity-50 cursor-pointer font-sans">
                        <option value="">Select State</option>
                        {State.getStatesOfCountry(formData.countryCode).map((s) => (
                          <option key={s.isoCode} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[8px] md:text-[10px] font-bold uppercase text-[#D4AF37] ml-3 md:ml-4 font-sans">City</label>
                      <select name="city" value={formData.city} onChange={handleInputChange} required disabled={!formData.state} className="w-full bg-[#F5E9DC] border-2 border-[#D4AF37] rounded-full py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-sm text-[#2d2416] outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] disabled:opacity-50 cursor-pointer font-sans">
                        <option value="">Select City</option>
                        {City.getCitiesOfState(formData.countryCode, formData.stateCode).map((city) => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] rounded-xl md:rounded-[2rem] p-4 md:p-8 border-2 border-[#D4AF37] shadow-sm">
                  <h2 className="text-lg md:text-xl font-serif text-[#2d2416] mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                    <CreditCard size={16} className="md:w-5 md:h-5 text-[#D4AF37]" /> Payment Method
                  </h2>
                  <label className="flex items-center p-3 md:p-5 border-2 border-[#D4AF37] bg-[#FFFFF0] rounded-xl md:rounded-2xl cursor-pointer hover:bg-[#F5E9DC] transition-all">
                    <input type="radio" checked readOnly className="mr-2 md:mr-3 accent-[#D4AF37]" />
                    <div>
                      <p className="text-[9px] md:text-xs font-bold uppercase text-[#2d2416] font-sans">Cash on Delivery</p>
                      <p className="text-[8px] md:text-[10px] text-[#5a4a42] font-sans">Pay upon delivery</p>
                    </div>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-[#2d2416] py-3 md:py-4 rounded-full flex items-center justify-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F8C8DC] shadow-lg disabled:opacity-50 transition-all font-sans">
                  {loading ? "Confirming..." : <><Lock size={14} className="md:w-4 md:h-4" /> Place Order Now</>}
                </button>
              </form>
            </div>

            {/* 💰 Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[#FFFFFF] rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 sticky top-24 border-2 border-[#D4AF37] shadow-lg">
                <h2 className="text-lg md:text-xl font-serif mb-4 md:mb-6 text-[#D4AF37]">Summary</h2>
                
                {/* --- Coupon Input --- */}
                <div className="mb-6 p-3 md:p-4 bg-[#F5E9DC] rounded-xl md:rounded-2xl border-2 border-[#D4AF37]">
                   <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Apply Coupon</p>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-full px-3 md:px-4 py-1.5 md:py-2 text-[11px] md:text-xs text-[#2d2416] placeholder-[#5a4a42]/40 focus:ring-2 focus:ring-[#F8C8DC] focus:border-[#F8C8DC] outline-none font-sans"
                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode}
                        className="bg-[#D4AF37] text-[#2d2416] px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[8px] md:text-[9px] font-bold uppercase transition-all hover:bg-[#F8C8DC] shrink-0 font-sans disabled:opacity-50"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                   </div>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 max-h-[300px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-[10px] md:text-xs border-b border-[#D4AF37]/20 pb-2 md:pb-3">
                      <p className="font-bold text-[#2d2416] truncate max-w-[60%] font-sans">{item.product.name}</p>
                      <p className="text-[#5a4a42] font-sans">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between text-[10px] md:text-[11px] uppercase tracking-wide text-[#5a4a42] font-sans">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[10px] md:text-[11px] uppercase tracking-wide text-[#D4AF37] font-bold font-sans">
                      <span>Discount ({discount}%)</span>
                      <span>- ₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] md:text-[11px] uppercase tracking-wide font-sans">
                    <span className="text-[#5a4a42]">Shipping</span>
                    <span className="text-[#0F5A7E] font-bold">Free</span>
                  </div>
                </div>

                <div className="pt-4 md:pt-6 border-t-2 border-[#D4AF37] flex justify-between items-end">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase text-[#5a4a42] font-sans">Total</span>
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