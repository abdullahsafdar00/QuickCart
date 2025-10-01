import { NextResponse } from 'next/server';
import PaymentService from '@/lib/payment-services';
import Order from '@/models/order';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const responseData = Object.fromEntries(formData);

    let verificationResult;
    let orderId;

    // Determine payment method and verify
    if (responseData.pp_TxnRefNo) {
      // JazzCash response
      verificationResult = PaymentService.verifyJazzCashPayment(responseData);
      orderId = responseData.pp_BillReference;
    } else if (responseData.orderRefNum) {
      // EasyPaisa response
      verificationResult = PaymentService.verifyEasyPaisaPayment(responseData);
      orderId = responseData.orderRefNum.replace('EP', '');
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
    }

    if (verificationResult.isValid && verificationResult.status === 'success') {
      // Payment successful
      order.paymentStatus = 'completed';
      order.paymentTxnId = verificationResult.transactionId;
      order.status = 'Payment Confirmed';
      await order.save();

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${orderId}`);
    } else {
      // Payment failed
      order.paymentStatus = 'failed';
      order.paymentError = verificationResult.responseMessage || 'Payment verification failed';
      await order.save();

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed?orderId=${orderId}`);
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/failed`);
  }
}

export async function GET(request) {
  // Handle GET requests (some payment gateways use GET for callbacks)
  const { searchParams } = new URL(request.url);
  const responseData = Object.fromEntries(searchParams);
  
  // Convert to POST-like handling
  const mockRequest = {
    formData: async () => {
      const formData = new FormData();
      Object.entries(responseData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      return formData;
    }
  };
  
  return POST(mockRequest);
}