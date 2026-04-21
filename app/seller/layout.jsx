import { auth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import { redirect } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function SellerLayout({ children }) {
  const { userId } = await auth(); // ✅ FIXED

  if (!userId) {
    redirect('/access-denied');
  }

  const isSeller = await authSeller(userId);
  if (!isSeller) {
    redirect('/access-denied');
  }

  return (
    <div>
      <div className='flex w-full'>
        {children}
      </div>
    </div>
  );
}