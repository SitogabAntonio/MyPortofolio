import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api.login(username, password);
      localStorage.setItem('admin_token', result.token);
      toast.success('Login berhasil');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --accent: #b91c1c;
          --border: #262626;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-5px); }
          40%       { transform: translateX(5px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }

        .enter-1 { animation: fadeUp 0.65s 0.05s ease both; }
        .enter-2 { animation: fadeUp 0.65s 0.15s ease both; }
        .enter-3 { animation: fadeUp 0.65s 0.25s ease both; }
        .enter-4 { animation: fadeUp 0.65s 0.35s ease both; }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 13px 14px;
          font-size: 13px;
          color: #e5e5e5;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.03em;
        }
        .input-field::placeholder { color: #333; }
        .input-field:focus {
          border-color: var(--accent);
          background: rgba(185,28,28,0.04);
          box-shadow: 0 0 0 3px rgba(185,28,28,0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 8px;
          background: var(--accent);
          color: white;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          letter-spacing: 0.22em;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #991b1b;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(185,28,28,0.3);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .error-box { animation: shake 0.4s ease; }

        .label-text {
          display: block;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #525252;
          margin-bottom: 7px;
          font-family: 'DM Mono', monospace;
        }

        .bracket-tl, .bracket-tr, .bracket-bl, .bracket-br {
          position: absolute;
          width: 13px; height: 13px;
          border-color: rgba(185,28,28,0.3);
          border-style: solid;
        }
        .bracket-tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
        .bracket-tr { top: 12px; right: 12px; border-width: 1px 1px 0 0; }
        .bracket-bl { bottom: 12px; left: 12px; border-width: 0 0 1px 1px; }
        .bracket-br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }
      `}</style>

      <main
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          background: '#0c0c0c',
          fontFamily: "'DM Mono', monospace",
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      >
        <div className="w-full max-w-[360px]">

          {/* Heading */}
          <div className="mb-8 enter-1">
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '0.7rem',
                letterSpacing: '0.35em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Admin Panel
            </p>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(2rem, 6vw, 2.6rem)',
                color: '#f5f5f5',
                lineHeight: 1.1,
                fontWeight: 400,
              }}
            >
              Masuk ke<br />
              <em style={{ color: 'var(--accent)' }}>Dashboard</em>
            </h1>
          </div>

          {/* Card */}
          <div
            className="relative p-6 enter-2"
            style={{
              background: '#111111',
              border: '1px solid var(--border)',
              borderRadius: 14,
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div className="bracket-tl" />
            <div className="bracket-tr" />
            <div className="bracket-bl" />
            <div className="bracket-br" />

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="enter-3">
                <label className="label-text">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="input-field"
                  autoComplete="username"
                />
              </div>

              <div className="enter-3">
                <label className="label-text">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div
                  className="error-box flex items-center gap-2.5 px-3.5 py-3"
                  style={{
                    background: 'rgba(185,28,28,0.07)',
                    border: '1px solid rgba(185,28,28,0.22)',
                    borderRadius: 8,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ fontSize: 11.5, color: '#f87171' }}>{error}</p>
                </div>
              )}

              <div className="pt-1 enter-4">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}