import { FastifyInstance } from 'fastify';
import app from '../../src/app';
import { User } from '../../src/models/User';
const mongoose = require('mongoose');

describe('Authentication API Integration Tests', () => {
  let initApp: FastifyInstance;

  beforeAll(async () => {
    initApp = app;

  });

  afterAll(async () => {
    await User.deleteOne({email: 'newuser@example.com'});
    await mongoose.connection.close();

  });

  it('should register a new user', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: { username: 'newuser', email: 'newuser@example.com', password: 'newpassword123' },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).token).toBeDefined();
  });
  it('should fail to register a user with missing fields', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: { username: 'newuser' }, 
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe('Bad Request');
  });
  it('should fail to register a user with an existing email', async () => {

    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: { username: 'newuser', email: 'newuser@example.com', password: 'newpassword123' },
    });
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe('Email/username is already registered');
  });
  it('should fail  with incorrect email', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: { email: 'nonexistent@example.com', password: 'wrongpassword' },
    });
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body).error).toBe('User not found');
  });

  it('should authenticate a user and return a token', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: { email: 'newuser@example.com', password: 'newpassword123' },
    });
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).token).toBeDefined();
  });

  it('should fail to authenticate a user with incorrect credentials', async () => {
    const response = await initApp.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: { email: 'newuser@example.com', password: 'wrongpassword' },
    });
    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body).error).toBe('Invalid password');
  });
});
