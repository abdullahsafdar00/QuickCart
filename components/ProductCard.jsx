'use client';

import dynamic from 'next/dynamic';
import React, { useState, memo } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

// Lazy load heavy animation components if needed
const LazyMotion = dynamic(() => import('framer-motion').then(mod => mod.motion), { ssr: false });

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      delay: 0.1,
    },
  },
};

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03 }}
      onClick={() => {
        router.push(`/product/${product._id}`);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      <div
        className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center"
      >
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
          loading="lazy" // defer loading
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((prev) => !prev);
          }}
          className="absolute top-2 right-2 bg-[#F0F1F2] p-2 rounded-full shadow-md text-lg active:scale-50"
          aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
      {!product.inStock && (
        <span className="text-xs text-red-600 mt-1">Out of Stock</span>
      )}
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs">4.5</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              className="h-3 w-3"
              src={index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon}
              alt="star_icon"
              width={12}
              height={12}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {product.offerPrice}
        </p>
        <motion.button
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="max-sm:hidden px-4 py-1.5 text-[#EA580C] border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
        >
          Buy now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
