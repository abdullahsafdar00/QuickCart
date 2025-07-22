"use client";


import React, { useEffect, useState, useCallback } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = 'ecommerce_unsigned';
const CLOUDINARY_CLOUD_NAME = 'dlwtqjap0';

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${errorData}`);
  }
  const data = await res.json();
  return data.secure_url;
}

  export default function EditProduct()  {
  const { getToken, user, router, products, fetchProductData } = useAppContext();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [files, setFiles] = useState([]); // for new uploads
  const [imageUrls, setImageUrls] = useState([]); // for existing images
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  // Reset form function
  const resetForm = useCallback(() => {
    setSelectedProductId("");
    setFiles([]);
    setImageUrls([]);
    setName("");
    setDescription("");
    setCategory("Earphone");
    setPrice("");
    setOfferPrice("");
    setStatus("");
  }, []);

  useEffect(() => {
    // Only show products belonging to the seller
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
    } else if (!selectedProductId) {
      // Reset form when no product is selected
      setName("");
      setDescription("");
      setCategory("Earphone");
      setPrice("");
      setOfferPrice("");
      setImageUrls([]);
      setFiles([]);
      setStatus("");
    }
  }, [selectedProductId, myProducts]);

  const handleImageChange = (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Each image must be less than 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only image files (JPEG, PNG, GIF)');
      return;
    }

    const updatedFiles = [...files];
    updatedFiles[idx] = file;
    setFiles(updatedFiles);
  };

  const handleRemoveImage = (idx) => {
    setImageUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!description.trim()) {
      toast.error('Product description is required');
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (imageUrls.length === 0 && files.filter(f => f).length === 0) {
      toast.error('At least one product image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    setUploading(true);
    
    try {
      // Upload new images to Cloudinary
      let newImageUrls = [...imageUrls];
      const validFiles = files.filter(file => file);
      
      if (validFiles.length > 0) {
        const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        newImageUrls = [...newImageUrls, ...uploadedUrls];
      }
      
      setUploading(false);
      
      // Prepare form data
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
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const { data } = await axios.put('/api/product/edit', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        toast.success("Product updated successfully!");
        setStatus('success');
        await fetchProductData(); // Refresh product data
        // Optionally reset form or keep it populated
      } else {
        toast.error(data.message || 'Failed to update product');
        setStatus('error');
      }
    } catch (error) {
      setUploading(false);
      console.error('Update product error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update product');
      setStatus('error');
    }
  };

  if (!user) {
    router.push('/access-denied')
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
          {myProducts.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No products found. Create a product first.</p>
          )}
        </div>

        {selectedProductId && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-base font-medium mb-2">Product Images</p>
              <div className="flex flex-wrap items-center gap-3">
                {/* Existing images */}
                {imageUrls.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative">
                    <Image 
                      src={url} 
                      alt={`Product ${idx + 1}`} 
                      width={100} 
                      height={100} 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)} 
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Preview new files */}
                {files.map((file, idx) => file && (
                  <div key={`new-${idx}`} className="relative">
                    <Image 
                      src={URL.createObjectURL(file)} 
                      alt={`New upload ${idx + 1}`} 
                      width={100} 
                      height={100} 
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveNewFile(idx)} 
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                      title="Remove new upload"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Upload areas */}
                {imageUrls.length + files.filter(f => f).length < 4 && (
                  [...Array(4 - imageUrls.length - files.filter(f => f).length)].map((_, idx) => (
                    <label 
                      key={`upload-${idx}`} 
                      htmlFor={`image-upload-${idx}`} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <input 
                        type="file" 
                        id={`image-upload-${idx}`} 
                        hidden 
                        accept="image/*"
                        onChange={e => handleImageChange(e, files.filter(f => f).length)} 
                      />
                      <Image 
                        src={assets.upload_area} 
                        alt="Upload area" 
                        width={100} 
                        height={100} 
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded"
                      />
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum 4 images. Each image must be less than 2MB.</p>
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium" htmlFor="product-name">Product Name *</label>
              <input 
                id="product-name" 
                type="text" 
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-orange-500" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                maxLength={100}
              />
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <label className="text-base font-medium" htmlFor="product-description">Product Description *</label>
              <textarea 
                id="product-description" 
                rows={4} 
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-orange-500 resize-none" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required
                maxLength={1000}
              />
            </div>

            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex flex-col gap-1 w-32">
                <label className="text-base font-medium" htmlFor="category">Category</label>
                <select 
                  id="category" 
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-orange-500" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                >
              <option value="Accessories">Accessories</option>
              <option value="Irons & Steamers">Irons & Steamers</option>
              <option value="Body Massager">Body Massager</option>
              <option value="Kitchen Appliances">Kitchen Appliances</option>
              <option value="Beauty products and tools">Beauty products and tools</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-32">
                <label className="text-base font-medium" htmlFor="product-price">Price *</label>
                <input 
                  id="product-price" 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-orange-500" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  required 
                />
              </div>

              <div className="flex flex-col gap-1 w-32">
                <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                <input 
                  id="offer-price" 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300 focus:border-orange-500" 
                  value={offerPrice} 
                  onChange={e => setOfferPrice(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="md:px-6 px-6 h-10 text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={uploading || status === 'loading'}
            >
              {uploading ? 'Uploading Images...' : status === 'loading' ? (
                <span className="flex items-center justify-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </span>
              ) : 'Update Product'}
            </button>

            {status === "success" && (
              <p className="text-green-600 pt-2 font-medium">✓ Product updated successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 pt-2">❌ Failed to update product. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};