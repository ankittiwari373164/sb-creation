import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'YUMMIGO - Healthy Snacking for the On-the-Go Generation',
  description: 'Premium dry fruit mixes offering perfect balance of taste, nutrition, and convenience. Shop our six signature SKUs for every moment of your day.',
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