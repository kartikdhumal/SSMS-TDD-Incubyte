require('dotenv').config({ path: '.env' });
const request = require('supertest');
const app = require('../../app');
const { default: mongoose } = require('mongoose');
const connectDB = require('../../config/db');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

beforeAll(async () => {
    await connectDB();
});

describe('GET /api/sweets', () => {
  beforeEach(async () => {
    await Sweet.deleteMany({});
    await Sweet.create({
      name: 'Barfi',
      category: 'Milk',
      price: 40,
      quantity: 20
    });
  });

  it('should return all sweets', async () => {
    const res = await request(app).get('/api/sweets');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
