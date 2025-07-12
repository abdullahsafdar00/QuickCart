"use client";

import React, { useState, useEffect } from "react";
import { assets, BagIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ContactIcon, PaintbrushVerticalIcon, Menu, X } from "lucide-react";
import { ShoppingBagIcon } from "lucide-react";

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
    { label: "My Cart", href: "/cart", icon: <CartIcon /> },
    { label: "My Orders", href: "/my-orders", icon: <BagIcon /> },
    { label: "About", href: "/about-us", icon: <HomeIcon /> },
    { label: "Contact", href: "/contact-us", icon: <ContactIcon /> },
    { label: "Privacy Policy", href: "/privacy-policy", icon: <PaintbrushVerticalIcon /> }
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
          className="text-2xl flex-1 text-center cursor-pointer md:text-3xl md:flex-none md:ml-0"
          onClick={() => router.push("/")}
        >
          <span className="text-[#EA580C]">HM</span>Electronics
        </motion.h1>

        {/* Desktop Links */}
        <motion.div
          className="hidden md:flex items-center gap-6"
          variants={containerVariants}
        >
          {["/", "/all-products", "/about-us", "/contact-us", "/privacy-policy"].map(
            (href, index) => {
              const label = ["Home", "Shop", "About Us", "Contact Us", "Privacy Policy"][index];
              return (
                <motion.div key={href} variants={itemVariants}>
                  <Link
                    href={href}
                    className="relative inline-block text-gray-600 transition hover:text-black
                      after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-0 
                      after:bg-[#EA580C] after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            }
          )}
        </motion.div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* Search Toggle Icon */}
          <button onClick={() => setShowSearch(!showSearch)}>
            <Image className="w-5 h-5" src={assets.search_icon} alt="search icon" />
          </button>

          {/* Cart */}
          <div className="relative">
            <button onClick={() => router.push("/cart")}>
              <Image className="w-6 h-6" src={assets.cart_icon} alt="cart icon" />
              <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
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
              <Image src={assets.user_icon} alt="user icon" />
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
