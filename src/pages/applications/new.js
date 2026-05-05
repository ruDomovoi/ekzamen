import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { validateApplication } from '@/lib/validation';
import { apiUrl } from '@/lib/api';

const initialForm = {
  courseName: '',
  startDate: '',
  paymentMethod: ''
};

export default function NewApplication() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const response = await fetch(apiUrl('/api/courses'));
      const data = await response.json();
      if (response.ok) {
        setCourses(data.items || []);
      }
    };
    loadCourses();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateApplication(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ common: 'Нужно войти в систему.' });
      return;
    }

    const response = await fetch(apiUrl('/api/applications'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || { common: data.message || 'Ошибка отправки.' });
      return;
    }

    setToast('Заявка отправлена на рассмотрение.');
    setForm(initialForm);
  };

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="card">
            <h2>Новая заявка</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="courseName">Курс</label>
                <select name="courseName" value={form.courseName} onChange={handleChange}>
                  <option value="">Выберите курс</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.courseName && <span className="error">{errors.courseName}</span>}
              </div>
              <div className="field">
                <label htmlFor="startDate">Дата начала</label>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  placeholder="ДД.ММ.ГГГГ"
                />
                {errors.startDate && <span className="error">{errors.startDate}</span>}
              </div>
              <div className="field">
                <label htmlFor="paymentMethod">Оплата</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Выберите способ</option>
                  <option value="cash">Наличными</option>
                  <option value="phone">Перевод по номеру телефона</option>
                </select>
                {errors.paymentMethod && (
                  <span className="error">{errors.paymentMethod}</span>
                )}
              </div>
              {errors.common && <span className="error">{errors.common}</span>}
              <button className="button" type="submit">
                Отправить
              </button>
            </form>
          </div>
          <div className="card">
            <h3>Что дальше?</h3>
            <p>
              После отправки администратор проверит заявку и обновит статус в личном кабинете.
            </p>
          </div>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </Layout>
  );
}
