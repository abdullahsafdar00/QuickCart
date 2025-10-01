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
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] h-[400px] cursor-pointer"
    >
      <div
        className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center"
      >
        {/* Promotion Badge */}
        {product.promotion && (
          <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full z-10">
            Promotion
          </span>
        )}
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

      <p className="md:text-lg text-base font-semibold pt-2 w-full truncate leading-tight text-gray-800">{product.name}</p>
      {!product.inStock && (
        <span className="text-xs text-red-600 mt-1">Out of Stock</span>
      )}
      <p className="w-full text-xs md:text-sm text-gray-500/80 max-sm:hidden truncate leading-snug">
        {product.description}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs md:text-sm">4.5</p>
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
      <div className="flex items-end justify-between w-full mt-2">
        {product.offerPrice && product.offerPrice > 0 ? (
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-gray-400 line-through">{currency}{product.price}</span>
            <span className="text-lg md:text-xl font-bold text-orange-600">{currency}{product.offerPrice}</span>
          </div>
        ) : (
          <span className="text-lg md:text-xl font-bold text-gray-800">{currency}{product.price}</span>
        )}
        <motion.button
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="px-4 py-1.5 text-[#EA580C] border border-gray-500/20 rounded-full text-xs md:text-sm hover:bg-slate-50 transition font-semibold"
        >
          Buy now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
