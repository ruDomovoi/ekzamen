import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Slider from '@/components/Slider';
import Link from 'next/link';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLogged(!!token);
  }, []);

  return (
    <Layout>
      <div className="container">
        <section className="hero">
          <div>
            <div className="badge">Онлайн-курсы ДПО</div>
            <h1>Записывайтесь на обучение без лишних звонков.</h1>
            <p>
              Портал «Корочки.есть» помогает выбрать программу, оплатить обучение и
              получить подтверждение статуса заявки в пару кликов.
            </p>
            <div className="hero-actions">
              {isLogged ? (
                <>
                  <Link className="button" href="/applications/new">
                    Создать заявку
                  </Link>
                  <Link className="button secondary" href="/applications">
                    Мои заявки
                  </Link>
                </>
              ) : (
                <>
                  <Link className="button" href="/register">
                    Создать аккаунт
                  </Link>
                  <Link className="button secondary" href="/login">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
          <Slider />
        </section>

        <section className="grid two">
          <div className="card">
            <h3>Прозрачный статус</h3>
            <p>Администратор обновляет стадию обучения, а вы видите прогресс в личном кабинете.</p>
          </div>
          <div className="card">
            <h3>Удобные оплаты</h3>
            <p>Выбирайте наличные или перевод по номеру телефона при заполнении заявки.</p>
          </div>
          <div className="card">
            <h3>Отзывы после курса</h3>
            <p>Оставляйте обратную связь только после завершения обучения — все честно.</p>
          </div>
          <div className="card">
            <h3>Мобильный формат</h3>
            <p>Интерфейс адаптирован под смартфоны 390x844 px и десктоп.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
