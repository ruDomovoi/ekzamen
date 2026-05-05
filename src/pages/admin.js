import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { apiUrl } from '@/lib/api';

const statusLabels = {
  NEW: 'Новая',
  IN_PROGRESS: 'Идет обучение',
  COMPLETED: 'Обучение завершено'
};

export default function AdminPage() {
  const [role, setRole] = useState(null);
  const [items, setItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Нужно войти как администратор.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await fetch(apiUrl('/api/applications?all=1'), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message || 'Не удалось загрузить заявки.');
      return;
    }

    setItems(data.items || []);
  };

  useEffect(() => {
    if (role === 'admin') {
      load();
    }
  }, [role]);

  const filtered = useMemo(() => {
    return (items || []).filter((item) => {
      const matchStatus = filterStatus ? item.status === filterStatus : true;
      const text = `${item.courseName} ${item?.userId?.login || ''} ${item?.userId?.fullName || ''}`
        .toLowerCase();
      const matchSearch = search ? text.includes(search.toLowerCase()) : true;
      return matchStatus && matchSearch;
    });
  }, [items, filterStatus, search]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl(`/api/applications/${id}/status`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Не удалось обновить статус.');
      return;
    }
    setToast('Статус обновлен.');
    load();
  };

  if (role !== 'admin') {
    return (
      <Layout>
        <div className="container">
          <section className="hero">
            <div className="card">
              <h2>Панель администратора</h2>
              <p>Только для администратора.</p>
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="card">
            <h2>Заявки пользователей</h2>
            <div className="grid two">
              <div className="field">
                <label>Фильтр по статусу</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Все</option>
                  <option value="NEW">Новая</option>
                  <option value="IN_PROGRESS">Идет обучение</option>
                  <option value="COMPLETED">Обучение завершено</option>
                </select>
              </div>
              <div className="field">
                <label>Поиск (курс или логин)</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Например: веб-дизайн или ivanov"
                />
              </div>
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p className="error">{error}</p>}

            <div className="grid">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="card"
                  style={{
                    boxShadow: 'none',
                    border: '1px solid var(--stroke)',
                    display: 'grid',
                    gap: 10
                  }}
                >
                  <div>
                    <div className="badge">{statusLabels[item.status]}</div>
                    <h3 style={{ margin: '8px 0 6px' }}>{item.courseName}</h3>
                  </div>
                  <div className="field">
                    <label style={{ fontWeight: 600, fontSize: 13 }}>Статус</label>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                    >
                      <option value="NEW">Новая</option>
                      <option value="IN_PROGRESS">Идет обучение</option>
                      <option value="COMPLETED">Обучение завершено</option>
                    </select>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                    Старт: {item.startDate}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                    Пользователь: {item?.userId?.login || '-'} ({item?.userId?.fullName || '-'})
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                    Телефон: {item?.userId?.phone || '-'}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                    Email: {item?.userId?.email || '-'}
                  </div>
                  {item.reviewText && (
                    <div style={{ marginTop: 6, fontSize: 14 }}>
                      <strong>Отзыв:</strong> {item.reviewText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </Layout>
  );
}
