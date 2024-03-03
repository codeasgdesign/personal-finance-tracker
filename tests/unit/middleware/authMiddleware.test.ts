import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../../../src/middleware/authMiddleware';

describe('authenticate', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
   const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };
  beforeEach(() => {
    mockRequest = {
          log:mockLogger 
      } as unknown as Partial<FastifyRequest>;
    mockReply = {
        status: jest.fn(() => mockReply) as unknown as any,
        send: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should set user ID in request headers for a valid token', async () => {
    const mockToken = jwt.sign({ userId: 'testUser' }, 'mysecretkey');
    mockRequest.headers = { token: `Bearer ${mockToken}` };

    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockRequest.headers).toHaveProperty('user');
    expect(mockRequest.headers['user']).toHaveProperty('userId');
  });

  test('should return 401 Unauthorized for an invalid token', async () => {
    mockRequest.headers = { token: 'InvalidToken' };

    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('should return 401 Unauthorized if token is missing', async () => {
    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

});
