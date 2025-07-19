import React, { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const NewArrivals = () => {
  const { products } = useAppContext();
  const now = Date.now();
  const newArrivals = products.filter(p => {
    const productDate = new Date(p.date).getTime();
    return now - productDate <= 48 * 60 * 60 * 1000;
  });
  if (newArrivals.length === 0) return null;

  // For desktop/tablet: chunk into slides of 2 rows (e.g., 5 per row, so 10 per slide)
  const perRow = 5;
  const perSlide = perRow * 2;
  const slides = useMemo(() => chunkArray(newArrivals, perSlide), [newArrivals]);
  const [current, setCurrent] = useState(0);

  return (
    <section className="w-full my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 tracking-tight">
        New Arrivals
      </h2>
      <div className="w-20 h-1 bg-orange-600 rounded-full mb-8" />
      {/* Mobile slider: single row */}
      <div className="block sm:hidden -mx-4 px-2">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {newArrivals.map((product, idx) => (
            <div key={idx} className="min-w-[70vw] max-w-xs snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      {/* Tablet/Desktop: two-row slider */}
      <div className="hidden sm:block">
        <div className="relative">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((slide, slideIdx) => (
              <div key={slideIdx} className="min-w-full flex flex-col gap-6">
                <div className="grid grid-cols-5 gap-6 mb-6">
                  {slide.slice(0, perRow).map((product, idx) => (
                    <ProductCard key={idx} product={product} />
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-6">
                  {slide.slice(perRow, perSlide).map((product, idx) => (
                    <ProductCard key={idx} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Slider controls */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 w-6 rounded-full ${current === idx ? 'bg-orange-600' : 'bg-gray-300'} transition-all`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default NewArrivals; 