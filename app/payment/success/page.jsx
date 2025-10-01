'use client'
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully.</p>
        </div>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/my-orders')}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>You will receive an email confirmation shortly.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      </motion.div>
    </div>
  );
};

const PaymentSuccess = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
        <PaymentSuccessContent />
      </Suspense>
    </>
  );
};

export default PaymentSuccess;