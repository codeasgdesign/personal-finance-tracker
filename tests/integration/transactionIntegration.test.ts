import { FastifyInstance } from 'fastify';
import app from '../../src/app';
import { Transaction } from '../../src/models/Transaction';
import { Category } from '../../src/models/Category';
import { User } from '../../src/models/User';

describe('Transaction API Integration Tests', () => {
  let initApp: FastifyInstance;
  let createdTransactionId: string;
  let token:string;

  beforeAll(async () => {
    initApp = app;
    const response = await app.inject({
        method: 'POST',
        url: '/api/users/register',
        payload: { email: 'test@example.com', password: 'password123',username:'test' },
      });
      const { token: authToken } = JSON.parse(response.body);
      token = authToken;
  });

  afterAll(async () => {
    await Transaction.findByIdAndDelete(createdTransactionId);
    await initApp.close()
    await User.deleteOne({email:'test@example.com'});
    await Category.deleteMany({ name: { $in: ['TestCategory1', 'TestCategory2'] } });
  });

  it('should create a new transaction', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/transactions',
      payload: {
        amount: 100,
        date: new Date(),
        category: 'TestCategory1',
        type: 'expense',
        description: 'Test transaction',
      },
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const transaction = await Transaction.findOne({ description: 'Test transaction' });
    expect(transaction).toBeTruthy();
    createdTransactionId = transaction?._id;
  });
  it('should return 400 error when creating a transaction with invalid data', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/transactions',
      payload: {
        amount: 'invalidAmount', 
        date: 'invalidDate', 
        category: 'TestCategory', 
        type: 'expense',
        description: 'Test transaction',
      },
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should fetch all transactions for a user', async () => {
    const response = await initApp.inject({
      method: 'GET',
      url: '/api/transactions',
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const transactions = JSON.parse(response.body);
    expect(Array.isArray(transactions)).toBe(true);
  });
  it('should return 400 error when updating a transaction with invalid data', async () => {
    const response = await initApp.inject({
      method: 'PUT',
      url: `/api/transactions/invalidId`,
      payload: {
        amount: 'invalidAmount', // Invalid data type for amount
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should update an existing transaction', async () => {
    const response = await initApp.inject({
      method: 'PUT',
      url: `/api/transactions/${createdTransactionId}`,
      payload: {
        amount: 200,
      },
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const updatedTransaction = await Transaction.findById(createdTransactionId);
    expect(updatedTransaction?.amount).toBe(200);
  });

  it('should delete an existing transaction', async () => {
    const response = await initApp.inject({
      method: 'DELETE',
      url: `/api/transactions/${createdTransactionId}`,
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const deletedTransaction = await Transaction.findById(createdTransactionId);
    expect(deletedTransaction).toBeNull();
  });
  it('should return 400 error when deleting a invalid ID', async () => {
    const response = await initApp.inject({
      method: 'DELETE',
      url: `/api/transactions/invalidId`,
      headers: {
        token: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
