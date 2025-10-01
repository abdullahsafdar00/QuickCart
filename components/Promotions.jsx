import React from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";

const Promotions = () => {
  const { products } = useAppContext();
   const promoProducts = products.filter(p => p.promotion);
  if (promoProducts.length === 0) return null;
  return (
    <section className="w-full my-12">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-16 tracking-tight text-center">
        Promotions & Discounts
      </h2>
      {/* Mobile slider */}
      <div className="block sm:hidden -mx-4 px-2">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {promoProducts.map((product, idx) => (
            <div key={idx} className="min-w-[70vw] max-w-xs snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      {/* Grid for tablet/desktop */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {promoProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
};
export default Promotions; 