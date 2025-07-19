'use client'

import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    image: assets.girl_with_headphone_image,
    title: "Unparalleled Sound",
    description: "Experience crystal-clear audio with premium headphones.",
  },
  {
    id: 2,
    image: assets.girl_with_earphone_image,
    title: "Stay Connected",
    description: "Compact and stylish earphones for every occasion.",
  },
  {
    id: 3,
    image: assets.boy_with_laptop_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  const [dragging, setDragging] = useState(false);
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Touch swipe logic
  useEffect(() => {
    if (!isMobile) return;
    const slider = sliderRef.current;
    if (!slider) return;
    let startX = 0;
    let endX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
      if (startX - endX > 50) {
        setCurrent((prev) => Math.min(prev + 1, products.length - 1));
      } else if (endX - startX > 50) {
        setCurrent((prev) => Math.max(prev - 1, 0));
      }
    };
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);
    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Arrow navigation
  const goLeft = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const goRight = () => setCurrent((prev) => Math.min(prev + 1, products.length - 1));

  return (
    <motion.div  initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      {/* Mobile: Swipeable slider */}
      <div className="block md:hidden mt-12 md:px-14 px-4 relative" role="region" aria-label="Featured products slider">
        <motion.div
          ref={sliderRef}
          className="flex gap-4 overflow-x-hidden no-scrollbar transition-transform duration-500"
          style={{ transform: `translateX(-${current * 100}%)` }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        >
          {products.map(({ id, image, title, description }) => (
            <div key={id} className="relative group min-w-full max-w-full bg-white rounded-lg shadow p-2 flex-shrink-0">
              <Image
                src={image}
                alt={title}
                className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover rounded"
              />
              <div className="absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  {description}
                </p>
                <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                  Buy now
                  <motion.div animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}>
                    <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                  </motion.div>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
        {/* Arrows */}
        <button
          onClick={goLeft}
          disabled={current === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow text-gray-700 disabled:opacity-30"
          aria-label="Previous slide"
        >
          &#8592;
        </button>
        <button
          onClick={goRight}
          disabled={current === products.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow text-gray-700 disabled:opacity-30"
          aria-label="Next slide"
        >
          &#8594;
        </button>
        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 w-2 rounded-full ${current === idx ? 'bg-orange-600' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                Buy now 
                <motion.div animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}>
                <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                  </motion.div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedProduct;
