import './lib/env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import courseRoutes from './routes/courses.js';
import { seedCourses } from './lib/seed.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
console.log(FRONTEND_ORIGIN)

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);

seedCourses()
  .catch((error) => {
    console.error('Course seeding failed:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  });
