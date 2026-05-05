import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  const [role, setRole] = useState(null);
  const [login, setLogin] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const storedLogin = typeof window !== 'undefined' ? localStorage.getItem('login') : null;
    setRole(storedRole);
    setLogin(storedLogin);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('login');
    setRole(null);
    setLogin(null);
    window.location.href = '/';
  };

  const links = [
    { href: '/', label: 'Главная', show: true },
    { href: '/register', label: 'Регистрация', show: !role },
    { href: '/login', label: 'Вход', show: !role },
    { href: '/applications', label: 'Заявки', show: !!role },
    { href: '/applications/new', label: 'Новая заявка', show: !!role },
    { href: '/admin', label: 'Админ', show: role === 'admin' }
  ].filter((link) => link.show);

  return (
    <main>
      <div className="container">
        <nav className="nav">
          <div className="logo">Корочки.есть</div>
          <div className="nav-links" style={{ alignItems: 'center', gap: 12 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
            {role && login && (
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={() => setShowLogout(true)}
                onMouseLeave={() => setShowLogout(false)}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 0,
                    border: '1px solid var(--stroke)',
                    background: 'rgba(31, 75, 153, 0.12)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700
                  }}
                  title={login}
                >
                  {login.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ fontWeight: 600 }}>{login}</div>
                <div
                  className="nav-link"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 2px)',
                    whiteSpace: 'nowrap',
                    opacity: showLogout ? 1 : 0,
                    pointerEvents: showLogout ? 'auto' : 'none',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                    transform: showLogout ? 'translateY(0)' : 'translateY(-4px)'
                  }}
                >
                  <button
                    className="button secondary"
                    type="button"
                    onClick={logout}
                    style={{ padding: '8px 12px' }}
                  >
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
      {children}
      <div className="container footer">
        Учебный портал дополнительного профессионального образования.
      </div>
    </main>
  );
}
