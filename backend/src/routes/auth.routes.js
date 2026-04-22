import express from 'express';
import {
  register,
  login,
  verifyLogin,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-login', verifyToken, verifyLogin);

export default router;