'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFF0F5]">
      <Link href="/shop" className="relative block w-full cursor-pointer">
        
        {/* Desktop image — hidden on mobile */}
        <div className="hidden md:block relative w-full h-[420px] lg:h-[480px]">
          <Image
            src="/banner3.png"
            alt="SB Creation — Handcrafted Bangles from Firozabad"
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
        </div>

        {/* Mobile image — hidden on desktop */}
        <div className="block md:hidden relative w-full h-[260px]">
          <Image
            src="/mobile.png"
            alt="SB Creation — Handcrafted Bangles from Firozabad"
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
        </div>

      </Link>
    </section>
  )
}