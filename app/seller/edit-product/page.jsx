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
      toast.error('Please fill all required fields with valid values');
      return;
    }
    
    if (offerPrice && Number(offerPrice) >= Number(price)) {
      toast.error('Offer price must be less than regular price');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = await getToken();
      const { data } = await axios.put('/api/product/edit', {
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : null,
        productId: selectedProductId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        toast.success("Product updated successfully!");
        await fetchProductData();
        setSelectedProductId("");
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Product</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
          >
            <option value="">Choose a product to edit</option>
            {myProducts.map(product => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter product name"
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea 
                rows={4} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Describe your product"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (PKR) *</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="0"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Offer Price (PKR)</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  value={offerPrice} 
                  onChange={e => setOfferPrice(e.target.value)} 
                  placeholder="Optional"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors" 
              disabled={loading}
            >
              {loading ? 'Updating Product...' : 'Update Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}