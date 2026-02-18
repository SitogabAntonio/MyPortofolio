import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.login(username, password);
      localStorage.setItem('admin_token', result.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <section className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin CMS</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Login</h1>
        <p className="mt-2 text-sm text-neutral-400">Default: admin / admin123</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </section>
    </main>
  );
}
