"use client";

import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";



const About = () => {
  
  return (
    <>


      <Navbar />
      <section   className="w-full px-6 md:px-16 lg:px-32 py-16 bg-white text-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-orange-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-orange-600 mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About HM Electronics
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-center text-gray-700 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            We’re one of Pakistan’s most trusted online electronics stores 
            committed to providing 100% original products with Cash on Delivery, fast shipping,
            and reliable customer support. Technology made simple, for everyone.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900">
                Why Shop with Us?
              </h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Fast & Reliable Delivery All Over Pakistan",
                  "Cash on Delivery (COD) with Hassle-Free Returns",
                  "100% Original & Verified Products",
                  "Secure Payments & Easy Tracking",
                  "Dedicated Customer Support",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-orange-600 font-bold text-lg">✔</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Image
                src={assets.projector_image}
                alt="About HM Electronics"
                width={500}
                height={400}
                className="rounded-xl shadow-lg object-cover"
              />
            </motion.div>
             <a
          href="https://wa.me/923040505905"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 transition"
          aria-label="Chat on WhatsApp"
        >
            <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-6 h-6"
    role="img"
    fill="none"
    stroke="none"
  >
    <title>WhatsApp</title>
    <path
      fill="#25D366"
      d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.3 5.495 0 12.057 0c3.2 0 6.217 1.246 8.477 3.507a11.821 11.821 0 013.498 8.414c-.003 6.562-5.377 11.935-11.94 11.935a11.9 11.9 0 01-5.606-1.426L.057 24z"
    />
    <path
      fill="#FFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.298-.495.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
        </a>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h4>
            <p className="max-w-2xl mx-auto text-gray-700 text-base">
              To be Pakistan’s go-to marketplace for electronics trusted, affordable, and
              always putting the customer first. We aim to deliver not just gadgets,
              but confidence, convenience, and care.
            </p>
          </motion.div>

          <motion.div
            className="mt-14 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="/all-products"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm font-medium transition"
            >
              Start Shopping Now
            </a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};



export default About;
