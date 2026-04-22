import { createUser, findUserByEmail } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { validatePassword } from '../utils/validator.js';

export const registerUser = async (name, username, email, password) => {
  email = email.toLowerCase();

  const existing = await findUserByEmail(email);
  if (existing.rows.length > 0) {
    throw new Error('User already exists');
  }

  validatePassword(password);

  const hashed = await hashPassword(password);

  const result = await createUser(
    name,
    username,
    email,
    hashed,
    'user'
  );

  return result.rows[0];
};

export const loginUser = async (email, password) => {
  email = email.toLowerCase();

  const result = await findUserByEmail(email);

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};