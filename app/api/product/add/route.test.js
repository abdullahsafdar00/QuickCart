const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Mock Cloudinary and DB
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: jest.fn(() => (cb) => {
        cb(null, { secure_url: 'https://mocked.cloudinary.com/image.png' });
        return { end: jest.fn() };
      })
    },
    config: jest.fn()
  }
}));
jest.mock('@/config/db', () => jest.fn());
jest.mock('@/models/product', () => ({
  create: jest.fn(() => Promise.resolve({ _id: 'mockedid' }))
}));
jest.mock('@/lib/authSeller', () => jest.fn(() => true));
jest.mock('@clerk/nextjs/server', () => ({ getAuth: jest.fn(() => 'mockeduserid') }));

const route = require('./route.js');

// Setup Express app for testing Next.js API route
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper to simulate Next.js API route
app.post('/api/product/add', async (req, res) => {
  // Simulate Next.js request/response
  const request = {
    formData: async () => ({
      get: (key) => {
        if (key === 'name') return 'Test Product';
        if (key === 'description') return 'desc';
        if (key === 'category') return 'cat';
        if (key === 'price') return '10';
        if (key === 'offerPrice') return '8';
        return null;
      },
      getAll: (key) => {
        if (key === 'images') {
          // Simulate a file object with arrayBuffer
          return [{
            arrayBuffer: async () => Buffer.from('test'),
          }];
        }
        return [];
      }
    })
  };
  const nextRes = await route.POST(request);
  res.status(200).json(nextRes);
});

describe('Product Upload API', () => {
  it('should upload a product with image', async () => {
    const res = await request(app)
      .post('/api/product/add')
      .send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.newProduct).toBeDefined();
  });

  it('should return error for no files', async () => {
    // Patch formData to return no files
    const route = require('./route.js');
    const requestNoFiles = {
      formData: async () => ({
        get: () => null,
        getAll: () => []
      })
    };
    const res = await route.POST(requestNoFiles);
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/no files/i);
  });

  // You can add more tests for large payloads, auth, etc.
}); 