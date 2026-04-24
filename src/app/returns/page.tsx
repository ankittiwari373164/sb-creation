import React from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="bg-[#fff1f2] py-16 md:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-4">Returns & <span className="italic text-[#db2777]">Refunds</span></h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Our Promise to You</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 max-w-4xl mt-12">
        <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed space-y-8">
          
          <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#db2777] mb-3">Important: Unboxing Video Required</h2>
            <p className="m-0 text-sm md:text-base text-[#0F2C3E]">Because glass bangles are fragile by nature, we strictly require a continuous, unedited unboxing video starting from the sealed package to process any claims for transit damage or missing items.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">1. Eligibility for Returns</h2>
            <p>We accept returns or exchanges within <strong>7 days</strong> of delivery. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">2. Damages and Issues</h2>
            <p>Please inspect your order upon reception. If the item is defective, damaged, or if you receive the wrong item, please contact us immediately at <strong>contact@sbcreationofficial.com</strong> with your order number and the unboxing video so that we can evaluate the issue and make it right.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">3. Size Exchanges</h2>
            <p>If you have ordered the wrong size, we offer an exchange. The customer will be responsible for paying the return shipping costs for size exchanges. Please check our Size Guide before placing an order to avoid this inconvenience.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">4. Refunds</h2>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment within 5-7 business days.</p>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 text-center">
            <p className="text-sm font-bold text-[#0F2C3E]">Need help with a return?</p>
            <Link href="/contact" className="inline-block mt-4 bg-[#0F2C3E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#db2777] transition-all">
              Contact Support
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}