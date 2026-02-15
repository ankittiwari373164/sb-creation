import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-3xl">🌟</div>
              <span className="text-2xl font-bold">YUMMIGO</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium dry fruit mixes for the on-the-go generation. Smart, Healthy, Tasty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail size={20} className="text-primary-400 mt-1 flex-shrink-0" />
                <a href="mailto:founder@yummigo.in" className="text-gray-400 hover:text-primary-400">
                  founder@yummigo.in
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={20} className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">+91 XXX XXX XXXX</span>
              </li>
              <li className="flex items-start space-x-2">
  <MapPin size={20} className="text-primary-400 mt-1 flex-shrink-0" />
  <span className="text-gray-400">
    We Work Forum<br />
    16A, Cybercity, 9th Floor<br />
    Phase III, Gurugram, HR 122002
  </span>
</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} YUMMIGO by A K KASIOUS LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}