import express from 'express';
import bcrypt from 'bcryptjs';
import dbConnect from '../lib/db.js';
import User from '../models/User.js';
import { validateLogin, validateRegistration } from '../lib/validation.js';
import { signToken } from '../lib/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  await dbConnect();

  const { login, password, fullName, phone, email } = req.body || {};
  const errors = validateRegistration({ login, password, fullName, phone, email });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const existing = await User.findOne({ login });
  if (existing) {
    return res.status(400).json({ errors: { login: 'Логин уже используется.' } });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    login,
    passwordHash,
    fullName,
    phone,
    email
  });

  return res.status(201).json({
    id: user._id,
    login: user.login,
    fullName: user.fullName
  });
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body || {};
  const errors = validateLogin({ login, password });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  await dbConnect();
  const user = await User.findOne({ login });

  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль.' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Неверный логин или пароль.' });
  }

  const token = signToken({ role: user.role, userId: user._id, login: user.login });

  return res.status(200).json({
    token,
    role: user.role,
    login: user.login,
    fullName: user.fullName
  });
});

export default router;
