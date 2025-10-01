
'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";



// Cloudinary client upload: request a server-signed signature before uploading
const CLOUDINARY_CLOUD_NAME = 'dlwtqjap0';

async function uploadToCloudinary(file) {
  // Request signature/timestamp from our server (which validates seller)
  const sigRes = await fetch('/api/cloudinary/signature');
  const sigJson = await sigRes.json();
  if (!sigJson.success) throw new Error(sigJson.message || 'Failed to fetch upload signature');

  const { signature, timestamp, cloudName } = sigJson;
  const url = `https://api.cloudinary.com/v1_1/${cloudName || CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  // If you want to set a folder or other options, include them here and include in signature server-side
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Cloudinary upload failed: ' + text);
  }
  const data = await res.json();
  return data.secure_url;
}

const AddProduct = () => {
  const { getToken, user, router } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const { isLoaded } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [status, setStatus] = useState("")
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setUploading(true);
    try {
      // Upload all images to Cloudinary first
      const imageUrls = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          const url = await uploadToCloudinary(files[i]);
          imageUrls.push(url);
        }
      }
      setUploading(false);
      // Now send product data with image URLs to backend
      const formData = {
        name,
        description,
        category,
        price,
        offerPrice,
        image: imageUrls,
      };
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {headers: {Authorization: `Bearer ${token}`}});
      if(data.success) {
        toast.success(data.message);
        setFiles('');
        setName('');
        setDescription('');
        setCategory('Earphone');
        setPrice('');
        setOfferPrice('');
        setStatus('success');
      } else {
        toast.error(data.message);
        setStatus('error');
      }
    } catch (error) {
      setUploading(false);
      toast.error(error.message);
      setStatus('error');
    }
  };

 useEffect(() => {
   if (isLoaded && user) {
     const role = user?.publicMetadata?.role;
     if (role === 'seller') {
       setIsAuthorized(true);
     } else {
       router.replace('/access-denied');
     }
   } else if (isLoaded && !user) {
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
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Accessories">Accessories</option>
              <option value="Irons & Steamers">Irons & Steamers</option>
              <option value="Body Massager">Body Massager</option>
              <option value="Kitchen Appliances">Kitchen Appliances</option>
              <option value="Beauty products and tools">Beauty products and tools</option>
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
          className="md:px-6 px-6 h-10 text-white bg-orange-600 rounded-md rounded-l-none"
          disabled={uploading || status === 'loading'}
        >
          {uploading ? 'Uploading Images...' : status === 'loading' ? (
            <span className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
            </span>
          ) : 'Add Product'}
        </button>
      </form>
         {status === "success" && (
        <p className="text-green-600 pt-2">Thank you for subscribing!</p>

      )}
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;