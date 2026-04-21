'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Upload, X, Settings, History, 
  Ticket, BookOpen, Save, Users, Package, ShoppingBag,
  ExternalLink, CheckCircle, Search, LayoutDashboard, User
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState(true)
  
  // --- Data States ---
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  
  // --- UI States ---
  const [showProductForm, setShowProductForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // --- Form States ---
  const [productForm, setProductForm] = useState<any>({
    name: '', price: '', stock: '', category: 'Glass Bangle',
    description: '', image_url: '', gallery: [], colors: [], sizes: ['2.4', '2.6']
  })

  const [blogForm, setBlogForm] = useState({
    title: '', content: '', excerpt: '', image_url: '', category: 'Style Guide'
  })

  const [couponForm, setCouponForm] = useState({ code: '', discount_percent: 10 })

  // --- 🔐 Security & Auth ---
  useEffect(() => { verifyAdmin() }, [])

  const verifyAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.app_metadata?.role !== 'admin') {
      toast.error("Access Denied")
      router.push('/login'); return
    }
    fetchData()
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [p, o, c, b, cust] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
      ])
      setProducts(p.data || [])
      setOrders(o.data || [])
      setCoupons(c.data || [])
      setBlogs(b.data || [])
      setCustomers(cust.data || [])
    } finally {
      setLoading(false)
    }
  }

  // --- 📸 Image Handling ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'main' | 'gallery' | 'blog') => {
    const files = e.target.files; if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploadedUrls = []
      for (const file of Array.from(files)) {
        const path = `${field}/${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('products').upload(path, file)
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }

      if (field === 'main') setProductForm({ ...productForm, image_url: uploadedUrls[0] })
      if (field === 'gallery') setProductForm({ ...productForm, gallery: [...(productForm.gallery || []), ...uploadedUrls] })
      if (field === 'blog') setBlogForm({ ...blogForm, image_url: uploadedUrls[0] })
      
      toast.success('Upload complete')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // --- 💾 Product Actions ---
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = productForm.name.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    const payload = { ...productForm, slug, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) }

    const { error } = editingId 
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert([payload])

    if (error) {
      toast.error('Save failed. Check database columns.')
    } else {
      toast.success('Product Saved')
      resetProductForm()
      fetchData()
    }
  }

  const resetProductForm = () => {
    setProductForm({ name: '', price: '', stock: '', category: 'Bangles', description: '', image_url: '', gallery: [], colors: [], sizes: ['2.4', '2.6'] })
    setShowProductForm(false)
    setEditingId(null)
  }

  const editProduct = (p: any) => {
    setProductForm(p)
    setEditingId(p.id)
    setShowProductForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- 💾 Blog Actions ---
  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = blogForm.title.toLowerCase().replace(/ /g, '-')
    const { error } = await supabase.from('blog_posts').insert([{ ...blogForm, slug }])
    if (error) toast.error('Error saving blog')
    else {
      toast.success('Blog Posted')
      setBlogForm({ title: '', content: '', excerpt: '', image_url: '', category: 'Style Guide' })
      setShowBlogForm(false)
      fetchData()
    }
  }

  // --- 🎫 Coupon Actions ---
  const saveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('coupons').insert([couponForm])
    if (error) toast.error('Error creating coupon')
    else {
      toast.success('Coupon Active')
      setCouponForm({ code: '', discount_percent: 10 })
      fetchData()
    }
  }

  // --- 🗑️ Delete Helper ---
  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Delete this item permanently?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) {
      toast.success('Deleted')
      fetchData()
    }
  }

  if (loading && products.length === 0) return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#0F2C3E] border-t-[#D4AF37] rounded-full animate-spin"></div>
      <p className="font-serif text-[#0F2C3E]">Opening Shop Registry...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#0F2C3E] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-xl">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-[#0F2C3E]">Dashboard</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Management Control</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="px-6 py-3 rounded-full border border-red-100 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50">Logout</button>
             <Link href="/" className="px-6 py-3 rounded-full bg-[#FAF9F6] text-[#0F2C3E] text-[10px] font-bold uppercase flex items-center gap-2">View Shop <ExternalLink size={14}/></Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'products', icon: ShoppingBag, label: 'Products' },
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'coupons', icon: Ticket, label: 'Coupons' },
            { id: 'blog', icon: BookOpen, label: 'Blog' },
            { id: 'customers', icon: Users, label: 'Customers' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap
              ${activeTab === tab.id ? 'bg-[#0F2C3E] text-white shadow-lg scale-105' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>

        {/* --- 📦 PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-serif text-[#0F2C3E]">Manage Inventory</h2>
              <div className="flex gap-4 w-full md:w-auto">
                <input 
                  placeholder="Search products..." 
                  className="bg-white px-6 py-3 rounded-full border border-gray-100 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] flex-1"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => { setEditingId(null); setShowProductForm(!showProductForm); }} className="bg-[#D4AF37] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase whitespace-nowrap shadow-lg">
                  {showProductForm ? 'Close' : '+ Add Product'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showProductForm && (
                <motion.form onSubmit={saveProduct} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    {/* Image Uploads */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Main Image</label>
                        <div className="relative aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                           {productForm.image_url ? <Image src={productForm.image_url} fill alt="" className="object-cover" /> : <Upload className="text-gray-300" />}
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'main')} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Gallery ({productForm.gallery?.length || 0})</label>
                        <div className="grid grid-cols-2 gap-2">
                           <label className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                             <Plus className="text-gray-300" />
                             <input type="file" multiple className="hidden" onChange={e => handleFileUpload(e, 'gallery')} />
                           </label>
                           {productForm.gallery?.slice(0, 3).map((u: string, i: number) => (
                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                               <Image src={u} fill alt="" className="object-cover" />
                               <button type="button" onClick={() => setProductForm({...productForm, gallery: productForm.gallery.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={8}/></button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Available Sizes</label>
                      <div className="flex gap-2">
                        {['2.2', '2.4', '2.6', '2.8'].map(s => (
                          <button 
                            type="button" 
                            key={s} 
                            onClick={() => {
                              const current = productForm.sizes || []
                              setProductForm({ ...productForm, sizes: current.includes(s) ? current.filter((z:any)=>z!==s) : [...current, s]})
                            }}
                            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${productForm.sizes?.includes(s) ? 'bg-[#0F2C3E] text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Product Name</label>
                      <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-[#FAF9F6] p-4 rounded-full outline-none border border-transparent focus:border-[#D4AF37]" required placeholder="Enter name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Price (₹)</label>
                        <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-[#FAF9F6] p-4 rounded-full outline-none" required placeholder="0.00" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Stock</label>
                        <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-[#FAF9F6] p-4 rounded-full outline-none" required placeholder="Quantity" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-4">Description</label>
                      <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-[#FAF9F6] p-6 rounded-[2rem] outline-none min-h-[120px]" required placeholder="Describe the craftsmanship..." />
                    </div>

                    <button type="submit" disabled={uploading} className="w-full bg-[#0F2C3E] text-white py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-[#db2777] transition-all disabled:opacity-50">
                      {editingId ? 'Update Product' : 'Add to Shop'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Product List */}
            <div className="grid grid-cols-1 gap-4">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <div key={p.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl relative overflow-hidden shadow-inner">
                       <Image src={p.image_url || '/placeholder.jpg'} fill alt="" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F2C3E]">{p.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{p.price} • {p.stock} units</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editProduct(p)} className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><Edit size={16}/></button>
                    <button onClick={() => deleteItem('products', p.id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 📦 ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-[#0F2C3E]">Client Orders</h2>
            {orders.length === 0 ? <p className="text-center py-20 text-gray-400">No orders placed yet.</p> : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-[#FAF9F6] rounded-2xl flex items-center justify-center text-[#D4AF37]"><History size={24}/></div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Order #{order.id.substring(0,8).toUpperCase()}</p>
                        <p className="text-xl font-serif text-[#0F2C3E]">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                       <div className="text-center md:text-right px-6 border-r border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Customer</p>
                          <p className="text-xs font-bold text-[#0F2C3E]">{order.shipping_address?.fullName || 'Anonymous'}</p>
                       </div>
                       <select 
                        defaultValue={order.status} 
                        onChange={async (e) => {
                          const { error } = await supabase.from('orders').update({ status: e.target.value }).eq('id', order.id)
                          if (!error) toast.success('Status Updated')
                        }}
                        className="bg-[#FAF9F6] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none border-none"
                       >
                         <option value="pending">Pending</option>
                         <option value="processing">Processing</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                       </select>
                       <button onClick={() => deleteItem('orders', order.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- 🎟️ COUPONS TAB --- */}
        {activeTab === 'coupons' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-[#0F2C3E]">Discount Codes</h2>
            <form onSubmit={saveCoupon} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-wrap gap-4 items-end shadow-sm">
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-4 block">Code</label>
                <input value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="SAVE20" className="w-full bg-[#FAF9F6] py-4 px-8 rounded-full outline-none text-sm font-bold" required />
              </div>
              <div className="w-40 space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-4 block">Discount %</label>
                <input type="number" value={couponForm.discount_percent} onChange={e => setCouponForm({...couponForm, discount_percent: parseInt(e.target.value)})} className="w-full bg-[#FAF9F6] py-4 px-8 rounded-full outline-none text-sm font-bold" required />
              </div>
              <button type="submit" className="bg-[#0F2C3E] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase shadow-lg">Create Code</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coupons.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="text-2xl font-serif text-[#0F2C3E]">{c.code}</h4>
                    <p className="text-[10px] font-bold text-[#db2777] uppercase">{c.discount_percent}% Discount</p>
                  </div>
                  <button onClick={() => deleteItem('coupons', c.id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 📝 BLOG TAB --- */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-[#0F2C3E]">The Journal Editor</h2>
              <button onClick={() => setShowBlogForm(!showBlogForm)} className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {showBlogForm ? 'Cancel' : 'New Story'}
              </button>
            </div>

            {showBlogForm && (
              <form onSubmit={saveBlog} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6 border border-gray-100">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input placeholder="Story Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-[#FAF9F6] p-4 rounded-full outline-none border focus:border-[#D4AF37]" required />
                    <input placeholder="Short Excerpt" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full bg-[#FAF9F6] p-4 rounded-full outline-none" required />
                    <div className="relative h-40 bg-[#FAF9F6] rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                      {blogForm.image_url ? <Image src={blogForm.image_url} fill alt="" className="object-cover" /> : <div className="text-center"><Upload className="mx-auto text-gray-300"/><p className="text-[10px] text-gray-400 mt-2 uppercase font-bold">Cover Photo</p></div>}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'blog')} />
                    </div>
                  </div>
                  <textarea placeholder="Write your content here (HTML supported)..." value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-[#FAF9F6] p-8 rounded-[2rem] outline-none min-h-[300px]" required />
                </div>
                <button type="submit" className="bg-[#0F2C3E] text-white px-12 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-xl">Publish to Journal</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {blogs.map(b => (
                 <div key={b.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center gap-6 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden relative">
                     <Image src={b.image_url || '/placeholder.jpg'} fill alt="" className="object-cover" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-[#0F2C3E] line-clamp-1">{b.title}</h4>
                     <p className="text-[10px] text-gray-400 uppercase font-bold">{b.category}</p>
                   </div>
                   <button onClick={() => deleteItem('blog_posts', b.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- 👥 CUSTOMERS TAB --- */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-[#0F2C3E]">Member Registry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {customers.map(c => (
                 <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#D4AF37]"><User size={24}/></div>
                       <div>
                         <h4 className="font-bold text-[#0F2C3E]">{c.full_name || 'Anonymous Member'}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(c.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-500">
                       <p className="flex items-center gap-2"><History size={14}/> Orders: {orders.filter(o => o.user_id === c.id).length}</p>
                       <p className="flex items-center gap-2"><ShoppingBag size={14}/> Spent: ₹{orders.filter(o => o.user_id === c.id).reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}