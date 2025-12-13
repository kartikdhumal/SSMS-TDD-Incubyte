const request = require('supertest');
const app = require('../../app');

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
});
