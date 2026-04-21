'use client'
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedSellerRoute({ children }) {
  const { userId, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for both auth and user to be loaded
    if (!authLoaded || !userLoaded) {
      return;
    }

    // Check if user is authenticated and is a seller
    if (!userId) {
      router.replace('/access-denied');
      return;
    }

    if (user?.publicMetadata?.role === 'seller') {
      setIsAuthorized(true);
      setIsLoading(false);
    } else {
      router.replace('/access-denied');
    }
  }, [authLoaded, userLoaded, userId, user, router]);

  if (isLoading || !authLoaded || !userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
