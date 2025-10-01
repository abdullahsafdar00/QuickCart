"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function EditProduct() {
  const { getToken, user, router, products, fetchProductData } = useAppContext();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const uploadToCloudinary = async (file) => {
    const sigRes = await fetch('/api/cloudinary/signature');
    const sigJson = await sigRes.json();
    if (!sigJson.success) throw new Error(sigJson.message || 'Failed to fetch upload signature');

    const { signature, timestamp, cloudName } = sigJson;
    const url = `https://api.cloudinary.com/v1_1/${cloudName || 'dlwtqjap0'}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Cloudinary upload failed: ${res.status} ${errorData}`);
    }
    const data = await res.json();
    return data.secure_url;
  };

  useEffect(() => {
    if (user && products && products.length > 0) {
      const userProducts = products.filter(p => p.userId === user.id);
      setMyProducts(userProducts);
    } else {
      setMyProducts([]);
    }
  }, [user, products]);

  useEffect(() => {
    if (selectedProductId && myProducts.length > 0) {
      const prod = myProducts.find(p => p._id === selectedProductId);
      if (prod) {
        setName(prod.name || "");
        setDescription(prod.description || "");
        setCategory(prod.category || "Earphone");
        setPrice(prod.price ? String(prod.price) : "");
        setOfferPrice(prod.offerPrice ? String(prod.offerPrice) : "");
        setImageUrls(Array.isArray(prod.image) ? prod.image : []);
        setFiles([]);
        setStatus("");
      }
    }
  }, [selectedProductId, myProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !price) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setStatus('loading');
    setUploading(true);
    
    try {
      let newImageUrls = [...imageUrls];
      const validFiles = files.filter(file => file);
      
      if (validFiles.length > 0) {
        const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        newImageUrls = [...newImageUrls, ...uploadedUrls];
      }
      
      setUploading(false);
      
      const formData = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : undefined,
        image: newImageUrls,
        productId: selectedProductId,
      };
      
      const token = await getToken();
      const { data } = await axios.put('/api/product/edit', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        toast.success("Product updated successfully!");
        setStatus('success');
        await fetchProductData();
      } else {
        toast.error(data.message || 'Failed to update product');
        setStatus('error');
      }
    } catch (error) {
      setUploading(false);
      toast.error('Failed to update product');
      setStatus('error');
    }
  };

  if (user === null) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select a product to edit:</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:border-orange-500"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Select a product --</option>
            {myProducts.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Product Name *</label>
              <input 
                type="text" 
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium">Product Description *</label>
              <textarea 
                rows={4} 
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 resize-none" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required
              />
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex flex-col gap-1 w-32">
                <label className="text-base font-medium">Price *</label>
                <input 
                  type="number" 
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="md:px-6 px-6 h-10 text-white bg-orange-600 hover:bg-orange-700 rounded-md" 
              disabled={uploading || status === 'loading'}
            >
              {status === 'loading' ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}