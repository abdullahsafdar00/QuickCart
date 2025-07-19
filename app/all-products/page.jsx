'use client';

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const AllProducts = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Filter products by category if present
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Group by category
  const grouped = Array.from(
    filteredProducts.reduce((acc, product) => {
      if (!acc.has(product.category)) acc.set(product.category, []);
      acc.get(product.category).push(product);
      return acc;
    }, new Map())
  );

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
          <h1 className="text-3xl text-gray-800">
            {selectedCategory ? (
              <>
                {selectedCategory} <span className="text-[#EA580C]">Products</span>
              </>
            ) : (
              <>All <span className="text-[#EA580C]"> Products</span></>
            )}
          </h1>
          <div className="w-16 h-1 mt-2 bg-orange-600 rounded-full mb-10" />
        </div>

        {/* Grid */}
        
        {filteredProducts.length > 0 ? (
          grouped.map(([category, prods]) => (
            <div key={category} className="w-full mb-10">
              <h2 className="text-xl font-semibold text-orange-600 mb-3 cursor-pointer hover:underline" onClick={() => {
                const el = document.getElementById(`cat-${category}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>{category}</h2>
              <div id={`cat-${category}`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {prods.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-20 w-full">
  {[...Array(10)].map((_, index) => (
    <div
      key={index}
      className="flex flex-col bg-white shadow-md rounded-xl animate-pulse"
    >
      {/* Image placeholder */}
      <div className="h-40 sm:h-48 md:h-56 bg-gray-300 rounded-t-xl" />

      {/* Content placeholder */}
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        <div className="h-3 bg-gray-300 rounded w-2/3" />
      </div>

      {/* Button placeholder */}
      <div className="p-4 pt-0">
        <div className="h-8 lg:ml-24 bg-gray-300 rounded-md w-1/2 mx-auto" />
      </div>
    </div>
  ))}
</div>


        )}
         <a
          href="https://wa.me/923040505905"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 transition"
          aria-label="Chat on WhatsApp"
        >
            <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-6 h-6"
    role="img"
    fill="none"
    stroke="none"
  >
    <title>WhatsApp</title>
    <path
      fill="#25D366"
      d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.003C.122 5.3 5.495 0 12.057 0c3.2 0 6.217 1.246 8.477 3.507a11.821 11.821 0 013.498 8.414c-.003 6.562-5.377 11.935-11.94 11.935a11.9 11.9 0 01-5.606-1.426L.057 24z"
    />
    <path
      fill="#FFF"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.172.2-.296.298-.495.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.123-.272-.198-.57-.347z"
    />
  </svg>
        </a>
      </motion.div>
      <Footer />
    </>
  );
};

export default AllProducts;
