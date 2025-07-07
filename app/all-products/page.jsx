'use client';

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";

const AllProducts = () => {
  const { products } = useAppContext();

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-12"
      >
        {/* Heading */}
        <div className="flex flex-col items-start w-full">
          <h1 className="text-3xl text-gray-800">All <span className="text-[#EA580C]"> Products</span></h1>
          <div className="w-16 h-1 mt-2 bg-orange-600 rounded-full" />
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-20 w-full">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-24 text-gray-500 text-lg">
            No products available at the moment.
          </div>
        )}
      </motion.div>
      <Footer />
    </>
  );
};

export default AllProducts;
