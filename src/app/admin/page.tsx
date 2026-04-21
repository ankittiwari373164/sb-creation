'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, Plus, Edit, Trash2, Upload, X, Crown, 
  Settings, History, Ticket, Save, CheckCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)
  
  // Data States
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  
  // UI States
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  
  // Product Form State
  const [productForm, setProductForm] = useState<any>({
    name: '', price: '', stock: '', category: 'Glass Bangle',
    description: '', image_url: '', gallery: [], 
    colors: ['#FFD700'], // Default Gold
    sizes: ['2.4', '2.6'] // Default Sizes
  })

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({ code: '', discount_percent: 10, is_active: true })

  useEffect(() => { verifyAdmin() }, [])

  const verifyAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.app_metadata?.role !== 'admin') {
      router.push('/login'); return
    }
    fetchData()
  }

  const fetchData = async () => {
    setLoading(true)
    const [p, o, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('coupons').select('*').order('created_at', { ascending: false })
    ])
    setProducts(p.data || []); setOrders(o.data || []); setCoupons(c.data || [])
    setLoading(false)
  }

  // --- 📸 Image Upload ---
  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files; if (!files) return
    setUploading(true)
    try {
      const uploadedUrls = []
      for (const file of Array.from(files)) {
        const path = `products/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('products').upload(path, file)
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }
      if (isMain) setProductForm({ ...productForm, image_url: uploadedUrls[0] })
      else setProductForm({ ...productForm, gallery: [...productForm.gallery, ...uploadedUrls] })
      toast.success('Image Uploaded')
    } catch (err) { toast.error('Upload Failed') } finally { setUploading(false) }
  }

  // --- 💾 Save Product (Create or Update) ---
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const slug = productForm.name.toLowerCase().replace(/ /g, '-')
    
    const payload = { ...productForm, slug }

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editingId)
      error = err
    } else {
      const { error: err } = await supabase.from('products').insert([payload])
      error = err
    }

    if (error) {
      toast.error('Error saving product')
    } else {
      toast.success('Product saved!')
      setShowForm(false)
      setEditingId(null)
      fetchData()
    }
    setLoading(false)
  }

  // --- 🎟️ Save Coupon ---
  const saveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('coupons').insert([couponForm])
    if (error) toast.error('Coupon exists or failed')
    else {
      toast.success('Coupon Created')
      fetchData()
    }
  }

  // --- 🗑️ Delete Helpers ---
  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else { toast.success('Deleted'); fetchData() }
  }

  if (loading && products.length === 0) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">Loading Atelier...</div>

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-[#D4AF37]/10 pb-10">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">Admin Panel</span>
            <h1 className="text-5xl font-serif text-[#0F2C3E]">Store <span className="italic font-light text-[#D4AF37]">Management</span></h1>
        </header>

        <nav className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['products', 'orders', 'coupons', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#0F2C3E] text-white shadow-lg' : 'bg-white text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </nav>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif">Items in Shop</h2>
              <button onClick={() => { setEditingId(null); setProductForm({ name: '', price: '', stock: '', category: 'Glass Bangle', description: '', image_url: '', gallery: [], colors: [], sizes: ['2.4', '2.6'] }); setShowForm(!showForm) }} className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Plus size={16}/> {showForm ? 'Cancel' : 'Add New Item'}
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form onSubmit={saveProduct} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] border border-[#D4AF37]/20 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Main Image</label>
                      <div className="relative w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                        {productForm.image_url ? <Image src={productForm.image_url} fill alt="Main" className="object-cover"/> : <Upload className="text-gray-300"/>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImages(e, true)}/>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Gallery Images</label>
                      <div className="flex flex-wrap gap-2">
                        {productForm.gallery.map((url:string, i:number) => (
                          <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={url} fill alt="Gallery" className="object-cover"/>
                          </div>
                        ))}
                        <label className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer">
                          <Plus size={14} className="text-gray-300"/><input type="file" multiple className="hidden" onChange={(e) => handleImages(e, false)}/>
                        </label>
                      </div>
                    </div>

                    {/* Sizes Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 block">Available Sizes</label>
                      <div className="flex gap-2">
                        {['2.2', '2.4', '2.6', '2.8'].map(size => (
                          <button type="button" key={size} onClick={() => productForm.sizes.includes(size) ? setProductForm({...productForm, sizes: productForm.sizes.filter((s:any)=>s!==size)}) : setProductForm({...productForm, sizes: [...productForm.sizes, size]})} className={`px-4 py-2 rounded-lg text-xs font-bold ${productForm.sizes.includes(size) ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input value={productForm.name} onChange={(e)=>setProductForm({...productForm, name: e.target.value})} placeholder="Item Name" className="w-full bg-[#FAF9F6] py-4 px-6 rounded-full outline-none text-sm" required/>
                    <div className="flex gap-4">
                      <input value={productForm.price} onChange={(e)=>setProductForm({...productForm, price: e.target.value})} placeholder="Price" className="w-1/2 bg-[#FAF9F6] py-4 px-6 rounded-full outline-none text-sm" required/>
                      <input value={productForm.stock} onChange={(e)=>setProductForm({...productForm, stock: e.target.value})} placeholder="Stock" className="w-1/2 bg-[#FAF9F6] py-4 px-6 rounded-full outline-none text-sm" required/>
                    </div>
                    <textarea value={productForm.description} onChange={(e)=>setProductForm({...productForm, description: e.target.value})} placeholder="Description" className="w-full bg-[#FAF9F6] py-4 px-6 rounded-[2rem] outline-none text-sm min-h-[100px]" required/>
                    
                    <button type="submit" className="w-full bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#db2777]">
                      {editingId ? 'Update Item' : 'Add to Shop'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden relative shadow-sm">
                      <Image src={p.image_url} fill alt={p.name} className="object-cover"/>
                    </div>
                    <div>
                      <h4 className="font-serif text-[#0F2C3E] text-lg">{p.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{p.price.toLocaleString()} • {p.stock} In Stock</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setProductForm(p); setEditingId(p.id); setShowForm(true); window.scrollTo(0,0) }} className="p-3 bg-gray-50 rounded-full text-blue-600 hover:bg-blue-50"><Edit size={16}/></button>
                    <button onClick={() => deleteItem('products', p.id)} className="p-3 bg-gray-50 rounded-full text-red-500 hover:bg-red-50"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- COUPONS TAB --- */}
        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif">Discount Coupons</h2>
            <form onSubmit={saveCoupon} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-2 block">Code</label>
                <input value={couponForm.code} onChange={(e)=>setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="SAVE20" className="w-full bg-[#FAF9F6] py-3 px-6 rounded-full outline-none text-sm uppercase"/>
              </div>
              <div className="w-32">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-2 block">Discount %</label>
                <input type="number" value={couponForm.discount_percent} onChange={(e)=>setCouponForm({...couponForm, discount_percent: parseInt(e.target.value)})} className="w-full bg-[#FAF9F6] py-3 px-6 rounded-full outline-none text-sm"/>
              </div>
              <button type="submit" className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase">Create Coupon</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-serif text-[#0F2C3E]">{c.code}</h4>
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase">{c.discount_percent}% OFF</p>
                  </div>
                  <button onClick={() => deleteItem('coupons', c.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif">Client Orders</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#D4AF37]"><History size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Order #{order.id.substring(0,8).toUpperCase()}</p>
                    <p className="font-serif text-lg">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {order.status}
                  </div>
                  <button onClick={() => window.open(`/admin/orders/${order.id}`)} className="text-[#0F2C3E]"><Save size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}