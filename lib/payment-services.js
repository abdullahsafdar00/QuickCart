// JazzCash and EasyPaisa Payment Integration
import crypto from 'crypto';
import axios from 'axios';

export class PaymentService {
  constructor() {
    this.jazzCashConfig = {
      merchantId: process.env.JAZZCASH_MERCHANT_ID,
      password: process.env.JAZZCASH_PASSWORD,
      integritySalt: process.env.JAZZCASH_INTEGRITY_SALT,
      returnUrl: process.env.JAZZCASH_RETURN_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      apiUrl: process.env.JAZZCASH_API_URL || 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction'
    };

    this.easyPaisaConfig = {
      storeId: process.env.EASYPAISA_STORE_ID,
      hashKey: process.env.EASYPAISA_HASH_KEY,
      returnUrl: process.env.EASYPAISA_RETURN_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      apiUrl: process.env.EASYPAISA_API_URL || 'https://easypaisa.com.pk/easypay/Index.jsf'
    };
  }

  // JazzCash Integration
  async initiateJazzCashPayment(orderData) {
    try {
      const txnRefNo = `T${Date.now()}`;
      const amount = Math.round(orderData.amount * 100); // Convert to paisa
      const expiryDateTime = this.getExpiryDateTime();

      const postData = {
        pp_Version: '1.1',
        pp_TxnType: 'MWALLET',
        pp_Language: 'EN',
        pp_MerchantID: this.jazzCashConfig.merchantId,
        pp_SubMerchantID: '',
        pp_Password: this.jazzCashConfig.password,
        pp_BankID: 'TBANK',
        pp_ProductID: 'RETL',
        pp_TxnRefNo: txnRefNo,
        pp_Amount: amount,
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: this.getCurrentDateTime(),
        pp_BillReference: orderData.orderId,
        pp_Description: `Payment for Order ${orderData.orderId}`,
        pp_TxnExpiryDateTime: expiryDateTime,
        pp_ReturnURL: this.jazzCashConfig.returnUrl,
        pp_SecureHash: '',
        ppmpf_1: '1',
        ppmpf_2: '2',
        ppmpf_3: '3',
        ppmpf_4: '4',
        ppmpf_5: '5'
      };

      // Generate secure hash
      postData.pp_SecureHash = this.generateJazzCashHash(postData);

      return {
        success: true,
        paymentUrl: this.jazzCashConfig.apiUrl,
        formData: postData,
        txnRefNo
      };
    } catch (error) {
      console.error('JazzCash Payment Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // EasyPaisa Integration
  async initiateEasyPaisaPayment(orderData) {
    try {
      const orderId = `EP${Date.now()}`;
      const amount = orderData.amount.toFixed(2);
      const expiryDate = this.getEasyPaisaExpiryDate();

      const postData = {
        storeId: this.easyPaisaConfig.storeId,
        amount: amount,
        postBackURL: this.easyPaisaConfig.returnUrl,
        orderRefNum: orderId,
        expiryDate: expiryDate,
        merchantHashedReq: '',
        autoRedirect: '1',
        paymentMethod: 'InitialRequest',
        emailAddr: orderData.email || '',
        mobileNum: orderData.phone || ''
      };

      // Generate hash
      postData.merchantHashedReq = this.generateEasyPaisaHash(postData);

      return {
        success: true,
        paymentUrl: this.easyPaisaConfig.apiUrl,
        formData: postData,
        orderId
      };
    } catch (error) {
      console.error('EasyPaisa Payment Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify JazzCash Payment
  verifyJazzCashPayment(responseData) {
    try {
      const receivedHash = responseData.pp_SecureHash;
      delete responseData.pp_SecureHash;
      
      const calculatedHash = this.generateJazzCashHash(responseData);
      
      return {
        isValid: receivedHash === calculatedHash,
        status: responseData.pp_ResponseCode === '000' ? 'success' : 'failed',
        transactionId: responseData.pp_TxnRefNo,
        amount: responseData.pp_Amount / 100,
        responseCode: responseData.pp_ResponseCode,
        responseMessage: responseData.pp_ResponseMessage
      };
    } catch (error) {
      return {
        isValid: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Verify EasyPaisa Payment
  verifyEasyPaisaPayment(responseData) {
    try {
      const receivedHash = responseData.merchantHashedResp;
      const calculatedHash = this.generateEasyPaisaResponseHash(responseData);
      
      return {
        isValid: receivedHash === calculatedHash,
        status: responseData.responseCode === '0000' ? 'success' : 'failed',
        transactionId: responseData.orderRefNum,
        amount: parseFloat(responseData.amount),
        responseCode: responseData.responseCode,
        responseMessage: responseData.responseDesc
      };
    } catch (error) {
      return {
        isValid: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Helper Methods
  generateJazzCashHash(data) {
    const sortedKeys = Object.keys(data).filter(key => key !== 'pp_SecureHash').sort();
    let hashString = this.jazzCashConfig.integritySalt + '&';
    
    sortedKeys.forEach(key => {
      if (data[key] !== '') {
        hashString += data[key] + '&';
      }
    });
    
    hashString = hashString.slice(0, -1);
    return crypto.createHash('sha256').update(hashString).digest('hex').toUpperCase();
  }

  generateEasyPaisaHash(data) {
    const hashString = `${data.amount}&${this.easyPaisaConfig.storeId}&${data.orderRefNum}&${data.expiryDate}&${this.easyPaisaConfig.hashKey}`;
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  generateEasyPaisaResponseHash(data) {
    const hashString = `${data.amount}&${data.orderRefNum}&${data.responseCode}&${data.responseDesc}&${this.easyPaisaConfig.hashKey}`;
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  getCurrentDateTime() {
    const now = new Date();
    return now.getFullYear() +
           String(now.getMonth() + 1).padStart(2, '0') +
           String(now.getDate()).padStart(2, '0') +
           String(now.getHours()).padStart(2, '0') +
           String(now.getMinutes()).padStart(2, '0') +
           String(now.getSeconds()).padStart(2, '0');
  }

  getExpiryDateTime() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    return expiry.getFullYear() +
           String(expiry.getMonth() + 1).padStart(2, '0') +
           String(expiry.getDate()).padStart(2, '0') +
           String(expiry.getHours()).padStart(2, '0') +
           String(expiry.getMinutes()).padStart(2, '0') +
           String(expiry.getSeconds()).padStart(2, '0');
  }

  getEasyPaisaExpiryDate() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return expiry.getFullYear() +
           String(expiry.getMonth() + 1).padStart(2, '0') +
           String(expiry.getDate()).padStart(2, '0') + ' ' +
           String(expiry.getHours()).padStart(2, '0') + ':' +
           String(expiry.getMinutes()).padStart(2, '0') + ':' +
           String(expiry.getSeconds()).padStart(2, '0');
  }
}

export default new PaymentService();