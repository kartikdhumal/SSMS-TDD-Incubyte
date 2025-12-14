const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');

beforeEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/register', () => {

  it('should register a user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Kartik',
        email: 'kartik@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('kartik@test.com');
  });

  it('should not allow registering with same email twice', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'test',
      email: 'test@test.com',
      password: '123456'
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'test',
      email: 'test@test.com',
      password: '123456'
    });

    expect(res.statusCode).toBe(400);
  });

});
