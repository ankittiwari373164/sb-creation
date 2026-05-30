import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'SB Creation | Handcrafted Firozabad Bangles',
  description: 'Traditional elegance from the City of Bangles. Shop Glass, Metal, and Designer bangles.',
  keywords: 'bangles, firozabad bangles, glass bangles, handcrafted bangles, bridal jewelry, SB Creation',
  metadataBase: new URL('https://sbcreationofficial.com'),
  openGraph: {
    title: 'SB Creation | Handcrafted Firozabad Bangles',
    description: 'Traditional elegance from the City of Bangles.',
    url: 'https://sbcreationofficial.com',
    siteName: 'SB Creation',
    images: [
      {
        url: '/logo.png', // This points to your floral logo in the public folder
        width: 1200,
        height: 630,
        alt: 'SB Creation Floral Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}