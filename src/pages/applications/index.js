import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Toast from '@/components/Toast';
import { apiUrl } from '@/lib/api';

const statusLabels = {
  NEW: 'Новая',
  IN_PROGRESS: 'Идет обучение',
  COMPLETED: 'Обучение завершено'
};

const paymentLabels = {
  cash: 'Наличными',
  phone: 'Перевод по номеру телефона'
};

export default function Applications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [activeReviewId, setActiveReviewId] = useState(null);

  const load = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Нужно войти, чтобы видеть заявки.');
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await fetch(apiUrl('/api/applications'), {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    load();
  }, []);

  const submitReview = async (id) => {
    if (!reviewText || reviewText.trim().length < 4) {
      setError('Введите отзыв от 4 символов.');
      return;
    }
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl(`/api/applications/${id}/review`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reviewText })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Не удалось отправить отзыв.');
      return;
    }
    setToast('Отзыв отправлен.');
    setReviewText('');
    setActiveReviewId(null);
    load();
  };

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <h2 style={{ margin: 0 }}>Мои заявки</h2>
              <Link className="button" href="/applications/new">
                Создать заявку
              </Link>
            </div>
            {loading && <p>Загрузка...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && items.length === 0 && <p>Заявок пока нет.</p>}
            <div className="grid">
              {items.map((item) => (
                <div key={item._id} className="card" style={{ boxShadow: 'none', border: '1px solid var(--stroke)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div className="badge">{statusLabels[item.status]}</div>
                      <h3 style={{ margin: '8px 0 6px' }}>{item.courseName}</h3>
                      <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                        Старт: {item.startDate}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                        Оплата: {paymentLabels[item.paymentMethod] || item.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {item.reviewText ? (
                    <div style={{ marginTop: 12, fontSize: 14 }}>
                      <strong>Отзыв:</strong> {item.reviewText}
                    </div>
                  ) : item.status === 'COMPLETED' ? (
                    <div style={{ marginTop: 12 }}>
                      {activeReviewId === item._id ? (
                        <>
                          <textarea
                            name="review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Оцените качество обучения..."
                            rows={3}
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button className="button" type="button" onClick={() => submitReview(item._id)}>
                              Отправить отзыв
                            </button>
                            <button
                              className="button secondary"
                              type="button"
                              onClick={() => {
                                setActiveReviewId(null);
                                setReviewText('');
                              }}
                            >
                              Отмена
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="button secondary"
                          type="button"
                          onClick={() => setActiveReviewId(item._id)}
                        >
                          Оставить отзыв
                        </button>
                      )}
                    </div>
                  ) : null}
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
