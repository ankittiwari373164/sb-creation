'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Upload, X, Settings, History, 
  Ticket, BookOpen, Save, Users, Package, ShoppingBag,
  ExternalLink, CheckCircle, Search, LayoutDashboard, User, RefreshCcw, LogOut
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
    } catch (err) {
      console.error(err)
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
        const path = `${field}/${Date.now()}-${file.name.replace(/\s/g, '_')}`
        const { error: uploadError } = await supabase.storage.from('products').upload(path, file)
        if (uploadError) throw uploadError
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
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Generate slug
      const slug = productForm.name
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

      // 2. Generate a unique SKU (This fixes your error!)
      // It takes 'SBC-' + the last 5 digits of the current time
      const autoSku = productForm.sku || `SBC-${Date.now().toString().slice(-5)}`;

      // 3. Clean payload
      const cleanPayload = {
        name: String(productForm.name).trim(),
        price: parseFloat(productForm.price) || 0,
        stock: parseInt(productForm.stock) || 0,
        category: String(productForm.category || 'Bangles'),
        description: String(productForm.description || ''),
        image_url: String(productForm.image_url || ''),
        slug: slug,
        sku: autoSku, // ⬅️ Adding the SKU here
        sizes: Array.isArray(productForm.sizes) ? productForm.sizes : [],
        colors: Array.isArray(productForm.colors) ? productForm.colors : [],
        gallery: Array.isArray(productForm.gallery) ? productForm.gallery : []
      };

      console.log("Saving item with SKU:", autoSku);

      let response;
      if (editingId) {
        response = await supabase
          .from('products')
          .update(cleanPayload)
          .eq('id', editingId);
      } else {
        response = await supabase
          .from('products')
          .insert([cleanPayload]);
      }

      if (response.error) {
        console.error("Supabase Error:", response.error);
        toast.error(`Database Error: ${response.error.message}`);
      } else {
        toast.success(editingId ? 'Product Updated' : 'Product Added');
        resetProductForm();
        fetchData();
      }
    } catch (err: any) {
      console.error("Logic Error:", err);
      toast.error("Code error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({ name: '', price: '', stock: '', category: 'Bangles', description: '', image_url: '', gallery: [], colors: [], sizes: ['2.4', '2.6'] })
    setShowProductForm(false)
    setEditingId(null)
  }

  const editProduct = (p: any) => {
    setProductForm({
      ...p,
      price: p.price.toString(),
      stock: p.stock.toString()
    })
    setEditingId(p.id)
    setShowProductForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- 💾 Blog Actions ---
  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = blogForm.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
    const { error } = await supabase.from('blog_posts').insert([{ ...blogForm, slug, author: 'Admin', published: true }])
    if (error) {
      console.error(error)
      toast.error('Error saving blog')
    } else {
      toast.success('Blog Posted')
      setBlogForm({ title: '', content: '', excerpt: '', image_url: '', category: 'Style Guide' })
      setShowBlogForm(false)
      fetchData()
    }
  }

  // --- 🎫 Coupon Actions ---
  const saveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('coupons').insert([{ ...couponForm, code: couponForm.code.toUpperCase() }])
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
      <RefreshCcw className="animate-spin text-[#D4AF37]" size={40} />
      <p className="font-serif text-[#0F2C3E]">Opening Shop Registry...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
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
             <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="px-6 py-3 rounded-full border border-red-100 text-red-500 text-[10px] font-bold uppercase hover:bg-red-50 transition-all flex items-center gap-2"><LogOut size={14}/> Logout</button>
             <Link href="/" className="px-6 py-3 rounded-full bg-[#FAF9F6] text-[#0F2C3E] text-[10px] font-bold uppercase flex items-center gap-2">View Shop <ExternalLink size={14}/></Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'products', icon: ShoppingBag, label: 'Inventory' },
            { id: 'orders', icon: Package, label: 'Orders' },
            { id: 'coupons', icon: Ticket, label: 'Coupons' },
            { id: 'blog', icon: BookOpen, label: 'Journal' },
            { id: 'customers', icon: Users, label: 'Customers' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setShowProductForm(false); setShowBlogForm(false); }} 
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
                <button onClick={() => { setEditingId(null); setShowProductForm(!showProductForm); }} className="bg-[#D4AF37] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase whitespace-nowrap shadow-lg transition-all hover:bg-[#0F2C3E]">
                  {showProductForm ? 'Cancel' : '+ Add Product'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showProductForm && (
                <motion.form onSubmit={saveProduct} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-xl grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Main Image</label>
                        <div className="relative aspect-square bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                           {productForm.image_url ? <Image src={productForm.image_url} fill alt="" className="object-cover" /> : <Upload className="text-gray-300" />}
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'main')} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Gallery Showcase</label>
                        <div className="grid grid-cols-2 gap-2">
                           <label className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                             <Plus className="text-gray-300" />
                             <input type="file" multiple className="hidden" onChange={e => handleFileUpload(e, 'gallery')} />
                           </label>
                           {productForm.gallery?.map((u: string, i: number) => (
                             <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                               <Image src={u} fill alt="" className="object-cover" />
                               <button type="button" onClick={() => setProductForm({...productForm, gallery: productForm.gallery.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={8}/></button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Available Sizes</label>
                      <div className="flex gap-2">
                        {['2.2', '2.4', '2.6', '2.8'].map(s => (
                          <button key={s} type="button" onClick={() => setProductForm({ ...productForm, sizes: productForm.sizes?.includes(s) ? productForm.sizes.filter((z:any)=>z!==s) : [...(productForm.sizes || []), s]})} className={`px-5 py-3 rounded-xl text-[10px] font-bold transition-all ${productForm.sizes?.includes(s) ? 'bg-[#0F2C3E] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none text-sm font-medium" required placeholder="Jewelry Name" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none" required placeholder="Price (₹)" />
                      <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none" required placeholder="Stock Count" />
                    </div>
                    <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-[#FAF9F6] p-8 rounded-[2rem] outline-none min-h-[150px] resize-none" required placeholder="Describe the craftsmanship..." />
                    <button type="submit" disabled={uploading} className="w-full bg-[#db2777] text-white py-5 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-[#0F2C3E] transition-all disabled:opacity-50">
                      {editingId ? 'Update Masterpiece' : 'Publish to Shop'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#FAF9F6] rounded-2xl overflow-hidden relative shadow-inner">
                       <Image src={p.image_url || '/placeholder.jpg'} fill alt="" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F2C3E]">{p.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{p.price} • {p.stock} units</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
            <h2 className="text-2xl font-serif text-[#0F2C3E]">Order Logs</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-[#D4AF37]/30">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#FAF9F6] rounded-2xl flex items-center justify-center text-[#D4AF37]"><History size={24}/></div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{order.id.substring(0,8).toUpperCase()}</p><p className="text-xl font-serif text-[#0F2C3E]">₹{order.total.toLocaleString()}</p></div>
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

        {/* --- 🎟️ COUPONS TAB --- */}
        {activeTab === 'coupons' && (
          <div className="space-y-10">
            <h2 className="text-2xl font-serif text-[#0F2C3E]">Promotions</h2>
            <form onSubmit={saveCoupon} className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-wrap gap-6 items-end shadow-xl">
              <div className="flex-1 min-w-[250px] space-y-3"><label className="text-[10px] font-bold uppercase text-gray-400 ml-5">Coupon Code</label><input value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="SAVE20" className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none font-bold text-sm uppercase" required /></div>
              <div className="w-40 space-y-3"><label className="text-[10px] font-bold uppercase text-gray-400 ml-5">Discount %</label><input type="number" value={couponForm.discount_percent} onChange={e => setCouponForm({...couponForm, discount_percent: parseInt(e.target.value)})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none font-bold text-sm" required /></div>
              <button type="submit" className="bg-[#0F2C3E] text-white px-12 py-5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#db2777] transition-all">Activate</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coupons.map(c => <div key={c.id} className="bg-white p-8 rounded-[3rem] border flex justify-between items-center shadow-sm relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-5"><Ticket size={60} /></div><div className="z-10"><h4 className="text-2xl font-serif text-[#0F2C3E]">{c.code}</h4><p className="text-[10px] text-[#db2777] font-bold uppercase tracking-widest">{c.discount_percent}% Discount Active</p></div><button onClick={() => deleteItem('coupons', c.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all z-10"><Trash2 size={18}/></button></div>)}
            </div>
          </div>
        )}

        {/* --- 📝 BLOG TAB --- */}
        {activeTab === 'blog' && (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-[#0F2C3E]">Store Journal</h2>
              <button onClick={() => setShowBlogForm(!showBlogForm)} className="bg-[#0F2C3E] text-white px-10 py-4 rounded-full text-[11px] font-bold uppercase shadow-lg">{showBlogForm ? 'Close' : 'New Story'}</button>
            </div>
            {showBlogForm && (
              <form onSubmit={saveBlog} className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 space-y-8">
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <input placeholder="Title of Story" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none border focus:border-[#D4AF37]" required />
                      <input placeholder="Short Intro (Excerpt)" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full bg-[#FAF9F6] p-5 rounded-full outline-none" required />
                      <div className="relative h-40 bg-[#FAF9F6] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                        {blogForm.image_url ? <Image src={blogForm.image_url} fill alt="" className="object-cover" /> : <div className="text-center text-gray-300"><Upload className="mx-auto mb-2"/><p className="text-[10px] font-bold uppercase">Cover Artwork</p></div>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'blog')} />
                      </div>
                   </div>
                   <textarea placeholder="Write Story content (HTML supported)..." value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-[#FAF9F6] p-8 rounded-[2.5rem] outline-none min-h-[350px] resize-none" required />
                </div>
                <button type="submit" className="w-full bg-[#0F2C3E] text-white py-5 rounded-full uppercase font-bold text-[11px] tracking-[0.3em] shadow-xl hover:bg-[#db2777]">Publish Story</button>
              </form>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {blogs.map(b => (
                <div key={b.id} className="bg-white p-6 rounded-[3rem] border border-gray-100 flex items-center gap-6 shadow-sm group hover:border-[#D4AF37]/30 transition-all">
                  <div className="w-24 h-24 bg-[#FAF9F6] rounded-[1.5rem] overflow-hidden relative shadow-inner"><Image src={b.image_url || '/placeholder.jpg'} fill alt="" className="object-cover" /></div>
                  <div className="flex-1"><h4 className="font-bold text-[#0F2C3E] leading-tight line-clamp-2">{b.title}</h4><p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{b.category}</p></div>
                  <button onClick={() => deleteItem('blog_posts', b.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 👥 CUSTOMERS TAB --- */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customers.map(c => {
               const userOrders = orders.filter(o => o.user_id === c.id)
               const spent = userOrders.reduce((acc, curr) => acc + curr.total, 0)
               return (
                <div key={c.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative group overflow-hidden transition-all hover:border-[#D4AF37]/30">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#D4AF37] shadow-inner font-serif text-3xl font-bold">{c.full_name?.charAt(0) || 'M'}</div>
                    <div><h4 className="font-bold text-[#0F2C3E] text-lg">{c.full_name || 'Member'}</h4><p className="text-[10px] text-gray-400 font-bold uppercase">Joined {new Date(c.created_at).toLocaleDateString()}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t pt-8">
                     <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Orders</p><p className="font-serif text-2xl text-[#0F2C3E]">{userOrders.length}</p></div>
                     <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Spent</p><p className="font-serif text-2xl text-[#0F2C3E]">₹{spent.toLocaleString()}</p></div>
                  </div>
                </div>
               )
            })}
          </div>
        )}

      </div>
    </div>
  )
}