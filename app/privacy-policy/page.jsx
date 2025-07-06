"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Introduction",
    content:
      "We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.",
  },
  {
    title: "2. Information We Collect",
    content: [
      "Personal details like name and email address",
      "Newsletter subscription data",
      "Website usage analytics",
      "Cookies and tracking technologies",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "To provide and maintain services",
      "To send marketing or service emails (if opted in)",
      "To analyze website performance",
      "To comply with legal requirements",
    ],
  },
  {
    title: "4. Sharing Your Data",
    content:
      "We do not sell your data. We may share information only with trusted providers helping us deliver our services.",
  },
  {
    title: "5. Your Rights",
    content:
      "You may access, correct, or delete your personal data by contacting us. We respect your privacy rights.",
  },
  {
    title: "6. Changes to This Policy",
    content:
      "We may update this policy from time to time. Updates will always be posted on this page.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <>
      <Navbar />
      <motion.div
        className="relative min-h-screen bg-white px-6 md:px-16 py-14 text-gray-800 overflow-hidden"
         initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
      >
        {/* Background accents */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-100 rounded-full blur-[120px] opacity-40 -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-[100px] opacity-30 -z-10" />

        <div className="max-w-4xl mx-auto space-y-12">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-orange-600 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Privacy Policy
          </motion.h1>

          <p className="text-sm text-center text-gray-500">
            Last updated: July 4, 2025
          </p>

          {sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              viewport={{ once: true }}
              className="space-y-3 scroll-mt-24"
              id={`section-${idx + 1}`}
            >
              <h2 className="text-xl font-semibold text-orange-600">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-1">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{section.content}</p>
              )}
            </motion.section>
          ))}

          {/* CTA box */}
          <motion.div
            className="mt-16 p-6 rounded-xl bg-orange-50 border border-orange-200"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-orange-700 mb-2">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-4">
              Our support team is here to help you understand your privacy rights. Reach out
              and we’ll respond within 24 hours.
            </p>
            <Link
              href="/contact-us"
              className="inline-block px-5 py-2.5 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition"
            >
              Contact Support
            </Link>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link
              href="/"
              className="px-5 py-2.5 bg-orange-600 text-white rounded-full text-sm hover:bg-orange-700 transition"
            >
              Back to Home
            </Link>
            <Link
              href="/all-products"
              className="text-orange-600 text-sm underline hover:text-orange-700"
            >
              Browse Products
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
