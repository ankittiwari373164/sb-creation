"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, User, Home, Store } from "lucide-react";
import { useCartStore } from "../lib/cartStore";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Cart", href: "/cart", icon: ShoppingBag, count: totalItems },
    { name: "Profile", href: "/dashboard", icon: User },
  ];

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        {/* ⬇️ Removed lg:h-32 and reduced padding (py-2 lg:py-3) for a tighter fit */}
        <div className="container mx-auto px-4 py-2 lg:py-3 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden text-[#0F2C3E] p-1"
          >
            <Menu size={32} />
          </button>

          {/* 💎 Large Logo & Inline Brand Text */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group hover:opacity-90 transition-opacity">
            <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0">
              <Image 
                src="/logo.png" 
                alt="SB Creation Logo" 
                fill 
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            
            <div className="flex items-baseline gap-2 md:gap-3 whitespace-nowrap">
              {/* Pargrid font for SB */}
              <span 
                className="text-3xl md:text-4xl text-[#08495f] italic"
                style={{ 
                  fontFamily: '"Pargrid", sans-serif', 
                  fontWeight: 900,
                  lineHeight: '1'
                }}
              >
                SB
              </span>
              {/* Clean, wide-spaced modern font for CREATION */}
              <span 
                className="text-xl md:text-4xl text-[#db2777]"
                style={{ 
                  fontFamily: '"Montserrat", "Helvetica Neue", sans-serif', 
                  fontWeight: 600,
                  // letterSpacing: '0.1em'
                }}
              >
                CREATION
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 font-bold text-[13px] uppercase tracking-[0.2em] text-[#0F2C3E]/70">
            <Link href="/" className={`transition-colors pb-1 ${pathname === '/' ? 'text-[#db2777] border-b-2 border-[#db2777]' : 'hover:text-[#db2777]'}`}>Home</Link>
            <Link href="/shop" className={`transition-colors pb-1 ${pathname === '/shop' ? 'text-[#db2777] border-b-2 border-[#db2777]' : 'hover:text-[#db2777]'}`}>Shop</Link>
            <Link href="/wishlist" className={`transition-colors pb-1 ${pathname === '/wishlist' ? 'text-[#db2777] border-b-2 border-[#db2777]' : 'hover:text-[#db2777]'}`}>Wishlist</Link>
            <Link href="/contact" className={`transition-colors pb-1 ${pathname === '/contact' ? 'text-[#db2777] border-b-2 border-[#db2777]' : 'hover:text-[#db2777]'}`}>Contact</Link>
          </div>

          {/* Desktop Actions (Search & Cart) */}
          <div className="flex items-center gap-6">
            <button className="text-[#0F2C3E] hover:text-[#db2777] transition-colors p-2 bg-gray-50 rounded-full">
              <Search size={20} />
            </button>
            
            <Link href="/cart" className="hidden lg:flex relative p-3 bg-gray-50 hover:bg-[#fff1f2] rounded-full transition-colors group">
              <ShoppingBag size={20} className="text-[#0F2C3E] group-hover:text-[#db2777] transition-colors" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#db2777] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* --- BOTTOM NAV (Mobile) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[1.5rem]">
        <div className="flex items-center justify-around h-20 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className="w-full h-full flex flex-col items-center justify-center gap-1.5"
              >
                <div className={`relative p-2 rounded-xl transition-all ${isActive ? 'bg-[#fff1f2] text-[#db2777]' : 'text-gray-400 hover:text-[#0F2C3E]'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {mounted && item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#db2777] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-[#db2777]' : 'text-gray-400'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-[80%] max-w-[320px] h-full bg-white p-8 shadow-2xl flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
              <span className="font-serif font-bold text-2xl text-[#0F2C3E]">Menu</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-gray-50 rounded-full hover:bg-[#fff1f2] hover:text-[#db2777] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <ul className="space-y-6 flex-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Collections', href: '/shop' },
                { name: 'Wishlist', href: '/wishlist' },
                { name: 'Track Order', href: '/order-tracking' },
                { name: 'Support', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`block text-lg font-bold uppercase tracking-wider transition-colors ${pathname === link.href ? 'text-[#db2777]' : 'text-[#0F2C3E] hover:text-[#db2777]'}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 border-t border-gray-100">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#db2777]">Handcrafted in Firozabad</p>
               <p className="text-xs text-gray-400 mt-2">© SB Creation</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}