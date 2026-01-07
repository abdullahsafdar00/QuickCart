// PayPro Pakistan, JazzCash and EasyPaisa Payment Integration
import crypto from 'crypto';
import axios from 'axios';

export class PaymentService {
  constructor() {
    this.validateEnvironmentVariables();
    
    this.payProConfig = {
      merchantId: process.env.PAYPRO_MERCHANT_ID,
      merchantSecret: process.env.PAYPRO_MERCHANT_SECRET,
      returnUrl: process.env.PAYPRO_RETURN_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      apiUrl: process.env.PAYPRO_API_URL || 'https://api.paypro.com.pk/cpay/payment'
    };

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

  validateEnvironmentVariables() {
    const requiredVars = {
      PAYPRO_MERCHANT_ID: process.env.PAYPRO_MERCHANT_ID,
      PAYPRO_MERCHANT_SECRET: process.env.PAYPRO_MERCHANT_SECRET,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    };

    const missing = Object.entries(requiredVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missing.length > 0) {
      console.warn(`Missing environment variables: ${missing.join(', ')}`);
    }
  }

  validateOrderData(orderData) {
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Invalid order data: must be an object');
    }
    if (!orderData.amount || typeof orderData.amount !== 'number' || orderData.amount <= 0) {
      throw new Error('Invalid amount: must be a positive number');
    }
    if (!orderData.orderId || typeof orderData.orderId !== 'string') {
      throw new Error('Invalid orderId: must be a non-empty string');
    }
  }

  // PayPro Pakistan Integration
  async initiatePayProPayment(orderData) {
    try {
      this.validateOrderData(orderData);
      
      const orderId = `PP${Date.now()}`;
      const amount = Math.round(orderData.amount * 100);
      
      const postData = {
        MerchantId: this.payProConfig.merchantId,
        OrderNumber: orderId,
        OrderAmount: amount,
        OrderDueDate: this.getPayProExpiryDate(),
        OrderType: 'Service',
        IssueDate: this.getCurrentDateTime(),
        OrderExpireAfterSeconds: '0',
        CustomerName: orderData.customerName || 'Customer',
        CustomerMobile: orderData.phone || '',
        CustomerEmail: orderData.email || '',
        CustomerAddress: orderData.address || '',
        ReturnUrl: this.payProConfig.returnUrl,
        CancelUrl: this.payProConfig.returnUrl,
        OrderItems: [{
          ItemId: orderData.orderId,
          ItemName: `Order ${orderData.orderId}`,
          Quantity: 1,
          UnitPrice: amount,
          ItemDescription: `Payment for Order ${orderData.orderId}`
        }]
      };

      postData.Signature = this.generatePayProSignature(postData);

      const response = await axios.post(this.payProConfig.apiUrl, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      if (response.data && response.data.Status === 'Success') {
        return {
          success: true,
          paymentUrl: response.data.PaymentGatewayUrl,
          orderId,
          transactionId: response.data.TransactionId
        };
      } else {
        throw new Error(response.data?.Message || 'PayPro payment initiation failed');
      }
    } catch (error) {
      console.error('PayPro Payment Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // JazzCash Integration
  async initiateJazzCashPayment(orderData) {
    try {
      this.validateOrderData(orderData);
      
      const txnRefNo = `T${Date.now()}`;
      const amount = Math.round(orderData.amount * 100);
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
      this.validateOrderData(orderData);
      
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

  // Verify PayPro Payment
  verifyPayProPayment(responseData) {
    try {
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response data');
      }

      const requiredFields = ['OrderNumber', 'Amount', 'Status', 'Signature'];
      const missingFields = requiredFields.filter(field => !responseData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const calculatedSignature = this.generatePayProResponseSignature(responseData);
      
      return {
        isValid: responseData.Signature === calculatedSignature,
        status: responseData.Status === 'Success' ? 'success' : 'failed',
        transactionId: responseData.OrderNumber,
        amount: parseFloat(responseData.Amount) / 100,
        responseMessage: responseData.Message || 'Payment processed'
      };
    } catch (error) {
      console.error('PayPro verification error:', error.message);
      return {
        isValid: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Verify JazzCash Payment
  verifyJazzCashPayment(responseData) {
    try {
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response data');
      }

      const responseDataCopy = { ...responseData };
      const receivedHash = responseDataCopy.pp_SecureHash;
      delete responseDataCopy.pp_SecureHash;
      
      const calculatedHash = this.generateJazzCashHash(responseDataCopy);
      
      return {
        isValid: receivedHash === calculatedHash,
        status: responseData.pp_ResponseCode === '000' ? 'success' : 'failed',
        transactionId: responseData.pp_TxnRefNo,
        amount: responseData.pp_Amount / 100,
        responseCode: responseData.pp_ResponseCode,
        responseMessage: responseData.pp_ResponseMessage
      };
    } catch (error) {
      console.error('JazzCash verification error:', error.message);
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
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response data');
      }

      const requiredFields = ['merchantHashedResp', 'responseCode', 'orderRefNum', 'amount', 'responseDesc'];
      const missingFields = requiredFields.filter(field => responseData[field] === undefined);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

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
      console.error('EasyPaisa verification error:', error.message);
      return {
        isValid: false,
        status: 'error',
        error: error.message
      };
    }
  }

  // Helper Methods
  generatePayProSignature(data) {
    const signatureString = `${data.MerchantId}${data.OrderNumber}${data.OrderAmount}${this.payProConfig.merchantSecret}`;
    return crypto.createHash('sha256').update(signatureString).digest('hex').toUpperCase();
  }

  generatePayProResponseSignature(data) {
    const signatureString = `${data.OrderNumber}${data.Amount}${data.Status}${this.payProConfig.merchantSecret}`;
    return crypto.createHash('sha256').update(signatureString).digest('hex').toUpperCase();
  }

  generateJazzCashHash(data) {
    const sortedKeys = Object.keys(data).filter(key => key !== 'pp_SecureHash').sort();
    let hashString = this.jazzCashConfig.integritySalt + '&';
    
    sortedKeys.forEach(key => {
      if (data[key] !== '' && data[key] != null && data[key] !== undefined) {
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

  formatDateTime(date) {
    return date.getFullYear() +
           String(date.getMonth() + 1).padStart(2, '0') +
           String(date.getDate()).padStart(2, '0') +
           String(date.getHours()).padStart(2, '0') +
           String(date.getMinutes()).padStart(2, '0') +
           String(date.getSeconds()).padStart(2, '0');
  }

  getCurrentDateTime() {
    return this.formatDateTime(new Date());
  }

  getExpiryDateTime() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    return this.formatDateTime(expiry);
  }

  getPayProExpiryDate() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return this.formatDateTime(expiry);
  }

  getEasyPaisaExpiryDate() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return this.formatDateTime(expiry);
  }
}

export default new PaymentService();