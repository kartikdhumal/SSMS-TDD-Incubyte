require('dotenv').config({ path: '.env' });
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user.model');

beforeEach(async () => {
    await User.deleteMany({});
});

describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
        await request(app).post('/api/auth/register').send({
            name: 'Kartik',
            email: 'kartik@test.com',
            password: '123456',
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'kartik@test.com',
            password: '123456',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'kartik@test.com',
            password: 'wrong',
        });

        expect(res.statusCode).toBe(401);
    });

    it('should not login if user does not exist', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nouser@test.com',
                password: '123456',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('User doesn\'t exist');
    });
});
