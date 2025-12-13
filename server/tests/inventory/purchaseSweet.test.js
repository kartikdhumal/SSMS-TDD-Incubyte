require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let userToken;
let sweetId;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const userRes = await request(app).post('/api/auth/register').send({
    name: 'User',
    email: 'user@test.com',
    password: '123456',
  });

  userToken = userRes.body.token;

  const sweet = await Sweet.create({
    name: 'Ladoo',
    category: 'Milk',
    price: 50,
    quantity: 1,
  });

  sweetId = sweet._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/sweets/:id/purchase', () => {
  it('should purchase sweet and decrease quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sweet purchased successfully');

    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(0);
  });

  it('should not allow purchase when quantity is 0', async () => {
    await Sweet.findByIdAndUpdate(sweetId, { quantity: 0 });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Sweet out of stock');
  });

  it('should return 404 if sweet not found', async () => {
    const res = await request(app)
      .post('/api/sweets/64cb1234567890abcdef9999/purchase')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });
});
