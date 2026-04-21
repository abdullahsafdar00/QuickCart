import { auth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/seller/Sidebar'; // adjust path

export const dynamic = 'force-dynamic';

export default async function SellerLayout({ children }) {
  const { userId } = await auth();


  return (
    <div className="flex w-full">
      <Sidebar /> {/* ✅ NOW IT WILL SHOW */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}