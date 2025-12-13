require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
const Sweet = require('../../models/sweets.model');
const User = require('../../models/user.model');

let adminToken;
let sweetId;

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    const admin = await request(app).post('/api/auth/register').send({
        name: 'Admin',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
    });

    adminToken = admin.body.token;

    const sweet = await Sweet.create({
        name: 'Ladoo',
        category: 'Traditional',
        price: 100,
        quantity: 10,
    });

    sweetId = sweet._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('DELETE /api/sweets/:id', () => {

    it('should return 404 if sweet not found', async () => {
        const res = await request(app)
            .delete('/api/sweets/64cb1234567890abcdef9999')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
    });

    it('should delete sweet', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

});
