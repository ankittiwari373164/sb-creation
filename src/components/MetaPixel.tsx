'use client'

import { useEffect } from 'react'

const PIXEL_ID = '873057989015771'

export default function MetaPixel() {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (!window.fbq) {
        const fbq = function () {
          // @ts-ignore
          fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
        }
        // @ts-ignore
        fbq.push = fbq
        // @ts-ignore
        fbq.loaded = true
        // @ts-ignore
        fbq.version = '2.0'
        // @ts-ignore
        fbq.queue = []

        // Create and insert the script
        const script = document.createElement('script')
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'
        script.async = true
        document.head.appendChild(script)

        // @ts-ignore
        window.fbq = fbq
      }

      // @ts-ignore
      window.fbq('init', PIXEL_ID)
      // @ts-ignore
      window.fbq('track', 'PageView')
    }
  }, [])

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}