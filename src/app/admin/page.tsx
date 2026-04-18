'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, ShoppingCart, Users, TrendingUp, Plus, Edit, 
  Trash2, Upload, X, Crown, ChevronRight, Sparkles, 
  Search, Eye, Settings, Image as ImageIcon, History
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
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  
  // UI States
  const [showProductForm, setShowProductForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Multi-Image Form State
  const [productForm, setProductForm] = useState<any>({
    name: '', price: '', stock: '', category: 'Glass Heritage',
    description: '', sku: '', image_url: '', gallery: []
  })

  useEffect(() => { verifyAdmin() }, [])

  const verifyAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.app_metadata?.role !== 'admin') {
      router.push('/login'); return
    }
    fetchData()
  }

  const fetchData = async () => {
    try {
      const [p, o, b, c] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false })
      ])
      setProducts(p.data || []); setOrders(o.data || []); 
      setBlogPosts(b.data || []); setCustomers(c.data || [])
    } finally { setLoading(false) }
  }

  // --- 📸 MULTI-IMAGE GALLERY LOGIC ---
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
      else setProductForm({ ...productForm, gallery: [...productForm.gallery, ...uploadedUrls].slice(0, 5) })
      toast.success('Visuals Secured')
    } catch (err) { toast.error('Upload Failed') } finally { setUploading(false) }
  }

  if (loading) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center italic text-[#0F2C3E]/40">Accessing Archives...</div>

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-[#D4AF37]/10 pb-10">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">Executive Control</span>
            <h1 className="text-5xl font-serif text-[#0F2C3E]">Admin <span className="italic font-light">Atelier</span></h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('settings')} className="p-4 bg-white rounded-full text-[#0F2C3E] shadow-sm hover:bg-[#0F2C3E] hover:text-white transition-all"><Settings size={20}/></button>
          </div>
        </header>

        {/* 🏛️ Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['products', 'orders', 'patrons', 'journal', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#0F2C3E] text-white' : 'bg-white text-gray-400 hover:text-[#0F2C3E]'}`}>
              {tab === 'journal' ? 'The Journal' : tab}
            </button>
          ))}
        </div>

        {/* 🏺 PRODUCT MANAGEMENT WITH MULTI-IMAGE */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif">Artifact Inventory</h2>
              <button onClick={() => setShowProductForm(!showProductForm)} className="bg-[#D4AF37] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Plus size={16}/> {showProductForm ? 'Close Form' : 'New Artifact'}
              </button>
            </div>

            <AnimatePresence>
              {showProductForm && (
                <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white p-10 rounded-[3rem] border border-[#D4AF37]/20 mb-10 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Visual Manager */}
                    <div className="space-y-6">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Master Cover</label>
                       <div className="relative aspect-square w-full max-w-[200px] bg-[#FAF9F6] rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                          {productForm.image_url ? <Image src={productForm.image_url} fill alt="Main" className="object-cover"/> : <Upload className="text-gray-300"/>}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImages(e, true)}/>
                       </div>
                       
                       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gallery Showcase ({productForm.gallery.length}/5)</label>
                       <div className="flex flex-wrap gap-4">
                          {productForm.gallery.map((url:string, i:number) => (
                            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                              <Image src={url} fill alt="Gallery" className="object-cover"/>
                              <button onClick={() => setProductForm({...productForm, gallery: productForm.gallery.filter((_:any,idx:number)=>idx!==i)})} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1"><X size={10}/></button>
                            </div>
                          ))}
                          <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50"><Plus size={16} className="text-gray-300"/><input type="file" multiple className="hidden" onChange={(e) => handleImages(e, false)}/></label>
                       </div>
                    </div>
                    {/* Details Manager */}
                    <div className="grid grid-cols-1 gap-4">
                      <input placeholder="Artifact Name" className="bg-[#FAF9F6] rounded-full py-4 px-8 text-sm outline-none" onChange={(e)=>setProductForm({...productForm, name: e.target.value})}/>
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Price (INR)" className="bg-[#FAF9F6] rounded-full py-4 px-8 text-sm outline-none"/>
                        <input placeholder="Stock" className="bg-[#FAF9F6] rounded-full py-4 px-8 text-sm outline-none"/>
                      </div>
                      <textarea placeholder="The Narrative (Description)" className="bg-[#FAF9F6] rounded-[2rem] p-8 text-sm outline-none" rows={4}/>
                      <button className="bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em]">Seal into Archives</button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-3xl flex items-center justify-between border border-gray-50 hover:border-[#D4AF37]/20 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#FAF9F6] rounded-2xl overflow-hidden relative shadow-sm">
                      <Image src={p.image_url} fill alt={p.name} className="object-cover"/>
                    </div>
                    <div>
                      <h4 className="font-serif text-[#0F2C3E] text-lg">{p.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.category} • {p.stock} Units</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-3 bg-[#FAF9F6] rounded-full text-[#0F2C3E] hover:bg-[#D4AF37] hover:text-white"><Edit size={16}/></button>
                    <button className="p-3 bg-[#FAF9F6] rounded-full text-red-400 hover:bg-red-50"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 👑 PATRON MANAGEMENT (CRM) */}
        {activeTab === 'patrons' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-serif mb-8">Patron Registry</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {customers.map(patron => {
                const patronOrders = orders.filter(o => o.user_id === patron.id);
                return (
                  <div key={patron.id} className="bg-white p-10 rounded-[3rem] border border-gray-50 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <h3 className="text-2xl font-serif text-[#0F2C3E]">{patron.full_name}</h3>
                          <p className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase mt-1">Acquisitions: {patronOrders.length}</p>
                       </div>
                       <Users className="text-gray-100 group-hover:text-[#D4AF37]/20 transition-colors" size={48} />
                    </div>
                    
                    {/* Order History Preview */}
                    <div className="space-y-3">
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Acquisition History</p>
                       {patronOrders.length > 0 ? patronOrders.slice(0,2).map(o => (
                         <div key={o.id} className="flex justify-between items-center text-xs">
                           <span className="text-gray-500 font-medium">#{o.id.substring(0,8).toUpperCase()}</span>
                           <span className="font-serif text-[#0F2C3E]">₹{o.total.toLocaleString()}</span>
                         </div>
                       )) : <p className="text-[10px] italic text-gray-300">No transactions recorded.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 📦 ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-2xl font-serif mb-8">Acquisition Logs</h2>
            {orders.map(order => (
              <div key={order.id} className="bg-white p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-50 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#FAF9F6] rounded-2xl flex items-center justify-center text-[#D4AF37]"><History size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Acquisition #{order.id.substring(0,8).toUpperCase()}</p>
                    <p className="font-serif text-[#0F2C3E] text-xl">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <select defaultValue={order.status} className="bg-[#FAF9F6] border-none rounded-full py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-[#0F2C3E] outline-none">
                      <option value="pending">Atelier Processing</option>
                      <option value="shipped">Dispatched</option>
                      <option value="delivered">Delivered</option>
                   </select>
                   <button className="p-3 bg-gray-50 rounded-full text-[#D4AF37] hover:bg-[#0F2C3E] hover:text-white transition-all"><Eye size={18}/></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 📝 JOURNAL (BLOG) MANAGEMENT */}
        {activeTab === 'journal' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-serif">The Journal Editor</h2>
                <button className="bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">Compose Narrative</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {blogPosts.map(post => (
                  <div key={post.id} className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center group">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-gray-50 rounded-3xl overflow-hidden relative"><ImageIcon size={24} className="m-auto text-gray-200" /></div>
                       <div>
                          <h4 className="text-xl font-serif text-[#0F2C3E]">{post.title}</h4>
                          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{post.published ? 'Public Release' : 'Draft Narrative'}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-[#FAF9F6] rounded-full text-[#0F2C3E]"><Edit size={16}/></button>
                       <button className="p-3 bg-red-50 rounded-full text-red-400"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
           </motion.div>
        )}

        {/* ⚙️ PROFILE SETTINGS */}
        {activeTab === 'settings' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center py-20">
              <div className="w-24 h-24 bg-[#0F2C3E] rounded-full mx-auto mb-8 flex items-center justify-center text-[#D4AF37] shadow-2xl">
                 <Crown size={40} strokeWidth={1}/>
              </div>
              <h2 className="text-3xl font-serif text-[#0F2C3E] mb-2">Master Profile</h2>
              <p className="text-[10px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase mb-12">Security Level: Administrative</p>
              
              <div className="bg-white p-12 rounded-[3rem] shadow-sm space-y-6 text-left border border-gray-50">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4 mb-2 block">Display Name</label>
                    <input value="Ankit Tiwari" className="w-full bg-[#FAF9F6] py-4 px-8 rounded-full border-none outline-none text-sm font-medium"/>
                 </div>
                 <button className="w-full bg-[#0F2C3E] text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mt-8">Update Master Credentials</button>
                 <button onClick={() => supabase.auth.signOut()} className="w-full text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 hover:text-red-600">Secure Sign Out</button>
              </div>
           </motion.div>
        )}
      </div>
    </div>
  )
}