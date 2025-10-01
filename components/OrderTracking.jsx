'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderTracking = ({ order, token }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!order.courierTrackingNumber || !order.courierName) {
      toast.error('Tracking information not available');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/courier', {
        action: 'track',
        trackingNumber: order.courierTrackingNumber,
        courier: order.courierName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setTrackingInfo(data);
      } else {
        toast.error('Unable to fetch tracking information');
      }
    } catch (error) {
      toast.error('Tracking service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'picked up': return 'text-yellow-600 bg-yellow-100';
      case 'booked': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-6 mb-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
          <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">PKR {order.amount}</p>
          <div className="flex gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentMethod === 'cod' ? 'COD' : order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Courier Information */}
      {order.courierName && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">
                {order.courierName.toUpperCase()} Courier
              </p>
              {order.courierTrackingNumber && (
                <p className="text-sm text-gray-600 font-mono">
                  Tracking: {order.courierTrackingNumber}
                </p>
              )}
            </div>
            <button
              onClick={trackOrder}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
            >
              {loading ? 'Tracking...' : 'Track Package'}
            </button>
          </div>
        </div>
      )}

      {/* Tracking Information */}
      {trackingInfo && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t pt-4"
        >
          <h4 className="font-medium text-gray-900 mb-3">Tracking History</h4>
          <div className="space-y-3">
            {trackingInfo.history?.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.status}</p>
                  <p className="text-xs text-gray-500">{event.location} • {event.timestamp}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Current Status: {trackingInfo.status}</p>
                {trackingInfo.location && (
                  <p className="text-xs text-gray-400">Location: {trackingInfo.location}</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Payment Information */}
      {order.paymentMethod !== 'cod' && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium capitalize">{order.paymentMethod}</span>
          </div>
          {order.paymentTxnId && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-xs">{order.paymentTxnId}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OrderTracking;