import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  try {
    const token = (req.headers?.token as unknown as string)?.replace('Bearer ', '');
    if (!token) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const decodedToken = jwt.verify(token, 'secret') as { userId: string }; 
    req.headers['user'] = decodedToken as unknown as any;
  } catch (err) {
    req.log.error(err);
    res.status(401).send({ error: 'Unauthorized' });
  }
}
