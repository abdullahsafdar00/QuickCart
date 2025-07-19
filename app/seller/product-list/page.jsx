'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { useUser } from '@clerk/nextjs';
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleStock = async (productId, newStatus) => {
  try {
    const token = await getToken();
    const { data } = await axios.put(
      "/api/product/inStock",
      { productId, inStock: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success("Stock status updated");
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, inStock: newStatus } : p
        )
      );
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  const handleDelete = async (productId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete("/api/product/delete", {
  headers: { Authorization: `Bearer ${token}` },
  data: { productId }, // This must be here for DELETE
});

      if (data.success) {
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
      if (isLoaded) {
      const role = user?.publicMetadata?.role;
      if (role === 'seller') {
        setIsAuthorized(true);
      } else {
        router.replace('/access-denied'); // Optional: create this page
      }
    }


  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
  {loading ? (
    <Loading />
  ) : (
    <div className="w-full md:p-10 p-4">
      <h2 className="pb-4 text-lg font-medium">All Products</h2>

      {/* Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full hidden sm:table bg-white border border-gray-200 rounded-md">
          <thead className="text-gray-900 text-sm text-left">
            <tr>
              <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium">Product</th>
              <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">In Stock</th>
              <th className="px-4 py-3 font-medium">Delete</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {products.map((product, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Image
                    src={product.image[0]}
                    alt="Product"
                    className= "object-cover rounded"
                    width={64}
                    height={64}
                  />
                  <span className="truncate px-20 py-3">{product.name}</span>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.offerPrice > 0 ? product.offerPrice : product.price}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs"
                  >
                    <span className="hidden md:block">Visit</span>
                    <Image
                      className="h-3.5"
                      src={assets.redirect_icon}
                      alt="redirect_icon"
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStock(product._id, !product.inStock)}
                    className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      product.inStock ? "bg-[#EA580C]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${
                        product.inStock ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-md p-4 bg-white flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image[0]}
                  alt="Product"
                  className="w-16 h-16 object-cover rounded"
                  width={64}
                  height={64}
                />
                <div className="flex-1">
                  <h3 className="text-base font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              <p className="text-sm">
                <span className="font-medium">Price:</span> ${product.offerPrice > 0 ? product.offerPrice : product.price}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-md text-xs"
                >
                  Visit
                  <Image
                    className="h-3.5"
                    src={assets.redirect_icon}
                    alt="redirect_icon"
                  />
                </button>
                <button
                  onClick={() => handleToggleStock(product._id, !product.inStock)}
                  className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    product.inStock ? "bg-[#EA580C]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${
                      product.inStock ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
  <Footer />
</div>

  );
};

export default ProductList;
