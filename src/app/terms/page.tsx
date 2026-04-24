import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="bg-[#f8f9fa] py-16 md:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-4">Terms of <span className="italic text-[#db2777]">Service</span></h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Welcome to SB Creation</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 max-w-4xl mt-12">
        <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed space-y-8">
          
          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">1. General Conditions</h2>
            <p>By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. We reserve the right to refuse service to anyone for any reason at any time.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">2. Product Descriptions & Handcrafted Nature</h2>
            <p>Our products, specifically our glass and metal bangles, are handcrafted by artisans in Firozabad. Due to the handmade nature of these artifacts, slight variations in color, texture, and size may occur. These are not defects but rather the unique signature of traditional craftsmanship. We have made every effort to display the colors and images of our products as accurately as possible.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">3. Pricing and Modifications</h2>
            <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">4. Governing Law</h2>
            <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Firozabad, Uttar Pradesh.</p>
          </div>

        </div>
      </section>
    </div>
  );
}