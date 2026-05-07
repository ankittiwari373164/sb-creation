"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, User, Home, Store, Heart } from "lucide-react";
import { useCartStore } from "../lib/cartStore";
import { supabase } from "../lib/supabase";


export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);

    const fetchWishlistCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from('wishlist')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setWishlistCount(count || 0);
      }
    };

    fetchWishlistCount();

  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Store },
    { name: "Cart", href: "/cart", icon: ShoppingBag, count: totalItems },
    { name: "Wishlist", href: "/wishlist", icon: Heart, count: wishlistCount },
    { name: "Profile", href: "/dashboard", icon: User },
  ];


  return (
    <>
      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-[#F5E9DC] via-[#FBF6F0] to-[#F8F4EF] backdrop-blur-md border-b-2 border-[#D4AF37]/30 shadow-lg">
        {/* ⬇️ Premium padding for luxury feel */}
        <div className="container mx-auto px-4 py-3 lg:py-2 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-[#2C2C2C] p-1 hover:text-[#D4AF37] transition-colors"
          >
            <Menu size={32} />
          </button>

          {/* 💎 Large Logo & Inline Brand Text */}
          <Link href="/" className="flex items-center gap-3 md:gap-4 group hover:opacity-90 transition-opacity">
            <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 drop-shadow-lg">
              <Image
                src="/logo.png"
                alt="SB Creation Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 font-poppins text-[13px] font-semibold uppercase tracking-[0.15em] text-[#4A4A4A]">
            <Link 
              href="/" 
              className={`transition-all duration-300 pb-2 border-b-2 relative group ${
                pathname === '/' 
                  ? 'text-[#F8C8DC] border-b-[#F8C8DC]' 
                  : 'border-b-transparent hover:text-[#D4AF37]'
              }`}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Shop Dropdown */}
            <div className="relative group">
              <Link 
                href="/shop" 
                className={`transition-all duration-300 pb-2 border-b-2 flex items-center gap-2 ${
                  pathname.startsWith('/shop') 
                    ? 'text-[#F8C8DC] border-b-[#F8C8DC]' 
                    : 'border-b-transparent hover:text-[#D4AF37]'
                }`}
              >
                Shop
                <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
              
              {/* Dropdown Menu - Luxury Style */}
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50 border-t-4 border-[#D4AF37]">
                <Link 
                  href="/category/glass-bangles" 
                  className="block px-6 py-3 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] hover:bg-[#F5E9DC] transition-all duration-200 border-l-3 border-transparent hover:border-l-[#D4AF37]"
                >
                  Glass Bangles
                </Link>
                <Link 
                  href="/category/metal-bangles-kadas" 
                  className="block px-6 py-3 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] hover:bg-[#F5E9DC] transition-all duration-200 border-l-3 border-transparent hover:border-l-[#D4AF37]"
                >
                  Metal Bangles/Kadas
                </Link>
                <Link 
                  href="/category/bangles-box" 
                  className="block px-6 py-3 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] hover:bg-[#F5E9DC] transition-all duration-200 border-l-3 border-transparent hover:border-l-[#D4AF37]"
                >
                  Bangles Box
                </Link>
                <Link 
                  href="/category/bangle-sets" 
                  className="block px-6 py-3 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] hover:bg-[#F5E9DC] transition-all duration-200 border-l-3 border-transparent hover:border-l-[#D4AF37]"
                >
                  Bangle Sets
                </Link>
                <Link 
                  href="/category/bracelets-watches" 
                  className="block px-6 py-3 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] hover:bg-[#F5E9DC] transition-all duration-200 border-l-3 border-transparent hover:border-l-[#D4AF37]"
                >
                  Bracelets & Watches
                </Link>
              </div>
            </div>

            {/* Customize */}
            <button 
              onClick={() => setShowWhatsAppModal(true)} 
              className="transition-all duration-300 pb-2 border-b-2 border-transparent hover:text-[#D4AF37] hover:border-b-[#F8C8DC] font-poppins text-[13px] font-semibold uppercase tracking-[0.15em] text-[#4A4A4A]"
            >
              Customize
            </button>

            {/* Size Guide */}
            <Link 
              href="/size-guide" 
              className={`transition-all duration-300 pb-2 border-b-2 ${
                pathname === '/size-guide' 
                  ? 'text-[#F8C8DC] border-b-[#F8C8DC]' 
                  : 'border-b-transparent hover:text-[#D4AF37] hover:border-b-[#F8C8DC]'
              }`}
            >
              Size Guide
            </Link>

            <Link 
              href="/contact" 
              className={`transition-all duration-300 pb-2 border-b-2 ${
                pathname === '/contact' 
                  ? 'text-[#F8C8DC] border-b-[#F8C8DC]' 
                  : 'border-b-transparent hover:text-[#D4AF37] hover:border-b-[#F8C8DC]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Actions (Search & Cart) */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-[#4A4A4A] hover:text-[#D4AF37] transition-colors duration-300 p-3 bg-[#F5E9DC]/60 hover:bg-[#F8C8DC]/40 rounded-full border border-[#D4AF37]/20">
              <Search size={20} />
            </button>

            <Link 
              href="/wishlist" 
              className="hidden lg:flex relative p-3 bg-[#F5E9DC]/60 hover:bg-[#F8C8DC]/40 rounded-full transition-all duration-300 group border border-[#D4AF37]/20"
            >
              <Heart size={20} className="text-[#4A4A4A] group-hover:text-[#F8C8DC] transition-colors duration-300" />

              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link 
              href="/cart" 
              className="hidden lg:flex relative p-3 bg-[#F5E9DC]/60 hover:bg-[#F8C8DC]/40 rounded-full transition-all duration-300 group border border-[#D4AF37]/20"
            >
              <ShoppingBag size={20} className="text-[#4A4A4A] group-hover:text-[#F8C8DC] transition-colors duration-300" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* --- BOTTOM NAV (Mobile) --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-gradient-to-t from-[#F5E9DC] to-[#FBF6F0] border-t-2 border-[#D4AF37]/30 pb-safe shadow-2xl rounded-t-3xl">
        <div className="flex items-center justify-around h-24 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="w-full h-full flex flex-col items-center justify-center gap-1.5"
              >
                <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#F8C8DC] to-[#F5E9DC] text-[#D4AF37] shadow-lg' 
                    : 'text-[#999] hover:text-[#D4AF37] hover:bg-[#F5E9DC]/50'
                }`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {mounted && item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isActive 
                    ? 'text-[#D4AF37]' 
                    : 'text-[#999]'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Customize Button */}
          <button
            onClick={() => setShowWhatsAppModal(true)}
            className="w-full h-full flex flex-col items-center justify-center gap-1.5"
          >
            <div className="relative p-3 rounded-2xl transition-all duration-300 text-[#999] hover:text-[#D4AF37] hover:bg-[#F5E9DC]/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#999]">
              Customize
            </span>
          </button>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-[80%] max-w-[320px] h-full bg-gradient-to-b from-[#FBF6F0] to-[#F5E9DC] p-8 shadow-2xl flex flex-col border-r-2 border-[#D4AF37]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12 border-b-2 border-[#D4AF37]/30 pb-6">
              <span className="font-playfair font-bold text-2xl text-[#2C2C2C]">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-[#F8C8DC]/40 rounded-full hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="space-y-6 flex-1 overflow-y-auto">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  className={`block text-lg font-playfair font-bold uppercase tracking-wider transition-colors duration-300 ${
                    pathname === '/' 
                      ? 'text-[#F8C8DC]' 
                      : 'text-[#2C2C2C] hover:text-[#D4AF37]'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home
                </Link>
              </li>

              {/* Shop with Submenu */}
              <li>
                <div>
                  <p className="text-lg font-playfair font-bold uppercase tracking-wider text-[#2C2C2C] mb-4">
                    Shop
                  </p>
                  <ul className="space-y-3 ml-4 border-l-2 border-[#D4AF37]/50 pl-4">
                    <li>
                      <Link
                        href="/category/glass-bangles"
                        className="text-sm font-poppins font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] transition-colors duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Glass Bangles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/category/metal-bangles-kadas"
                        className="text-sm font-poppins font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] transition-colors duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Metal Bangles/Kadas
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/category/bangles-box"
                        className="text-sm font-poppins font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] transition-colors duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Bangles Box
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/category/bangle-sets"
                        className="text-sm font-poppins font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] transition-colors duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Bangle Sets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/category/bracelets-watches"
                        className="text-sm font-poppins font-semibold text-[#4A4A4A] hover:text-[#F8C8DC] transition-colors duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Bracelets & Watches
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Customize with WhatsApp Modal */}
              <li 
                onClick={() => setShowWhatsAppModal(true)} 
                className="block text-lg font-playfair font-bold uppercase tracking-wider transition-colors duration-300 text-[#2C2C2C] hover:text-[#D4AF37] cursor-pointer"
              >
                Customize
              </li>

              {/* Size Guide */}
              <li>
                <Link
                  href="/size-guide"
                  className={`block text-lg font-playfair font-bold uppercase tracking-wider transition-colors duration-300 ${
                    pathname === '/size-guide' 
                      ? 'text-[#F8C8DC]' 
                      : 'text-[#2C2C2C] hover:text-[#D4AF37]'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Size Guide
                </Link>
              </li>

              {/* Contact */}
              <li>
                <Link
                  href="/contact"
                  className={`block text-lg font-playfair font-bold uppercase tracking-wider transition-colors duration-300 ${
                    pathname === '/contact' 
                      ? 'text-[#F8C8DC]' 
                      : 'text-[#2C2C2C] hover:text-[#D4AF37]'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="mt-auto pt-8 border-t-2 border-[#D4AF37]/30">
              <p className="text-[11px] font-poppins font-bold uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#F8C8DC] bg-clip-text text-transparent">
                Handcrafted in Firozabad
              </p>
              <p className="text-xs text-[#999] mt-2">© SB Creation</p>
            </div>
          </div>
        </div>
      )}

      {/* --- WHATSAPP CUSTOMIZE MODAL --- */}
      {showWhatsAppModal && (
        <div
          className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-md flex items-center justify-center p-4 transition-opacity"
          onClick={() => setShowWhatsAppModal(false)}
        >
          <div
            className="w-full max-w-md bg-gradient-to-br from-[#FBF6F0] to-[#F5E9DC] rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border-2 border-[#D4AF37]/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#F8C8DC]/40 rounded-full transition-all duration-300 text-[#2C2C2C]"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.952 1.263 9.878 9.878 0 006.518 8.614 9.886 9.886 0 003.755-3.734 9.87 9.87 0 00-4.817-6.143z" />
                </svg>
              </div>
              <h2 className="text-2xl font-playfair font-bold text-[#2C2C2C] mb-2">Customize Your Bangle Set</h2>
              <p className="text-[#4A4A4A] text-sm font-poppins">Chat with us on WhatsApp to create your perfect custom bangle set</p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-[#4A4A4A] font-poppins">Design your own unique combination</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-[#4A4A4A] font-poppins">Choose colors and materials</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F8C8DC] flex items-center justify-center mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-[#4A4A4A] font-poppins">Quick response & expert guidance</p>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/?text=Hi%20SB%20Creation!%20I%20want%20to%20customize%20my%20bangle%20set"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowWhatsAppModal(false)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#20BA5C] hover:shadow-lg hover:scale-105 text-white font-bold rounded-xl transition-all duration-300 font-poppins"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.952 1.263 9.878 9.878 0 006.518 8.614 9.886 9.886 0 003.755-3.734 9.87 9.87 0 00-4.817-6.143z" />
              </svg>
              Message on WhatsApp
            </a>

            {/* Close Link */}
            <button
              onClick={() => setShowWhatsAppModal(false)}
              className="text-center text-[#999] hover:text-[#D4AF37] text-sm font-poppins font-medium transition-colors duration-300"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}