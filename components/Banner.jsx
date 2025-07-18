
'use client'

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <motion.div  initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 tracking-tight max-w-[320px]">
          Level Up Your Gaming <span className="text-[#EA580C]">Experience</span>
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60 text-base md:text-lg leading-relaxed">
          From immersive sound to precise controls—everything you need to win
        </p>
        <motion.button animate={{
    rotate: [0, -5, 5, -5, 5, -5, 5, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 0.3,
      ease: "easeInOut",
    },
  }} className="group flex items-center justify-center gap-1 px-6 py-2.5 bg-orange-600 rounded text-white text-base md:text-lg font-semibold">
          <p>Buy Now</p>
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </motion.button>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </motion.div>
  );
};

export default Banner;