"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditProduct() {
  const { getToken, user, products, fetchProductData } = useAppContext();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];

  useEffect(() => {
    if (user?.id && products?.length) {
      setMyProducts(products.filter(p => p.userId === user.id));
    }
  }, [user, products]);

  useEffect(() => {
    if (selectedProductId && myProducts.length) {
      const product = myProducts.find(p => p._id === selectedProductId);
      if (product) {
        setName(product.name || "");
        setDescription(product.description || "");
        setCategory(product.category || "Electronics");
        setPrice(product.price?.toString() || "");
        setOfferPrice(product.offerPrice?.toString() || "");
      }
    }
  }, [selectedProductId, myProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || price <= 0) {
      toast.error("Please fill all required fields with valid values");
      return;
    }

    if (offerPrice && Number(offerPrice) >= Number(price)) {
      toast.error("Offer price must be less than regular price");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/product/edit",
        {
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          offerPrice: offerPrice ? Number(offerPrice) : null,
          productId: selectedProductId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Product updated successfully!");
        await fetchProductData();
        setSelectedProductId("");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-gray-500 text-sm sm:text-base">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
        
        <h1 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
          Edit Product
        </h1>

        {/* Product Selector */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Product
          </label>
          <select
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Choose a product to edit</option>
            {myProducts.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                rows={4}
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Offer Price (PKR)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white text-sm sm:text-base font-medium py-2.5 sm:py-3 px-6 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}