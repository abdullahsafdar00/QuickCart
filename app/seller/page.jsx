
'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useUser } from '@clerk/nextjs';
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";



// Cloudinary config (set these to your values)
const CLOUDINARY_UPLOAD_PRESET = 'ecommerce_unsigned'; // <-- set your unsigned preset name
const CLOUDINARY_CLOUD_NAME = 'dlwtqjap0'; // <-- set your Cloudinary cloud name

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Cloudinary upload failed');
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

 function isAdmin(){
    if (isLoaded) {
      const role = user?.publicMetadata?.role;
      if (role === 'seller') {
        setIsAuthorized(true);
      } else {
        router.replace('/access-denied'); // Optional: create this page
      }
    }
 }

 useEffect(() => {
  isAdmin();
 })
 
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

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
              <option value="Earphone">Accessories</option>
              <option value="Headphone">Irons & Steamers</option>
              <option value="Camera">Body Massager</option>
              <option value="Accessories">Kitchen Appliances</option>
              <option value="Hair Straighteners">Beauty products and tools</option>
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