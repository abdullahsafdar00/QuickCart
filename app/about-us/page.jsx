import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const About = () => {
  return (
    <section className="w-full px-6 md:px-16 lg:px-32 py-16 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-4 text-center">
          About HM Electronics
        </h2>
        <p className="text-lg md:text-xl text-center text-gray-700 max-w-3xl mx-auto mb-10">
          We're a leading electronics marketplace in Pakistan, offering original products
          with Cash on Delivery across the country. Our mission is to deliver technology
          that fits your lifestyle — quickly, affordably, and reliably.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Why Shop with Us?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">✔</span>
                Fast & Reliable Delivery All Over Pakistan
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">✔</span>
                Cash on Delivery (COD) with Hassle-Free Returns
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">✔</span>
                100% Original & Verified Products
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">✔</span>
                Secure Payments & Easy Tracking
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 font-bold">✔</span>
                Dedicated Customer Support
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Image
              src={assets.about_banner_image || "/placeholder.png"} // fallback in case image not set
              alt="About HM Electronics"
              width={500}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>

        <div className="mt-14 text-center">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h4>
          <p className="max-w-2xl mx-auto text-gray-700">
            To become Pakistan’s most trusted online electronics store by consistently
            delivering value, transparency, and quality to every doorstep.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
