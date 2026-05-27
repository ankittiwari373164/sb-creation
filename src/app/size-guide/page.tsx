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

        

        

      </section>
    </div>
  );
}