"use client"

import React from 'react'
import { useAppContext } from '@/context/AppContext'
import { useClerk, UserButton } from "@clerk/nextjs";
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Navbar = () => {


  const { router, user } = useAppContext()
   const { openSignIn } = useClerk();

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
     <h1 className="cursor-pointer w-28 md:w-32 text-3xl"
        onClick={() => router.push('/')} >
           <Image src={assets.hmLogo} alt="HM Electronics" width={64} height={64} className="inline mr-2" />
        </h1>
         {user ? (
                 <UserButton/>
                ) : (
                  <li>
                    <button
                      onClick={openSignIn}
                      className="flex items-center gap-2 hover:text-gray-900 transition"
                    >
                      <Image src={assets.user_icon} alt="user icon" />
                    </button>
                  </li>
                )}
    </div>
  )
}

export default Navbar