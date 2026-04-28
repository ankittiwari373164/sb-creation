import { MetadataRoute } from 'next'
import { supabase } from '../lib/supabase' // Make sure this path points to your Supabase client

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sbcreationofficial.com'

  // 1. Define your Static Pages
  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/track-order',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Fetch all Dynamic Products from Supabase
  // Note: Change 'products' and 'slug' if your database table/columns are named differently
  const { data: products, error } = await supabase
    .from('products')
    .select('slug, updated_at') // We only need the slug to build the URL

  if (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // 3. Map the products to the sitemap format
  const productRoutes = products?.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    // If your DB has an updated_at column, use it. Otherwise, fallback to today's date.
    lastModified: product.updated_at ? new Date(product.updated_at).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Give products a high priority for SEO!
  })) || []

  // 4. Combine and return both arrays
  return [...staticRoutes, ...productRoutes]
}