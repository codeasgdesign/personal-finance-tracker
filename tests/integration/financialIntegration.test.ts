import { FastifyInstance } from 'fastify';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { Transaction } from '../../src/models/Transaction';
import { Category } from '../../src/models/Category';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

describe('Financial Summary Route Integration Tests', () => {
    let initApp: FastifyInstance;
    let token: string;
    let userId: string;
    let categoryId: string;
    let transactionId: string;

    beforeAll(async () => {
        initApp = app;

        const response = await app.inject({
            method: 'POST',
            url: '/api/users/register',
            payload: { email: 'test@example.com', password: 'password123', username: 'test' },
        });
        const { token: authToken } = JSON.parse(response.body);
        token = authToken;
        const decodeToken = jwt.verify(token, 'secret') as { userId: string };
         userId = decodeToken.userId;
        const category = await Category.create({ name: 'Test Category', user: userId });
        categoryId = category._id;

        const transaction = await Transaction.create({
            amount: 100,
            date: new Date(),
            category: categoryId,
            user: userId,
            type: 'expense',
            description: 'Test Transaction',
        });
        transactionId = transaction._id;
    });

    afterAll(async () => {
        await Category.deleteOne({ _id: categoryId });
        await Transaction.deleteOne({ _id: transactionId });
        await User.deleteOne({ email: 'test@example.com' });
        await mongoose.connection.close();
        await initApp.close()
    });

    describe('GET /api/summary', () => {
        it('should return financial summary for a user', async () => {
            const response = await initApp.inject({
                method: 'POST',
                url: '/api/summary',
                body:{
                    
                        "startDate": "2023-01-01",
                        "endDate": "2023-12-31"
                    
                },
                headers: {
                    token: `Bearer ${token}`,
                },
            });
            console.log(response.body);
            expect(response.statusCode).toBe(200);
            const summary = JSON.parse(response.body);
            expect(summary).toHaveProperty('totalIncome');
            expect(summary).toHaveProperty('totalExpenses');
            expect(summary).toHaveProperty('balance');
            expect(summary).toHaveProperty('insightsByCategory');
        });
    });
});
