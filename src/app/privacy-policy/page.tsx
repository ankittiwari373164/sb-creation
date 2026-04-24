import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="bg-[#fff1f2] py-16 md:py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-[#0F2C3E] mb-4">Privacy <span className="italic text-[#db2777]">Policy</span></h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Last Updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 max-w-4xl mt-12">
        <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed space-y-8">
          
          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">1. Information We Collect</h2>
            <p>At SB Creation, we collect personal information that you provide to us directly when you register on our site, place an order, subscribe to our newsletter, or contact us. This includes your name, email address, shipping address, phone number, and payment details.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
              <li>Communicate with you regarding customer support inquiries.</li>
              <li>Send you promotional offers and news about our handcrafted collections (only if you have opted in).</li>
              <li>Improve our website and shopping experience.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">3. Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.</p>
          </div>

          <div>
            <h2 className="text-2xl font-serif text-[#0F2C3E] mb-4">4. Contact Us</h2>
            <p>If you have any questions regarding this Privacy Policy, you may contact us using the information below:</p>
            <p className="mt-2 font-bold text-[#0F2C3E]">SB Creation</p>
            <p>Orchid Green, Raja ka taal, Firozabad, UP (283203)</p>
            <p>Email: <a href="mailto:contact@sbcreationofficial.com" className="text-[#db2777] hover:underline">contact@sbcreationofficial.com</a></p>
            <p>Phone: +91 95571 11954</p>
          </div>

        </div>
      </section>
    </div>
  );
}