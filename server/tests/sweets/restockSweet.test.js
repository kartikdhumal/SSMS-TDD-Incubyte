const request = require('supertest');
const app = require('../../app');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let adminToken;
let sweetId;

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  });

  adminToken = adminRes.body.token;

  const sweet = await Sweet.create({
    name: 'Ladoo',
    category: 'Milk',
    price: 50,
    quantity: 2,
  });

  sweetId = sweet._id;
});

describe('POST /api/sweets/:id/restock', () => {
  it('should restock sweet quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(7);
  });

  it('should reject restock with invalid quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 0 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if sweet not found', async () => {
    const res = await request(app)
      .post('/api/sweets/64cb1234567890abcdef9999/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(404);
  });
});
