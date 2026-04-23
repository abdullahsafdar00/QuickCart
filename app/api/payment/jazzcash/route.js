import { NextResponse } from 'next/server';
import PaymentService from '@/lib/payment-services';

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    if (!orderData.amount || !orderData.orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await PaymentService.initiateJazzCashPayment(orderData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.paymentUrl,
        formData: result.formData,
        txnRefNo: result.txnRefNo
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('JazzCash API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}