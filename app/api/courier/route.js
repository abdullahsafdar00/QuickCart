import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import CourierService from '@/lib/courier-services';
import Order from '@/models/order';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { action, orderId, courier, trackingNumber } = await request.json();

    if (action === 'book') {
      const order = await Order.findById(orderId).populate('address');
      if (!order || order.userId !== userId) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }

      const orderData = {
        address: order.address,
        amount: order.amount,
        items: order.items,
        weight: order.weight || 1
      };

      let bookingResult;
      if (courier === 'tcs') {
        bookingResult = await CourierService.bookTCSShipment(orderData);
      } else if (courier === 'mnp') {
        bookingResult = await CourierService.bookMPShipment(orderData);
      } else {
        return NextResponse.json({ success: false, message: 'Invalid courier service' }, { status: 400 });
      }

      if (bookingResult.success) {
        order.courierName = courier;
        order.courierTrackingNumber = bookingResult.trackingNumber;
        order.courierStatus = 'Booked';
        order.courierMeta = bookingResult.courierResponse;
        await order.save();
      }

      return NextResponse.json(bookingResult);

    } else if (action === 'track') {
      const trackingResult = await CourierService.trackShipment(trackingNumber, courier);
      return NextResponse.json(trackingResult);

    } else if (action === 'rates') {
      const { fromCity, toCity, weight } = await request.json();
      const rates = await CourierService.getCourierRates(fromCity, toCity, weight);
      return NextResponse.json({ success: true, rates });

    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Courier API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}