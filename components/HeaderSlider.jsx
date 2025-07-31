'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Shop Smart, Shop Safe – Genuine Electronics with Cash on Delivery!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
    },
    {
      id: 2,
      title: "Upgrade Your Home – Top Appliances at Unbeatable Prices!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Essential Electronics for Every Home – Reliable & Affordable",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "See More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const totalSlides = sliderData.length;
  const extendedSlides = [...sliderData, sliderData[0]];

  // Auto-slide functionality
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => prev + 1);
      }
    }, 4000);
  }, [isPaused]);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize auto-slide
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  // Handle infinite loop reset
  useEffect(() => {
    if (currentSlide === totalSlides) {
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setCurrentSlide(0);
        setTimeout(() => setIsAnimating(true), 50);
      }, 700);
      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(true);
    }
  }, [currentSlide, totalSlides]);

  // Touch and mouse drag handlers
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX = 0;
    let endX = 0;
    let isDragging = false;

    // Touch events
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      setIsPaused(true);
      stopAutoSlide();
    };

    const handleTouchMove = (e) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const deltaX = startX - endX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next slide
          setCurrentSlide((prev) => (prev + 1) % totalSlides);
        } else {
          // Swipe right - previous slide
          setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        }
      }
      
      setTimeout(() => {
        setIsPaused(false);
        startAutoSlide();
      }, 500);
    };

    // Mouse events for desktop
    const handleMouseDown = (e) => {
      startX = e.clientX;
      isDragging = true;
      setIsPaused(true);
      stopAutoSlide();
      slider.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      endX = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      slider.style.cursor = 'grab';
      
      const deltaX = startX - endX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Drag left - next slide
          setCurrentSlide((prev) => (prev + 1) % totalSlides);
        } else {
          // Drag right - previous slide
          setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        }
      }
      
      setTimeout(() => {
        setIsPaused(false);
        startAutoSlide();
      }, 500);
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    // Add event listeners
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd);
    
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mousemove', handleMouseMove);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseleave', handleMouseLeave);
    
    // Set initial cursor
    slider.style.cursor = 'grab';

    return () => {
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchmove', handleTouchMove);
      slider.removeEventListener('touchend', handleTouchEnd);
      
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mousemove', handleMouseMove);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [totalSlides, startAutoSlide, stopAutoSlide]);

  const handleSlideChange = (index) => {
    setIsPaused(true);
    stopAutoSlide();
    setIsAnimating(true);
    setCurrentSlide(index);
    
    setTimeout(() => {
      setIsPaused(false);
      startAutoSlide();
    }, 1000);
  };

  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="overflow-hidden relative w-full select-none" 
      ref={sliderRef} 
      role="region" 
      aria-label="Header slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`flex ${isAnimating ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-3xl font-medium">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6">
                <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium hover:bg-orange-700 transition-colors">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium hover:text-orange-600 transition-colors">
                  {slide.buttonText2}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      className="group-hover:translate-x-1 transition"
                      src={assets.arrow_icon}
                      alt="arrow_icon"
                    />
                  </motion.div>
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48 pointer-events-none"
                src={slide.imgSrc}
                alt={`Slide ${(index % totalSlides) + 1}`}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSlide % totalSlides === index 
                ? "bg-orange-600 scale-110" 
                : "bg-gray-500/30 hover:bg-gray-500/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows for desktop */}
      <div className="hidden md:block">
        <button
          onClick={() => handleSlideChange((currentSlide - 1 + totalSlides) % totalSlides)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => handleSlideChange((currentSlide + 1) % totalSlides)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeaderSlider;