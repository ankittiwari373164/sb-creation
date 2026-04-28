import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sbcreationofficial.com'

  // These are your core, static pages
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
    priority: route === '' ? 1 : 0.8, // Homepage gets highest priority (1.0)
  }))

  return [...staticRoutes]
}