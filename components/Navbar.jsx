"use client";

import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ContactIcon } from "lucide-react";
import { PaintbrushVerticalIcon } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } }
};

const Navbar = () => {
  const {  router, user } = useAppContext();
  const { openSignIn } = useClerk();

  return (
    <motion.nav
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700"
    >
      {/* Logo */}
      <motion.h1
        variants={itemVariants}
        className="cursor-pointer w-28 md:w-32 text-3xl"
        onClick={() => router.push("/")}
      >
        <span className="text-[#EA580C]">HM</span>Electronics
      </motion.h1>

      {/* Desktop Links */}
      <motion.div
        className="flex items-center gap-4 lg:gap-8 max-md:hidden"
        variants={containerVariants}
      >
        {["/", "/all-products", "/about-us", "/contact-us", "/privacy-policy"].map(
          (href, index) => {
            const label = ["Home", "Shop", "About Us", "Contact Us", "Privacy Policy"][index];
            return (
              <motion.div key={href} variants={itemVariants}>
                <Link href={href} className="relative inline-block text-gray-600 transition 
  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:w-0 
  after:bg-[#EA580C] after:transition-all after:duration-300 hover:after:w-full">
                  {label}
                </Link>
              </motion.div>
            );
          }
        )}
      </motion.div>

      {/* Icons / Account */}
      <motion.ul
        className="hidden md:flex items-center gap-4"
        variants={containerVariants}
      >
        <motion.li variants={itemVariants}>
          <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        </motion.li>

        {user ? (
          <motion.li variants={itemVariants}>
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
          </motion.li>
        ) : (
          <motion.li variants={itemVariants}>
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 hover:text-gray-900 transition"
            >
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
          </motion.li>
        )}
      </motion.ul>

      {/* Mobile Icons */}
      <div className="flex items-center md:hidden gap-3">
        {user ? (
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
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => router.push("/")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => router.push("/all-products")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
             <UserButton.MenuItems>
              <UserButton.Action
                label="About"
                labelIcon={<HomeIcon/>}
                onClick={() => router.push("/about-us")}
              />
            </UserButton.MenuItems>
               <UserButton.MenuItems>
              <UserButton.Action
                label="Contact"
                labelIcon={<ContactIcon/>}
                onClick={() => router.push("/contact-us")}
              />
            </UserButton.MenuItems>
              <UserButton.MenuItems>
              <UserButton.Action
                label="Privacy Policy"
                labelIcon={<PaintbrushVerticalIcon/>}
                onClick={() => router.push("/privacy-policy")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
