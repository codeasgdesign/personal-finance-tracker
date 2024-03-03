import { Category } from '../../src/models/Category';
import app from '../../src/app';
import { FastifyInstance } from 'fastify';
import { User } from '../../src/models/User';
import mongoose from 'mongoose';

describe('Category Routes Integration Tests', () => {
    let initApp: FastifyInstance;
let token:string;
let categoryIdToBedelete:string
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
    await Category.deleteOne({name:'Test Category'}); 
    await User.deleteOne({email:'test@example.com'})
    await mongoose.connection.close();
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await initApp.inject({
        method: 'POST',
        url: '/api/categories',
        payload: { name: 'Test Category' },
        headers: {
          token: `Bearer ${token}`,
        },
      });
      categoryIdToBedelete=JSON.parse(response.body)._id;
      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toHaveProperty('_id');
    });

    it('should return 400 if category name is missing', async () => {
      const response = await initApp.inject({
        method: 'POST',
        url: '/api/categories',
        payload: {},
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/categories', () => {
    it('should return a list of categories', async () => {
      const response = await initApp.inject({
        method: 'GET',
        url: '/api/categories',
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const response = await initApp.inject({
        method: 'PUT',
        url: `/api/categories/${categoryIdToBedelete}`,
        payload: { name: 'Updated Category' },
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toHaveProperty('_id', categoryIdToBedelete.toString());
      expect(JSON.parse(response.body)).toHaveProperty('name', 'Updated Category');
    });

    it('should return 404 if category is not found', async () => {
      const response = await initApp.inject({
        method: 'PUT',
        url: '/api/categories/123456789012345678901234', 
        payload: { name: 'Updated Category' },
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const response = await initApp.inject({
        method: 'DELETE',
        url: `/api/categories/${categoryIdToBedelete}`,
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toHaveProperty('message', 'Category deleted successfully');
    });

    it('should return 404 if category is not found', async () => {
      const response = await initApp.inject({
        method: 'DELETE',
        url: '/api/categories/123456789012345678901234', 
        headers: {
            token: `Bearer ${token}`,
          },
      });
      expect(response.statusCode).toBe(404);
    });
  });
});
