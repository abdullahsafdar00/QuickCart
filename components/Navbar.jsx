"use client";

import React, { useState, useEffect } from "react";
import { assets, BagIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {  Menu, X, ChevronDown, ShoppingBagIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } }
};

const Navbar = () => {
  const { router, user, getCartCount, products } = useAppContext();
  const { openSignIn } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategorySlider, setShowCategorySlider] = useState(false);

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Filter products by selected category
  const categoryProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const navLinks = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "All Products", href: "/all-products", icon: <ShoppingBagIcon/> },
    { label: "My Orders", href: "/my-orders", icon: <BagIcon /> },
  ];

  return (
    <>
      {/* --- NAVBAR --- */}
      <motion.nav
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="relative flex items-center justify-between px-4 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white z-50"
      >
        {/* Mobile: Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <motion.h1
          variants={itemVariants}
          className="text-2xl md:text-3xl font-extrabold flex-1 text-center cursor-pointer md:flex-none md:ml-0 tracking-tight text-gray-800"
          onClick={() => router.push("/")}
        >
          <span className="text-[#EA580C]">HM</span>Electronics
        </motion.h1>

       {/* Desktop Links */}
{/* Desktop Links */}
<motion.div
  className="hidden md:flex items-center gap-8"
  variants={containerVariants}
>
  {[
    "/", "/all-products", "/about-us", "/contact-us", "/privacy-policy"
  ].map((href, index) => {
    const label = [
      "Home",
      "Shop",
      "About Us",
      "Contact Us",
      "Privacy Policy"
    ][index];

    return (
      <motion.div key={href} variants={itemVariants}>
        <Link
          href={href}
          className="relative inline-block text-base md:text-lg font-semibold text-gray-800 transition hover:text-orange-500 tracking-tight
            after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-0 
            after:bg-[#EA580C] after:transition-all after:duration-300 hover:after:w-full"
        >
          {label}
        </Link>
      </motion.div>
    );
  })}

  {/* Categories Dropdown with Icon */}
  <motion.div variants={itemVariants} className="relative group">
    <div className="flex items-center gap-1 cursor-pointer text-base md:text-lg font-semibold text-gray-800 hover:text-orange-500 tracking-tight
      after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-0 
      after:bg-[#EA580C] after:transition-all after:duration-300 group-hover:after:w-full
      relative"
    >
      <span>Categories</span>
      <ChevronDown
        size={18}
        className="transition-transform duration-300 group-hover:rotate-180"
      />
    </div>

    {/* Hover-safe dropdown */}
    <div className="absolute left-0 mt-2 w-52 bg-white shadow-lg rounded-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            router.push(`/all-products?category=${encodeURIComponent(cat)}`);
            setMobileMenuOpen(false);
          }}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-orange-50 text-sm md:text-base"
        >
          {cat}
        </button>
      ))}
    </div>
  </motion.div>
</motion.div>



        {/* Right Icons */}
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* Search Toggle Icon */}
          <button onClick={() => setShowSearch(!showSearch)}>
            <Image className="w-6 h-6 font-extrabold " src={assets.search_icon} alt="search icon" />
          </button>

          {/* Cart */}
          
          <div className="relative">
            <button onClick={() => router.push("/cart")}>
              <Image className="w-6 h-6" src={assets.cart_icon} alt="cart icon" />
              {getCartCount() > 0 ? (<span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>) : ""}
              
            </button>
          </div>

          {/* Auth */}
          {user ? (
            <>
            <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>

            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
            
            </>
            

          ) : (
            <button onClick={openSignIn}>
              <Image src={assets.user_icon} alt="user icon" className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 p-4 flex flex-col gap-4 md:hidden">
            {navLinks.map(({ label, href, icon }) => (
              <button
                key={href}
                onClick={() => {
                  router.push(href);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-gray-700 hover:text-black"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
            <hr className="my-2 border-gray-200" />
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700 text-base md:text-lg tracking-tight">Categories</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    router.push(`/all-products?category=${encodeURIComponent(cat)}`);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-2 py-1 rounded hover:bg-orange-50 text-gray-700 text-base md:text-lg font-medium"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.nav>

      {/* --- SEARCH BAR BELOW NAV --- */}
      {showSearch && (
        <div className="px-4 md:px-16 lg:px-32 py-4 bg-white shadow-md relative z-40">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute top-6 left-[90%] cursor-pointer" onClick={() => setShowSearch(false)}> <X size={24}/> </span>

          {/* Search Results */}
          {searchTerm && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      router.push(`/product/${product._id}`);
                      setSearchTerm("");
                      setShowSearch(false);
                    }}
                    className="flex items-center gap-4 border p-3 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 px-2">No products found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
