import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import PaymentService from '@/lib/payment-services';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId') || searchParams.get('OrderNumber');
  
  if (orderId) {
    return redirect(`/payment/success?orderId=${orderId}`);
  }
  
  return redirect('/payment/failed');
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    let verificationResult;
    
    // Determine payment method and verify accordingly
    if (data.OrderNumber && data.Signature) {
      // PayPro Pakistan
      verificationResult = PaymentService.verifyPayProPayment(data);
    } else if (data.pp_TxnRefNo && data.pp_SecureHash) {
      // JazzCash
      verificationResult = PaymentService.verifyJazzCashPayment(data);
    } else if (data.orderRefNum && data.merchantHashedResp) {
      // EasyPaisa
      verificationResult = PaymentService.verifyEasyPaisaPayment(data);
    } else {
      throw new Error('Unknown payment method');
    }
    
    if (verificationResult.isValid && verificationResult.status === 'success') {
      // Payment successful - redirect to success page
      const orderId = verificationResult.transactionId;
      return redirect(`/payment/success?orderId=${orderId}`);
    } else {
      // Payment failed - redirect to failure page
      return redirect('/payment/failed');
    }
    
  } catch (error) {
    console.error('Payment callback error:', error);
    return redirect('/payment/failed');
  }
}