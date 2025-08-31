// src/pages/AboutUs.jsx

import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Cropnet</h1>
        <p className="max-w-3xl mx-auto text-lg">
          Fresh fruits and vegetables directly from farmers to your doorstep —
          healthy, affordable, and trustworthy.
        </p>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">
          Our Story
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          Cropnet was founded with a simple vision — to eliminate the middlemen
          and create a direct bridge between farmers and customers. We believe
          that everyone deserves access to fresh, chemical-free, and
          budget-friendly produce while ensuring that farmers get fair prices
          for their hard work.
        </p>
        <p className="text-lg leading-relaxed">
          By using technology and logistics, Cropnet delivers seasonal fruits
          and vegetables directly from farms to homes, reducing waste,
          improving quality, and empowering local farmers.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed">
              To provide farm-fresh produce at affordable prices while
              supporting farmers with fair trade opportunities and better
              livelihoods.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Our Vision
            </h2>
            <p className="text-lg leading-relaxed">
              A future where every household enjoys fresh, healthy food, and
              every farmer is empowered and rewarded for their dedication.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Cropnet */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-semibold text-green-700 text-center mb-10">
          Why Choose Cropnet?
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fresh & Healthy</h3>
            <p>Produce delivered directly from farms with no compromise on quality.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Fair Prices</h3>
            <p>Affordable for customers while ensuring fair pay for farmers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Trusted Network</h3>
            <p>Built on transparency, trust, and long-term farmer partnerships.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-green-600 text-white py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Join the Cropnet Family Today!
        </h2>
        <p className="mb-6 text-lg">
          Together, let’s support farmers and bring fresh, healthy food to every home.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
