'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import axios from 'axios';

const PaymentPage = () => {
  const router = useRouter();
  const { cartItems, products, getCartAmount, clearCart } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('paypro');

  const handlePayment = async () => {
    if (Object.keys(cartItems).length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        amount: getCartAmount(),
        orderId: `ORDER_${Date.now()}`,
        customerName: 'Customer',
        email: 'customer@example.com',
        phone: '03001234567',
        address: 'Customer Address',
        items: cartItems
      };

      let response;
      switch (selectedPayment) {
        case 'paypro':
          response = await axios.post('/api/payment/paypro', orderData);
          break;
        case 'jazzcash':
          response = await axios.post('/api/payment/jazzcash', orderData);
          break;
        case 'easypaisa':
          response = await axios.post('/api/payment/easypaisa', orderData);
          break;
        default:
          throw new Error('Invalid payment method');
      }

      if (response.data.success) {
        if (selectedPayment === 'paypro') {
          window.location.href = response.data.paymentUrl;
        } else {
          // For JazzCash and EasyPaisa, create form and submit
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = response.data.paymentUrl;
          
          Object.entries(response.data.formData).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });
          
          document.body.appendChild(form);
          form.submit();
        }
      } else {
        throw new Error(response.data.error || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'paypro',
      name: 'PayPro Pakistan',
      description: 'Secure payment with PayPro',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 8h12M6 12h8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Pay with JazzCash mobile wallet',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      description: 'Pay with EasyPaisa mobile wallet',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Payment</h1>
              <p className="text-gray-600 mt-2">Choose your preferred payment method</p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Payment Methods */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`${selectedPayment === method.id ? 'text-orange-600' : 'text-gray-400'}`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {Object.keys(cartItems).map((itemId) => {
                        const product = products.find(p => p._id === itemId);
                        if (!product || cartItems[itemId] <= 0) return null;
                        
                        return (
                          <div key={itemId} className="flex justify-between text-sm">
                            <span>{product.name} x {cartItems[itemId]}</span>
                            <span>Rs. {((product.offerPrice || product.price) * cartItems[itemId]).toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>Rs. {getCartAmount().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading || Object.keys(cartItems).length === 0}
                    className="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      `Pay Rs. ${getCartAmount().toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;