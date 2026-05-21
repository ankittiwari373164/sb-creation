import React from 'react';

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white pb-20">

      {/* Header - compact */}
      <section className="bg-[#fff1f2] py-8 md:py-10 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl md:text-3xl font-serif text-[#0F2C3E] mb-1">
            Bangle <span className="italic text-[#db2777]">Size Guide</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Find Your Perfect Fit</p>
        </div>
      </section>

      <section className="container mx-auto px-6 max-w-4xl mt-8 space-y-10">

        {/* Important note */}
        <div className="bg-[#fff7ed] border border-orange-100 rounded-xl p-5">
          <p className="text-sm text-[#0F2C3E]">
            <span className="font-bold text-orange-600 uppercase tracking-widest text-xs block mb-1">⚠ Glass Bangles — Size Matters</span>
            Our glass bangles have no clasp or opening. They must pass over your knuckles to reach your wrist. Ordering the wrong size means the bangle either won't fit over your hand or will slide off. Please measure carefully before placing your order.
          </p>
        </div>

        {/* How to Measure */}
        <div>
          <h2 className="text-xl font-serif text-[#0F2C3E] mb-1">How to Measure Your Size</h2>
          <p className="text-sm text-gray-500 mb-6">Measure the widest part of your hand — not your wrist. Bangles pass over your knuckles, so that is the measurement that matters.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Step 1 */}
            <div className="border border-gray-100 rounded-xl p-5 bg-[#f8f9fa]">
              <div className="w-8 h-8 rounded-full bg-[#db2777] text-white flex items-center justify-center text-sm font-bold mb-3">1</div>
              <h3 className="text-sm font-bold text-[#0F2C3E] mb-2">Bring 4 fingers together</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Hold your hand flat and press all four fingers tightly together. Keep your thumb tucked in. This mimics the shape your hand makes when sliding a bangle on.</p>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-100 rounded-xl p-5 bg-[#f8f9fa]">
              <div className="w-8 h-8 rounded-full bg-[#db2777] text-white flex items-center justify-center text-sm font-bold mb-3">2</div>
              <h3 className="text-sm font-bold text-[#0F2C3E] mb-2">Wrap a tape or string</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Wrap a soft measuring tape (or a strip of paper/string) snugly around the widest part of your knuckles. Mark the point where it meets and measure in centimetres. This is your <strong>hand circumference</strong>.</p>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-100 rounded-xl p-5 bg-[#f8f9fa]">
              <div className="w-8 h-8 rounded-full bg-[#db2777] text-white flex items-center justify-center text-sm font-bold mb-3">3</div>
              <h3 className="text-sm font-bold text-[#0F2C3E] mb-2">Match to the chart below</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Use your circumference (cm) to find your size in the table. <strong>If you fall between two sizes, always size up.</strong> Bangles should slide over the hand with slight resistance — not cut into skin.</p>
            </div>

          </div>
        </div>

        {/* Alternative method */}
        <div className="border-l-4 border-[#db2777] pl-5">
          <h3 className="text-sm font-bold text-[#0F2C3E] mb-1">Already own a bangle that fits well?</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Lay it flat and measure the inner diameter across the centre using a ruler. Convert to centimetres and match to the diameter column in the chart. This is the most accurate method for glass bangles.</p>
        </div>

        {/* Size Chart */}
        <div>
          <h2 className="text-xl font-serif text-[#0F2C3E] mb-1">Indian Bangle Size Chart</h2>
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold">Standard Indian sizing system used by SB Creation</p>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-[#0F2C3E] text-white">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Indian Size</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Inner Diameter (mm)</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Hand Circumference (cm)</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-widest">Fit Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { size: '2/2',  diam: '52', circ: '14.5 – 15.5', fit: 'XS / Child' },
                  { size: '2/4',  diam: '55', circ: '15.5 – 16.5', fit: 'Small' },
                  { size: '2/6',  diam: '58', circ: '16.5 – 17.5', fit: 'Small–Medium', popular: true },
                  { size: '2/8',  diam: '61', circ: '17.5 – 18.5', fit: 'Medium', popular: true },
                  { size: '2/10', diam: '64', circ: '18.5 – 19.5', fit: 'Medium–Large', popular: true },
                  { size: '2/12', diam: '67', circ: '19.5 – 20.5', fit: 'Large' },
                  { size: '2/14', diam: '70', circ: '20.5 – 21.5', fit: 'XL' },
                  { size: '3/0',  diam: '76', circ: '21.5 – 23',   fit: 'XXL' },
                ].map((row) => (
                  <tr
                    key={row.size}
                    className={row.popular ? 'bg-[#fff1f2]' : 'bg-white hover:bg-gray-50'}
                  >
                    <td className="px-5 py-3 font-bold text-[#0F2C3E]">
                      {row.size}
                      {row.popular && (
                        <span className="ml-2 inline-block bg-[#db2777] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Popular</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{row.diam} mm</td>
                    <td className="px-5 py-3 text-gray-600">{row.circ} cm</td>
                    <td className="px-5 py-3 text-gray-500 text-xs font-medium">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">* Most Indian women fall between sizes 2/6 and 2/10. The most commonly ordered size is <strong>2/8</strong>.</p>
        </div>

        {/* Diagram: Hand measurement illustration */}
        <div>
          <h2 className="text-xl font-serif text-[#0F2C3E] mb-4">Understanding the Sizing System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-[#0F2C3E] mb-3 uppercase tracking-widest text-xs">What does "2/8" mean?</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Indian bangle sizes are written as two numbers separated by a slash. The first number is always <strong>2</strong> (for adult women) or <strong>3</strong> (for larger sizes). The second number is a fractional increment.
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-100 font-mono text-xs text-center text-[#0F2C3E]">
                <p className="text-lg font-bold mb-1">2 / 8</p>
                <p className="text-gray-400">Size group &nbsp;&nbsp;&nbsp; Increment</p>
                <div className="mt-3 text-left text-gray-500 space-y-1">
                  <p>Diameter = 2 + (8 ÷ 16) = 2.5 inches</p>
                  <p>= approx. 61 mm inner diameter</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-[#0F2C3E] mb-3 uppercase tracking-widest text-xs">Tips for a perfect fit</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#db2777] font-bold mt-0.5">→</span>
                  <span>Measure in the <strong>afternoon</strong> — hands are slightly larger later in the day due to natural swelling.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#db2777] font-bold mt-0.5">→</span>
                  <span>Your <strong>dominant hand</strong> may be slightly larger. Measure the hand you plan to wear the bangles on.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#db2777] font-bold mt-0.5">→</span>
                  <span>A correctly fitting bangle should slide over your knuckles <strong>with mild resistance</strong> and sit comfortably at the wrist without slipping off.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#db2777] font-bold mt-0.5">→</span>
                  <span><strong>When in doubt, size up.</strong> A slightly looser bangle is wearable; one that won't pass your knuckles is not.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* What "FS / Free Size" means */}
        <div className="bg-[#f0f7ff] rounded-xl p-5 border border-blue-50">
          <h3 className="text-sm font-bold text-[#0F2C3E] mb-2">What does "Free Size" (FS) mean?</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Some listings may show <strong>FS (Free Size)</strong>. This typically fits medium wrists (sizes 2/6 – 2/10). However, glass bangles are rigid — they cannot stretch. <strong>We strongly recommend ordering your exact measured size</strong> rather than relying on FS, especially if you have small or broad hands.
          </p>
        </div>

        {/* Still unsure? */}
        <div className="pt-6 border-t border-gray-100 text-center">
          <p className="text-sm font-bold text-[#0F2C3E] mb-1">Still unsure about your size?</p>
          <p className="text-xs text-gray-500 mb-4">Send us your hand circumference and we'll recommend the right size before you order.</p>
          <a
            href="/contact"
            className="inline-block bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all"
          >
            Ask Us
          </a>
        </div>

      </section>
    </div>
  );
}