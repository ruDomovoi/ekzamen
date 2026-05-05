import express from 'express';
import mongoose from 'mongoose';
import dbConnect from '../lib/db.js';
import Application from '../models/Application.js';
import Course from '../models/Course.js';
import { getTokenFromReq, verifyToken } from '../lib/auth.js';
import { validateApplication } from '../lib/validation.js';

const router = express.Router();

const allowedStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED'];

router.get('/', async (req, res) => {
  await dbConnect();

  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return res.status(401).json({ message: 'Требуется авторизация.' });
  }

  if (payload.role === 'admin' && req.query.all === '1') {
    const items = await Application.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'userId', model: 'User', select: 'login fullName phone email' })
      .lean();
    return res.status(200).json({ items });
  }

  const items = await Application.find({ userId: payload.userId })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({ items });
});

router.post('/', async (req, res) => {
  await dbConnect();

  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload || (payload.role !== 'user' && payload.role !== 'admin')) {
    return res.status(403).json({ message: 'Недостаточно прав.' });
  }

  const { courseName, startDate, paymentMethod, userIdOverride } = req.body || {};
  const errors = validateApplication({ courseName, startDate, paymentMethod });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const course = await Course.findOne({ name: courseName, active: true });
  if (!course) {
    return res.status(400).json({ message: 'Курс не найден.' });
  }

  const targetUserId = payload.role === 'admin' && userIdOverride ? userIdOverride : payload.userId;
  const userObjectId = new mongoose.Types.ObjectId(targetUserId);

  const application = await Application.create({
    userId: userObjectId,
    courseName,
    startDate,
    paymentMethod,
    status: 'NEW'
  });

  return res.status(201).json({ application });
});

router.patch('/:id/status', async (req, res) => {
  await dbConnect();

  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ message: 'Недостаточно прав.' });
  }

  const { id } = req.params;
  const { status } = req.body || {};

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Некорректный статус.' });
  }

  const application = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!application) {
    return res.status(404).json({ message: 'Заявка не найдена.' });
  }

  return res.status(200).json({ application });
});

router.post('/:id/review', async (req, res) => {
  await dbConnect();

  const token = getTokenFromReq(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload || payload.role !== 'user') {
    return res.status(403).json({ message: 'Недостаточно прав.' });
  }

  const { id } = req.params;
  const { reviewText } = req.body || {};

  if (!reviewText || reviewText.length < 4) {
    return res.status(400).json({ message: 'Отзыв слишком короткий.' });
  }

  const application = await Application.findOne({ _id: id, userId: payload.userId });

  if (!application) {
    return res.status(404).json({ message: 'Заявка не найдена.' });
  }

  if (application.status !== 'COMPLETED') {
    return res
      .status(400)
      .json({ message: 'Отзыв доступен только после завершения обучения.' });
  }

  application.reviewText = reviewText;
  application.reviewAt = new Date();
  await application.save();

  return res.status(200).json({ application });
});

export default router;
