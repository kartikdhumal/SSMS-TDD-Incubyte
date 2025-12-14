const request = require('supertest');
const app = require('../../app');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let userToken;

beforeAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const userRes = await request(app).post('/api/auth/register').send({
        name: 'User',
        email: 'user@test.com',
        password: '123456'
    });

    userToken = userRes.body.token;

    await Sweet.insertMany([
        { name: 'Ladoo', category: 'Milk', price: 50, quantity: 10 },
        { name: 'Barfi', category: 'Milk', price: 100, quantity: 5 },
        { name: 'Jalebi', category: 'Sugar', price: 30, quantity: 8 },
    ]);
});

describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
        const res = await request(app).get('/api/sweets/search?name=ladoo').set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    it('should search sweets by category', async () => {
        const res = await request(app).get('/api/sweets/search?category=Milk').set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should search sweets by price range', async () => {
        const res = await request(app).get('/api/sweets/search?minPrice=40&maxPrice=80').set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
    });

    it('should return empty array if no sweets found', async () => {
        const res = await request(app).get('/api/sweets/search?name=Nothing').set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});
