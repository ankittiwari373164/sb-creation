'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'Travel Treats',
    stock: '',
    sku: '',
    image_url: '',
    weight: '100g',
  })
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    published: false,
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    fetchData()
  }

  const fetchData = async () => {
    try {
      const [productsData, ordersData, blogData] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      ])

      setProducts(productsData.data || [])
      setOrders(ordersData.data || [])
      setBlogPosts(blogData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      // Update form with image URL
      setProductForm(prev => ({ ...prev, image_url: publicUrl }))
      setImagePreview(publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setProductForm(prev => ({ ...prev, image_url: '' }))
    setImagePreview('')
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
        toast.success('Product updated successfully!')
      } else {
        const { error } = await supabase.from('products').insert(productData)
        if (error) throw error
        toast.success('Product created successfully!')
      }

      setShowProductForm(false)
      setEditingProduct(null)
      setImagePreview('')
      setProductForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        category: 'Travel Treats',
        stock: '',
        sku: '',
        image_url: '',
        weight: '100g',
      })
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      sku: product.sku,
      image_url: product.image_url || '',
      weight: product.weight || '100g',
    })
    setImagePreview(product.image_url || '')
    setShowProductForm(true)
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      if (error) throw error
      toast.success('Order status updated!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order')
    }
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const blogData = {
        ...blogForm,
      }

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingPost.id)
        if (error) throw error
        toast.success('Blog post updated successfully!')
      } else {
        const { error } = await supabase.from('blog_posts').insert(blogData)
        if (error) throw error
        toast.success('Blog post created successfully!')
      }

      setShowBlogForm(false)
      setEditingPost(null)
      setBlogForm({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: '',
        published: false,
      })
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      toast.success('Post deleted successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post')
    }
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setBlogForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author: post.author || '',
      published: post.published,
    })
    setShowBlogForm(true)
  }

  const stats = [
    { icon: Package, label: 'Total Products', value: products.length, color: 'text-blue-600' },
    { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'text-green-600' },
    { icon: TrendingUp, label: 'Revenue', value: `₹${orders.reduce((sum, o) => sum + o.total, 0)}`, color: 'text-purple-600' },
    { icon: Users, label: 'Customers', value: new Set(orders.map(o => o.user_id)).size, color: 'text-orange-600' },
  ]

  if (loading && products.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <stat.icon className={`${stat.color} mb-3`} size={32} />
              <h3 className="text-sm text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'products' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'orders' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex-1 py-4 px-6 font-semibold ${
                activeTab === 'blog' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-600'
              }`}
            >
              Blog
            </button>
          </div>

          <div className="p-6">
            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <button
                    onClick={() => {
                      setShowProductForm(!showProductForm)
                      setEditingProduct(null)
                      setImagePreview('')
                      setProductForm({
                        name: '',
                        slug: '',
                        description: '',
                        price: '',
                        category: 'Travel Treats',
                        stock: '',
                        sku: '',
                        image_url: '',
                        weight: '100g',
                      })
                    }}
                    className="btn-primary flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Product
                  </button>
                </div>

                {showProductForm && (
                  <form onSubmit={handleProductSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h3>
                    
                    {/* Image Upload Section */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold mb-2">Product Image</label>
                      
                      {imagePreview || productForm.image_url ? (
                        <div className="relative inline-block">
                          <Image
                            src={imagePreview || productForm.image_url}
                            alt="Product preview"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImage}
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <ImageIcon className="mx-auto text-gray-400 mb-2" size={40} />
                            <p className="text-gray-600 mb-1">
                              {uploadingImage ? 'Uploading...' : 'Click to upload product image'}
                            </p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Slug (e.g., travel-treats)"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        required
                        className="input-field"
                      />
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="input-field"
                      >
                        <option>Travel Treats</option>
                        <option>Lunch Box Trails</option>
                        <option>Workout Boost</option>
                        <option>Yogic Superfoods</option>
                        <option>Festival Bliss</option>
                        <option>Smart Snacks</option>
                      </select>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        required
                        className="input-field"
                      />

                      <input
  type="text"
  placeholder="Weight (e.g., 100g, 200g, 500g)"
  value={productForm.weight}
  onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
  required
  className="input-field"
/>
                      <textarea
                        placeholder="Description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                        className="input-field md:col-span-2"
                      />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button type="submit" className="btn-primary" disabled={uploadingImage}>
                        {editingProduct ? 'Update' : 'Create'} Product
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false)
                          setEditingProduct(null)
                          setImagePreview('')
                        }}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Image</th>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Weight</th> 
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {product.image_url && (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={50}
                                height={50}
                                className="rounded object-cover"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-gray-600">{product.sku}</div>
                          </td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">{product.weight}</td>
                          <td className="px-4 py-3">₹{product.price}</td>
                          <td className="px-4 py-3">{product.stock}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS & BLOG TABS - Keep the same as before */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <p className="font-bold text-lg">₹{order.total}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Order Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="input-field w-full md:w-auto"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Blog Posts Management</h2>
                  <button
                    onClick={() => setShowBlogForm(!showBlogForm)}
                    className="btn-primary flex items-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Post
                  </button>
                </div>

                {showBlogForm && (
                  <form onSubmit={handleBlogSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">{editingPost ? 'Edit' : 'Add'} Blog Post</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Post Title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Slug (e.g., benefits-dry-fruits)"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Author Name"
                        value={blogForm.author}
                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                        className="input-field"
                      />
                      <textarea
                        placeholder="Excerpt (Short summary)"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        rows={2}
                        className="input-field"
                      />
                      <textarea
                        placeholder="Content (HTML supported)"
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                        required
                        rows={10}
                        className="input-field"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={blogForm.published}
                          onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                          className="w-5 h-5"
                        />
                        <span className="font-semibold">Publish (make visible on website)</span>
                      </label>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button type="submit" className="btn-primary">
                        {editingPost ? 'Update' : 'Create'} Post
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBlogForm(false)
                          setEditingPost(null)
                        }}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {post.published ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Draft</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()} • {post.author || 'YUMMIGO Team'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {blogPosts.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No blog posts yet. Create your first post!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}