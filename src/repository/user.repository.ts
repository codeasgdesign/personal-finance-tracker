
import bcrypt from 'bcrypt';
import { User } from './../models/User';

export async function createUser(username: string, email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error('Failed to create user');
  }
}

export async function findUserByEmailOrUserName({ email, username }: { email: string, username: string }) {
  try {
    return await User.findOne({ $or: [{ email }, { username }] });
  } catch (err) {
    throw new Error('Failed to find user');
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw new Error('Failed to find user');
  }
}
