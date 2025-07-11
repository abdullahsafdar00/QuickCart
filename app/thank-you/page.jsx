"use client"

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const ThankYouPage = () => {
  return (
    <motion.div  initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-semibold text-orange-600 mb-4">Thank You!</h1>
      <p className="text-gray-600 mb-6">
        We’ve received your message/subscription. You’ll hear from us soon!
      </p>
      <Link
        href="/"
        className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default ThankYouPage;
