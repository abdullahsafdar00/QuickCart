import React from 'react';
import ProtectedSellerRoute from '@/components/ProtectedSellerRoute';

// Seller layout with client-side authentication check to prevent access denied on refresh
export default function SellerLayout({ children }) {
  return (
    <ProtectedSellerRoute>
      <div>
        <div className='flex w-full'>
          {children}
        </div>
      </div>
    </ProtectedSellerRoute>
  );
}