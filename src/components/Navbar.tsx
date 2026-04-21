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
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          
          {/* Mobile Menu */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden text-[#0F2C3E]"
          >
            <Menu size={28} />
          </button>

          {/* Larger Logo Image */}
          <Link href="/" className="relative h-16 w-44 md:h-20 md:w-36">
            <Image 
              src="/logo.png" 
              alt="SB Creation" 
              fill 
              className="object-contain"
              priority
            />
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-10 font-bold text-[12px] uppercase tracking-widest text-[#0F2C3E]/70">
            <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Home</Link>
            <Link href="/shop" className={`transition-colors ${pathname === '/shop' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Shop</Link>
            <Link href="/about" className={`transition-colors ${pathname === '/about' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Story</Link>
            <Link href="/contact" className={`transition-colors ${pathname === '/contact' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Search size={22} className="text-[#0F2C3E] cursor-pointer hover:text-[#db2777] transition-colors" />
            
            <Link href="/cart" className="hidden lg:block relative p-2">
              <ShoppingBag size={24} className="text-[#0F2C3E]" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#db2777] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* --- BOTTOM NAV (Mobile) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-100 pb-safe shadow-lg rounded-t-[2rem]">
        <div className="flex items-center justify-around h-20 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className="w-full h-full flex flex-col items-center justify-center gap-1"
              >
                <div className={`relative p-2 transition-all ${isActive ? 'text-[#db2777]' : 'text-[#0F2C3E]/40'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {mounted && item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-1 -right-1 bg-[#db2777] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-[#db2777]' : 'text-[#0F2C3E]/30'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-[300px] h-full bg-white p-10 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold text-xl text-[#0F2C3E]">Menu</span>
              <X className="text-gray-400 hover:text-black cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
            </div>
            
            <ul className="space-y-8">
              <li>
                <Link href="/about" className="text-lg font-medium text-[#0F2C3E]" onClick={() => setIsSidebarOpen(false)}>
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-lg font-medium text-[#0F2C3E]" onClick={() => setIsSidebarOpen(false)}>
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="text-lg font-medium text-[#0F2C3E]" onClick={() => setIsSidebarOpen(false)}>
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-lg font-medium text-[#0F2C3E]" onClick={() => setIsSidebarOpen(false)}>
                  Support
                </Link>
              </li>
            </ul>

            <div className="mt-20 pt-10 border-t border-gray-100">
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Handcrafted in Firozabad</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}