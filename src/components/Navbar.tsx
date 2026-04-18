"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, User, Home, Store } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Connect to your actual Cart Store
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Cart", href: "/cart", icon: ShoppingBag, count: totalItems },
    { name: "Account", href: "/dashboard", icon: User },
  ];

  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D4AF37]/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden text-[#0F2C3E]"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter uppercase text-[#db2777]">
              SB <span className="text-[#0F2C3E]">Creation</span>
            </span>
            <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] -mt-1">
              Firozabad
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10 font-bold text-[11px] uppercase tracking-[0.2em] text-[#0F2C3E]/70">
            <Link href="/" className={`transition-colors ${pathname === '/' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Home</Link>
            <Link href="/shop" className={`transition-colors ${pathname === '/shop' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Shop</Link>
            <Link href="/about" className={`transition-colors ${pathname === '/about' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Heritage</Link>
            <Link href="/contact" className={`transition-colors ${pathname === '/contact' ? 'text-[#db2777]' : 'hover:text-[#db2777]'}`}>Concierge</Link>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-5">
            <Search size={20} className="text-[#0F2C3E] cursor-pointer hover:text-[#db2777] transition-colors" />
            
            <Link href="/cart" className="hidden lg:block relative p-2">
              <ShoppingBag size={22} className="text-[#0F2C3E]" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#db2777] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
        <div className="flex items-center justify-around h-20 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className="w-full h-full flex flex-col items-center justify-center gap-1 transition-all duration-300"
              >
                <div className={`relative p-2 rounded-2xl transition-all ${isActive ? 'text-[#db2777]' : 'text-[#0F2C3E]/40'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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

      {/* --- SIDEBAR DRAWER --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-[300px] h-full bg-[#fffdfa] p-10 shadow-2xl animate-in slide-in-from-left duration-500" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-2xl font-bold text-[#0F2C3E]">Menu</span>
              <X className="text-[#0F2C3E]/40 hover:text-[#db2777] cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
            </div>
            
            <ul className="space-y-8">
              <li>
                <Link href="/about" className="text-xl font-serif italic text-[#0F2C3E] hover:text-[#db2777]" onClick={() => setIsSidebarOpen(false)}>
                  The Firozabad Legacy
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-xl font-serif italic text-[#0F2C3E] hover:text-[#db2777]" onClick={() => setIsSidebarOpen(false)}>
                  Luxury Collections
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="text-xl font-serif italic text-[#0F2C3E] hover:text-[#db2777]" onClick={() => setIsSidebarOpen(false)}>
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xl font-serif italic text-[#0F2C3E] hover:text-[#db2777]" onClick={() => setIsSidebarOpen(false)}>
                  Concierge Support
                </Link>
              </li>
            </ul>

            <div className="mt-20 pt-10 border-t border-gray-100">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Premium Artisanship Since 1994</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}