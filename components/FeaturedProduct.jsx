'use client'

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality
  const startAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) return;
    
    autoSlideIntervalRef.current = setInterval(() => {
      if (!isHovered && !dragging) {
        setCurrent((prev) => (prev + 1) % products.length);
      }
    }, 4000); // Auto-slide every 4 seconds
  }, [isHovered, dragging]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  }, []);

  // Start auto-slide on mount
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  // Restart auto-slide when hover or dragging state changes
  useEffect(() => {
    if (!isHovered && !dragging) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  }, [isHovered, dragging, startAutoSlide, stopAutoSlide]);

  // Touch swipe logic for mobile
  useEffect(() => {
    if (!isMobile) return;
    const slider = sliderRef.current;
    if (!slider) return;
    
    let startX = 0;
    let endX = 0;
    let startTime = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startTime = Date.now();
      setDragging(true);
    };

    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const timeDiff = Date.now() - startTime;
      const distance = Math.abs(startX - endX);
      
      // Only register swipe if it's quick enough and far enough
      if (timeDiff < 300 && distance > 50) {
        if (startX - endX > 50) {
          setCurrent((prev) => (prev + 1) % products.length);
        } else if (endX - startX > 50) {
          setCurrent((prev) => (prev - 1 + products.length) % products.length);
        }
      }
      setDragging(false);
    };

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Mouse drag logic for desktop
  useEffect(() => {
    if (isMobile) return;
    // Desktop doesn't need drag functionality - it's a static grid
  }, [isMobile]);

  // Arrow navigation
  const goLeft = () => {
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  };
  
  const goRight = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} 
      className="mt-14"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      {/* Mobile: Swipeable slider */}
      <div className="block md:hidden mt-12 md:px-4 px-2 relative overflow-hidden" role="region" aria-label="Featured products slider">
        <motion.div
          ref={sliderRef}
          className="flex transition-transform duration-500"
          style={{ 
            transform: `translateX(-${current * 35}%)`,
            width: `${products.length * 100}%`
          }}
        >
          {products.map(({ id, image, title, description }) => (
            <div 
              key={id} 
              className="relative group bg-white rounded-lg shadow p-2 flex-shrink-0"
              style={{ width: `${100 / products.length}%` }}
            >
              <Image
                src={image}
                alt={title}
                className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover rounded"
                draggable={false}
              />
              <div className="absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{title}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  {description}
                </p>
                <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                  Buy now
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}
                  >
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
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow text-gray-700 transition-colors z-10"
          aria-label="Previous slide"
        >
          &#8592;
        </button>
        <button
          onClick={goRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow text-gray-700 transition-colors z-10"
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
              className={`h-2 w-2 rounded-full transition-colors ${
                current === idx ? 'bg-orange-600' : 'bg-gray-300'
              }`}
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
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                >
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