import express from 'express';
import Course from '../models/Course.js';
import dbConnect from '../lib/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await dbConnect();
  const items = await Course.find({ active: true }).sort({ name: 1 }).lean();
  return res.status(200).json({ items });
});

export default router;
