'use client'

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { SignInButton } from '@clerk/nextjs';

const COURIERS = [
  { name: "TCS", value: "tcs", logo: "🚚", description: "Fast & Reliable" },
  { name: "M&P Express", value: "mnp", logo: "📦", description: "Nationwide Coverage" },
  { name: "Leopard", value: "leopard", logo: "🐆", description: "Quick Delivery" },
];

const PAYMENT_METHODS = [
  { name: "Cash on Delivery", value: "cod", logo: "💵", description: "Pay when you receive" },
  { name: "PayPro Pakistan", value: "paypro", logo: "💳", description: "Secure Online Payment" },
  { name: "JazzCash", value: "jazzcash", logo: "📱", description: "Mobile Wallet" },
  { name: "EasyPaisa", value: "easypaisa", logo: "💳", description: "Digital Payment" },
];

const OrderSummary = () => {


  const { currency, router, getCartCount, getCartAmount, getToken, user, setCartItems, cartItems } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState("")
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [autoSuggestedCourier, setAutoSuggestedCourier] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [courierRates, setCourierRates] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    const token = await getToken();
    try {

      const { data } = await axios.get('/api/user/get-address', {headers: { Authorization: `Bearer ${token}`}})
    if(data.success) {
      setUserAddresses(data.addresses)
      if(data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0])
      }
    }  else {
      toast.error(data.message)
    }
    
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // Auto-suggest best courier based on city and fetch rates
  useEffect(() => {
    if (selectedAddress) {
      const city = selectedAddress.city?.toLowerCase() || "";
      if (city.includes("karachi")) setAutoSuggestedCourier("tcs");
      else if (city.includes("lahore")) setAutoSuggestedCourier("mnp");
      else setAutoSuggestedCourier("tcs");
      
      // Fetch courier rates
      fetchCourierRates(city);
    }
  }, [selectedAddress]);

  const fetchCourierRates = async (toCity) => {
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/courier', {
        action: 'rates',
        fromCity: 'karachi',
        toCity,
        weight: 1
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      if (data.success) {
        setCourierRates(data.rates);
      }
    } catch (error) {
      console.error('Error fetching courier rates:', error);
    }
  };

  const createOrder = async () => {
    setStatus("loading")
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address")
      }
      if (!selectedCourier) {
        return toast.error("Please select a courier service")
      }

      let cartItemsArray = Object.keys(cartItems).map((key)=>({product: key, quantity: cartItems[key]}))
      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error("Cart is empty")
      } 

      const token = await getToken();
      const { data } = await axios.post('/api/order/create', {
        address: selectedAddress._id, 
        items: cartItemsArray, 
        courierName: selectedCourier,
        paymentMethod: selectedPaymentMethod
      }, {headers: {Authorization: `Bearer ${token}`}})

      if (data.success) {
        if (selectedPaymentMethod === 'cod') {
          toast.success(data.message)
          setCartItems({})
          router.push('/order-placed')
        } else {
          // Handle online payment - redirect to payment page
          router.push(`/payment?orderId=${data.orderId}&method=${selectedPaymentMethod}`)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setStatus("")
    }
  }

  const initiatePayment = async (orderId) => {
    setIsProcessingPayment(true)
    try {
      const token = await getToken();
      const { data } = await axios.post('/api/payment/initiate', {
        orderId,
        paymentMethod: selectedPaymentMethod
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        // Create form and submit to payment gateway
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.paymentUrl
        
        Object.entries(data.formData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })
        
        document.body.appendChild(form)
        form.submit()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Payment initiation failed')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <motion.div  initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <>
      { !user ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-8">
          <p className="text-gray-700 text-center text-base">To place your order, please sign in with Google. This helps us keep your orders secure and lets you track your purchases easily.</p>
          <SignInButton mode="modal" provider="google">
            <button className="w-full bg-orange-600 h-12 text-white py-3 mt-2 hover:bg-orange-700 rounded-md text-lg font-medium">Continue with Google</button>
          </SignInButton>
        </div>
      ) : (
      <>
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>
        {/* Courier Selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-3">
            Select Courier Service
          </label>
          <div className="space-y-3">
            {COURIERS.map(courier => (
              <div key={courier.value} className={`border rounded-lg p-3 cursor-pointer transition-all ${
                (selectedCourier || autoSuggestedCourier) === courier.value 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCourier(courier.value)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{courier.logo}</span>
                    <div>
                      <p className="font-medium text-gray-800">{courier.name}</p>
                      <p className="text-sm text-gray-500">{courier.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {courierRates[courier.value] ? `${currency}${courierRates[courier.value]}` : `${currency}250`}
                    </p>
                    {autoSuggestedCourier === courier.value && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Recommended</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-3">
            Payment Method
          </label>
          <div className="space-y-3">
            {PAYMENT_METHODS.map(method => (
              <div key={method.value} className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedPaymentMethod === method.value 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPaymentMethod(method.value)}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.logo}</span>
                  <div>
                    <p className="font-medium text-gray-800">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{getCartAmount()}</p>
          </div>
          
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">{currency}250</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{getCartAmount() ? `${currency}${getCartAmount() + 250}`: 0}</p>
          </div>
        </div>
      </div>

          <button
          type="submit"
          onClick={createOrder}
          disabled={status === "loading" || isProcessingPayment}
          className="w-full bg-orange-600 h-12 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" || isProcessingPayment ?  
            <span className="flex items-center justify-center space-x-1">
              <span className="w-1.5 h-1.5 text-center bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 text-center bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 text-center bg-white rounded-full animate-bounce" />
            </span> 
            : selectedPaymentMethod === 'cod' ? "Place Order" : `Pay with ${PAYMENT_METHODS.find(m => m.value === selectedPaymentMethod)?.name}`
          }
        </button>
      </>
       )}
      </>
    </motion.div>
  );
};

export default OrderSummary;