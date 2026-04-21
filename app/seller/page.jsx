"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

async function uploadToCloudinary(file) {
  const sigRes = await fetch('/api/cloudinary/signature');
  const sigJson = await sigRes.json();
  if (!sigJson.success) throw new Error(sigJson.message);

  const { signature, timestamp, cloudName } = sigJson;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST', 
    body: formData 
  });
  
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

export default function AddProduct() {
  const { getToken, user, router } = useAppContext();
  const { isLoaded } = useUser();
  
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !price) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const imageUrls = [];
      for (const file of files) {
        if (file) {
          const url = await uploadToCloudinary(file);
          imageUrls.push(url);
        }
      }
      
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', {
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        offerPrice: offerPrice ? Number(offerPrice) : null,
        image: imageUrls,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        toast.success('Product added successfully!');
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('Electronics');
        setPrice('');
        setOfferPrice('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role === 'seller') {
      setIsAuthorized(true);
    } else if (isLoaded) {
      router.replace('/access-denied');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !isAuthorized) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
 
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap text-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
                    toast.error('Each image must be less than 2MB');
                    return;
                  }
                  const updatedFiles = [...files];
                  updatedFiles[index] = file;
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium w-40" htmlFor="offer-price">
              Offer Price (Optional)
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

