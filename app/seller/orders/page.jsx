'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useUser } from '@clerk/nextjs';
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {

    const { currency, getToken, user, router, getCartAmount } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
      const { isLoaded } = useUser();
      const [isAuthorized, setIsAuthorized] = useState(false);
    

    const fetchSellerOrders = async () => {
        try {
            const token = await getToken();
            
            const { data } = await axios.get('/api/order/seller-orders', {headers: { Authorization: `Bearer ${token}`}})

            if(data.success) {
                setOrders(data.orders)
                setLoading(false)
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (isLoaded && user) {
            const role = user?.publicMetadata?.role;
            if (role === 'seller') {
                setIsAuthorized(true);
                fetchSellerOrders();
            } else {
                router.replace('/access-denied');
            }
        } else if (isLoaded && !user) {
            router.replace('/access-denied');
        }
    }, [isLoaded, user, router]);

    if (!isLoaded || !isAuthorized) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
       <div className="flex-1 min-h-screen flex flex-col justify-between text-sm">
  {loading ? (
    <Loading />
  ) : (
    <div className="md:p-10 p-4 space-y-5">
      <h2 className="text-lg font-medium">Orders</h2>
      <div className="max-w-4xl w-full space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-5 border rounded-md bg-white shadow-sm"
          >
            {/* Order Summary */}
            <div className="flex flex-col sm:flex-row gap-4 sm:max-w-sm w-full">
              <Image
                className="w-16 h-16 object-cover"
                src={assets.box_icon}
                alt="box_icon"
              />
              <div className="flex-1">
                <p className="font-medium break-words">
                  {order.items
                    .map(
                      (item) =>
                        `${item.product?.name ?? "Product"} x ${item.quantity}`
                    )
                    .join(", ")}
                </p>
                <p className="text-gray-600 mt-1">Items: {order.items.length}</p>
              </div>
            </div>

            {/* Address */}
            <div className="text-gray-700 text-sm w-full sm:w-1/3">
              <p className="font-medium">{order.address.fullName}</p>
              <p>{order.address.area}</p>
              <p>{`${order.address.city}, ${order.address.state}`}</p>
              <p>{order.address.phoneNumber}</p>
              {order.courierName && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-semibold">Courier:</span> {order.courierName.toUpperCase()}<br/>
                  <span className="font-semibold">Tracking #:</span> {order.courierTrackingNumber}<br/>
                  <span className="font-semibold">Status:</span> {order.courierStatus || 'N/A'}
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="text-black font-semibold my-auto sm:text-right">
              {currency}{order.amount}
            </div>

            {/* Meta Info */}
            <div className="text-gray-600 text-sm w-full sm:w-1/4">
              <p>Method: COD</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Payment: Pending</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
  <Footer />
</div>

    );
};

export default Orders;