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

describe('GET /api/sweets', () => {
    beforeEach(async () => {
        await Sweet.deleteMany({});
    });

    it('should return count and data correctly', async () => {
        await Sweet.create([
            { name: 'Ladoo', category: 'Indian', price: 50, quantity: 10 },
            { name: 'Barfi', category: 'Indian', price: 70, quantity: 5 },
        ]);

        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(2);
        expect(res.body.data.length).toBe(2);
    });

    it('should return count 0 and empty array when no sweets exist', async () => {
        await Sweet.deleteMany({});

        const res = await request(app)
            .get('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(0);
        expect(res.body.data).toEqual([]);
    });

});
