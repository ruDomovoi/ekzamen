import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { validateRegistration } from '@/lib/validation';
import { apiUrl } from '@/lib/api';
import { useRouter } from 'next/router';

const initialForm = {
  login: '',
  password: '',
  fullName: '',
  phone: '',
  email: ''
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const router = useRouter();

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '');

    if (!digits) return '';

    if (digits.startsWith('7')) {
      digits = '8' + digits.slice(1);
    } else if (!digits.startsWith('8')) {
      digits = '8' + digits;
    }

    digits = digits.slice(0, 11);

    const p1 = digits.slice(1, 4);
    const p2 = digits.slice(4, 7);
    const p3 = digits.slice(7, 9);
    const p4 = digits.slice(9, 11);

    let formatted = '8';

    if (p1) {
      formatted += `(${p1}`;
      if (p1.length === 3) {
        formatted += ')';
      }
    }

    if (p2) {
      formatted += p2;
    }

    if (p3) {
      formatted += `-${p3}`;
    }

    if (p4) {
      formatted += `-${p4}`;
    }

    return formatted;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'phone' ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateRegistration(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors(data.errors || { common: data.message || 'Ошибка регистрации.' });
      return;
    }

    setToast('Пользователь создан. Теперь можно войти.');
    setForm(initialForm);
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="card">
            <h2>Регистрация</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="login">Логин</label>
                <input
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="lat12345"
                />
                {errors.login && <span className="error">{errors.login}</span>}
              </div>
              <div className="field">
                <label htmlFor="password">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              <div className="field">
                <label htmlFor="fullName">ФИО</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Иванов Иван Иванович"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">Телефон</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="8(900)123-45-67"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input name="email" value={form.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              {errors.common && <span className="error">{errors.common}</span>}
              <button className="button" type="submit">
                Зарегистрироваться
              </button>
            </form>
            <div style={{ marginTop: 12 }}>
              <Link href="/login">Уже зарегистрированы? Войти</Link>
            </div>
          </div>
          <div className="card">
            <h3>Зачем нужен аккаунт?</h3>
            <p>
              Он позволяет сохранять заявки, отслеживать статус и оставлять отзыв по окончании
              обучения.
            </p>
          </div>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </Layout>
  );
}
