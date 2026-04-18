import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'SB Creation | Handcrafted Firozabad Bangles',
  description: 'Traditional elegance from the City of Bangles. Shop Glass, Metal, and Designer bangles.',
  keywords: 'healthy snacks, dry fruits, nuts, trail mix, workout snacks, travel snacks',
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