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
         <div className="flex gap-10">
  {[...Array(3)].map((_, index) => (
    <div
      key={index}
      className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 animate-pulse"
    >
      <div className="relative grid h-56 mx-4 mt-4 overflow-hidden text-gray-700 bg-gray-300 bg-clip-border rounded-xl place-items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-12 h-12 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 
              1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 
              3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 
              0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 
              1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 
              0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
      <div className="p-6">
        <div className="block w-56 h-3 mb-4 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-gray-300 rounded-full text-inherit">
          &nbsp;
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="block w-full h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit"
          >
            &nbsp;
          </div>
        ))}
      </div>
      <div className="p-6 pt-0">
        <button
          disabled
          tabIndex={-1}
          type="button"
          className="align-middle absolute bottom-2 right-10 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg text-white shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none h-8 w-20 bg-gray-300 shadow-none hover:shadow-none"
        >
          &nbsp;
        </button>
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
