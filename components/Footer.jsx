'use client';
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  const router = useRouter();

  // Animation variants
  const phoneVariants = {
    animate: {
      rotate: [0, -15, 15, -10, 10, -5, 5, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const mailVariants = {
    animate: {
      scale: [1, 1.4, 1],
      y: [0, -2, 0],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <motion.div initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="flex flex-col md:flex-row justify-between gap-12 px-6 md:px-16 lg:px-32 py-14">
        {/* Brand */}
        <div className="w-full md:w-1/3 space-y-5">
          <h1
            onClick={() => router.push("/")}
            className="cursor-pointer text-3xl text-gray-800"
          >
            <span className="text-[#EA580C]">HM</span>Electronics
          </h1>
          <p className="text-sm leading-relaxed text-gray-500">
            We’re one of Pakistan’s most trusted online electronics stores,
            providing original products with Cash on Delivery, fast shipping,
            and great support.
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/3 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Quick Links</h2>
          <ul className="text-sm space-y-2">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/all-products" },
              { label: "About", href: "/about-us" },
              { label: "Contact", href: "/contact-us" },
              { label: "Privacy Policy", href: "/privacy-policy" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[#EA580C] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="w-full md:w-1/3 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Get in Touch</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <motion.div variants={phoneVariants} animate="animate">
                <Phone size={18} className="text-[#EA580C]" />
              </motion.div>
              <span>+92-3040505905</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div variants={mailVariants} animate="animate">
                <Mail size={18} className="text-[#EA580C]" />
              </motion.div>
              <span>abdullah16safdar@gmail.com</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-4 text-center text-xs md:text-sm text-gray-400">
        © 2025 <span className="font-medium text-gray-500"><span className="text-[#EA580C]">HM</span>Electronics</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
