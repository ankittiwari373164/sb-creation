'use client'

import Script from 'next/script'

// Google Analytics 4 (Measurement ID from analytics.google.com → Admin → Data Streams)
const GA_MEASUREMENT_ID = 'G-ZF4WRR6VQT'

// Microsoft Clarity (Project ID from clarity.microsoft.com → Settings → Setup)
const CLARITY_PROJECT_ID = 'y4354r4np3'

// Drop this once in the root layout, inside <body>, alongside your other
// providers — e.g.:
//
//   import Analytics from '../components/Analytics'
//   ...
//   <body>
//     <Analytics />
//     {children}
//   </body>
//
// Both scripts load with strategy="afterInteractive", so they run after the
// page is already interactive — they won't block or slow down the initial
// page render/paint.
export default function Analytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `}
      </Script>
    </>
  )
}
