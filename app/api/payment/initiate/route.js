import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import PaymentService from '@/lib/payment-services';
import Order from '@/models/order';

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, paymentMethod } = await request.json();

    const order = await Order.findById(orderId);
    if (!order || order.userId !== userId) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const orderData = {
      orderId: order._id,
      amount: order.amount,
      email: order.email,
      phone: order.phone
    };

    let paymentResponse;

    if (paymentMethod === 'jazzcash') {
      paymentResponse = await PaymentService.initiateJazzCashPayment(orderData);
    } else if (paymentMethod === 'easypaisa') {
      paymentResponse = await PaymentService.initiateEasyPaisaPayment(orderData);
    } else {
      return NextResponse.json({ success: false, message: 'Invalid payment method' }, { status: 400 });
    }

    if (paymentResponse.success) {
      // Update order with payment initiation
      order.paymentMethod = paymentMethod;
      order.paymentStatus = 'pending';
      order.paymentTxnRef = paymentResponse.txnRefNo || paymentResponse.orderId;
      await order.save();

      return NextResponse.json({
        success: true,
        paymentUrl: paymentResponse.paymentUrl,
        formData: paymentResponse.formData
      });
    } else {
      return NextResponse.json({ success: false, message: paymentResponse.error }, { status: 500 });
    }

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}