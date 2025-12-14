const request = require('supertest');
const app = require('../../app');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let adminToken;
let sweetId;

beforeAll(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});

  const adminRes = await request(app).post('/api/auth/register').send({
    name: 'Admin',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  });

  adminToken = adminRes.body.token;
});

beforeEach(async () => {
  const sweet = await Sweet.create({
    name: 'Barfi',
    category: 'Milk',
    price: 100,
    quantity: 10,
  });

  sweetId = sweet._id.toString();
});

describe('PUT /api/sweets/:id', () => {
  it('should update sweet successfully (admin)', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 120 });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(120);
  });

  it('should return 404 if sweet not found', async () => {
    const res = await request(app)
      .put('/api/sweets/64cb1234567890abcdef9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 150 });

    expect(res.statusCode).toBe(404);
  });

  it('should reject invalid update data', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid price');
  });
});
