import Course from '../models/Course.js';
import dbConnect from './db.js';

const defaultCourses = [
  'Основы алгоритмизации и программирования',
  'Основы веб-дизайна',
  'Основы проектирования баз данных'
];

export async function seedCourses() {
  await dbConnect();
  const count = await Course.countDocuments();

  if (count > 0) {
    return;
  }

  await Course.insertMany(defaultCourses.map((name) => ({ name })));
}
