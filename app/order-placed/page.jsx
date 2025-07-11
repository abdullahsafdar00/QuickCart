'use client'

import React from 'react'
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';


const OrderPlaced = () => {

  const { router } = useAppContext();

  setTimeout(() => {
    router.push('/my-orders')
  }, 2000);


  return (
    <div>
       <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='Success' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      <div className="text-sm text-gray-500">Redirecting shortly...</div>
    </div>
    </div>
  )
}

export default OrderPlaced;
