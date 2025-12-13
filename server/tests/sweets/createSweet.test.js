require('dotenv').config({ path: '.env' });
const request = require('supertest');
const app = require('../../app');
const { default: mongoose } = require('mongoose');
const connectDB = require('../../config/db');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let adminToken;
let userToken;

beforeAll(async () => {
    await connectDB();
});

beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const adminRes = await request(app).post('/api/auth/register').send({
        name: 'Admin',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin'
    });

    const userRes = await request(app).post('/api/auth/register').send({
        name: 'User',
        email: 'user@test.com',
        password: '123456'
    });

    adminToken = adminRes.body.token;
    userToken = userRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/sweets', () => {
    it('should allow admin to create sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Kaju Katli',
                category: 'Milk',
                price: 500,
                quantity: 10,
                image: 'https://placehold.co/300x200'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Kaju Katli');
    });

    it('should not allow normal user to create sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Barfi',
                category: 'Milk',
                price: 200,
                quantity: 5
            });

        expect(res.statusCode).toBe(403);
    });

    it('should fail if name missing', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                price: 50,
                quantity: 10,
                category: 'Milk'
            });

        expect(res.statusCode).toBe(400);
    });

    it('should fail if price is negative', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Ladoo',
                price: -10,
                quantity: 10,
                category: 'Traditional'
            });

        expect(res.statusCode).toBe(400);
    });
});