import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

type AdminNavItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

const navItems: AdminNavItem[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-10h8V3h-8v8Z" />
      </svg>
    ),
  },
  {
    label: 'Projects',
    path: '/admin/projects',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Experiences',
    path: '/admin/experiences',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19h16V8H4v11Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    label: 'Skills',
    path: '/admin/skills',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m7 8 3-3 2 2-3 3m4 4 3-3 2 2-3 3m-5 2-5 1 1-5 9-9 4 4-9 9Z" />
      </svg>
    ),
  },
  {
    label: 'Tags',
    path: '/admin/tags',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m7 7 5-5 10 10-5 5L7 7Z" />
        <path d="M7 7H2v5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" />
        <path d="m19.4 15 1.1 2-2 3.5-2.3-.2a8 8 0 0 1-2 .8L13 23h-2l-1.2-1.9a8 8 0 0 1-2-.8l-2.3.2-2-3.5 1.1-2a8.8 8.8 0 0 1 0-2l-1.1-2 2-3.5 2.3.2a8 8 0 0 1 2-.8L11 1h2l1.2 1.9a8 8 0 0 1 2 .8l2.3-.2 2 3.5-1.1 2c.2.7.3 1.3.3 2s-.1 1.3-.3 2Z" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('admin_token');
      navigate('/admin/login', { replace: true });
    }
  };

  const currentTitle =
    navItems.find((item) => location.pathname.startsWith(item.path))?.label ?? 'Admin';

  return (
    <div className="min-h-screen bg-[var(--bg)] text-neutral-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[260px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[260px] border-r border-neutral-800 bg-[var(--surface)]/90 p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">CMS</p>
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-md border border-neutral-700 px-2 py-1 text-sm text-neutral-300 lg:hidden"
            >
              Tutup
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'border-neutral-600 bg-neutral-800/80 text-white'
                      : 'border-transparent text-neutral-400 hover:border-neutral-800 hover:bg-neutral-900 hover:text-neutral-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-neutral-800 bg-[var(--surface)]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="rounded-lg border border-neutral-700 p-2 text-neutral-300 lg:hidden"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
                  <h2 className="text-lg font-semibold text-white">{currentTitle}</h2>
                </div>
              </div>

              <NavLink
                to="/"
                className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
              >
                Lihat Website
              </NavLink>
              <button
                type="button"
                onClick={() => void onLogout()}
                className="rounded-lg border border-red-700/60 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
    </div>
  );
}
