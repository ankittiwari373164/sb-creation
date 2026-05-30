import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/dashboard', '/wishlist'], // Hide private pages from Google
    },
    sitemap: 'https://sbcreationofficial.com/sitemap.xml',
  }
}