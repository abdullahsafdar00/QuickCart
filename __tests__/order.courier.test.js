const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust if using custom server, else mock API handler
const Order = require('../models/order');

describe('Order Creation with Courier Integration', () => {
  beforeAll(async () => {
    // Connect to test DB if needed
  });
  afterAll(async () => {
    // Clean up
    await mongoose.connection.close();
  });
  it('should create an order with courier info', async () => {
    // Mock user, address, and cart
    const userId = 'testuser';
    const address = 'testaddress';
    const items = [{ product: 'testproduct', quantity: 1 }];
    const courierName = 'mnp';
    // Simulate API call
    const res = await request(app)
      .post('/api/order/create')
      .send({ address, items, courierName });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.courier.courierName).toBe('mnp');
    expect(res.body.courier.courierTrackingNumber).toMatch(/^MNP-/);
  });
}); 