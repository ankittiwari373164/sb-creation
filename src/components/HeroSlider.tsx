'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const DEFAULT_DESKTOP = '/banner6.png'
const DEFAULT_MOBILE = '/mobile.png'

export default function HeroSlider() {
  const [desktopImage, setDesktopImage] = useState(DEFAULT_DESKTOP)
  const [mobileImage, setMobileImage] = useState(DEFAULT_MOBILE)

  // Hero images are managed from the admin panel (Settings → Storefront).
  useEffect(() => {
    let active = true
    fetch('/api/settings')
      .then(r => r.json())
      .then(s => {
        if (!active) return
        if (s.hero_desktop_image) setDesktopImage(s.hero_desktop_image)
        if (s.hero_mobile_image) setMobileImage(s.hero_mobile_image)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-[#FFF0F5]">
      <Link href="/shop" className="relative block w-full cursor-pointer">

        {/* Desktop image — hidden on mobile */}
        <div className="hidden md:block relative w-full h-[420px] lg:h-[480px]">
          <Image
            src={desktopImage}
            alt="SB Creation — Handcrafted Bangles from Firozabad"
            fill
            priority
            unoptimized={desktopImage.startsWith('http')}
            className="object-cover object-center"
            quality={90}
          />
        </div>

        {/* Mobile image — hidden on desktop */}
        <div className="block md:hidden relative w-full h-[260px]">
          <Image
            src={mobileImage}
            alt="SB Creation — Handcrafted Bangles from Firozabad"
            fill
            priority
            unoptimized={mobileImage.startsWith('http')}
            className="object-cover object-center"
            quality={90}
          />
        </div>

      </Link>
    </section>
  )
}