import {
  registerUser,
  loginUser,
} from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';


export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const user = await registerUser(
      name,
      username,
      email,
      password
    );

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const data = await loginUser(email, password);

  res.status(200).json({
    success: true,
    ...data,
  });
});

export const verifyLogin = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};