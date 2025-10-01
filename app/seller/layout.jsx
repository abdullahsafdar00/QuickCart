import { getAuth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import { redirect } from 'next/navigation';
import React from 'react';

// Seller layout runs on the server and will only render children for sellers.
export default async function SellerLayout({ children }) {
  const { userId } = getAuth();
  if (!userId) {
    // Not authenticated - send to access denied
    redirect('/access-denied');
  }

  const isSeller = await authSeller(userId);
  if (!isSeller) {
    redirect('/access-denied');
  }

  // Render children; Navbar and Sidebar are client components and should be
  // rendered by the client wrapper inside the page content as needed.
  return (
    <div>
      <div className='flex w-full'>
        {children}
      </div>
    </div>
  );
}