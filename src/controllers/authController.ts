import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserByEmailOrUserName } from '../repository/user.repository';

export async function registerUser(req: FastifyRequest, res: FastifyReply) {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };
    const existingUser = await findUserByEmailOrUserName( {email,username} );
    if (existingUser) {
      return res.status(400).send({ error: 'Email/username is already registered' });
    }

   const newUser= await createUser(username,email,password);

    const token = jwt.sign({ userId: newUser._id }, 'secret', { expiresIn: '1h' });

    res.send({ message: 'User registered successfully', token });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

export async function loginUser(req: FastifyRequest, res: FastifyReply) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    req.log.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
