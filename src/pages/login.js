import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { validateLogin } from '@/lib/validation';
import { apiUrl } from '@/lib/api';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const router = useRouter();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({ common: data.message || 'Ошибка входа.' });
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('login', data.login);

    setToast('Успешный вход.');

    if (data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/applications');
    }
  };

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="card">
            <h2>Вход</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="login">Логин</label>
                <input name="login" value={form.login} onChange={handleChange} />
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
              {errors.common && <span className="error">{errors.common}</span>}
              <button className="button" type="submit">
                Войти
              </button>
            </form>
            <div style={{ marginTop: 12 }}>
              <Link href="/register">Еще не зарегистрированы? Регистрация</Link>
            </div>
          </div>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </Layout>
  );
}
