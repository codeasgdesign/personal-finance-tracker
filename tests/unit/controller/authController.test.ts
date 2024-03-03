
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserByEmailOrUserName } from '../../../src/utils/userUtils';
import { loginUser, registerUser } from '../../../src/controllers/authController';


jest.mock('../src/repository/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('registerUser', () => {
  let req: any;
  let res: any;
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      },
      log:mockLogger
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  it('should register a new user', async () => {
    const newUser = { _id: '123', username: 'testuser', email: 'test@example.com' };
    const token = 'mockToken';
    (findUserByEmailOrUserName as jest.Mock).mockResolvedValueOnce(null);
    (createUser as jest.Mock).mockResolvedValueOnce(newUser);
    (jwt.sign as jest.Mock).mockReturnValueOnce(token);

    await registerUser(req, res);

    expect(findUserByEmailOrUserName).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser' });
    expect(createUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: '123' }, 'secret', { expiresIn: '1h' });
    expect(res.send).toHaveBeenCalledWith({ message: 'User registered successfully', token });
  });

  it('should return error if user already exists', async () => {
    (findUserByEmailOrUserName as jest.Mock).mockResolvedValueOnce({});

    await registerUser(req, res);

    expect(findUserByEmailOrUserName).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: 'Email/username is already registered' });
  });

  it('should return 500 status if an error occurs', async () => {
    (findUserByEmailOrUserName as jest.Mock).mockRejectedValueOnce(new Error('Some error'));
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('loginUser', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
      log:mockLogger
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  it('should authenticate user and return token', async () => {
    const user = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };
    const token = 'mockToken';
    (findUserByEmail as jest.Mock).mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce(token);

    await loginUser(req, res);

    expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: '123' }, 'secret', { expiresIn: '1h' });
    expect(res.send).toHaveBeenCalledWith({ token });
  });

  it('should return 404 if user not found', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValueOnce(null);

    await loginUser(req, res);

    expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 401 if password is invalid', async () => {
    const user = { _id: '123', email: 'test@example.com', password: 'hashedPassword' };
    (findUserByEmail as jest.Mock).mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await loginUser(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Invalid password' });
  });

  it('should return 500 status if an error occurs', async () => {
    (findUserByEmail as jest.Mock).mockRejectedValueOnce(new Error('Some error'));
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
