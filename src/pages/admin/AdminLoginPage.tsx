import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

        .login-root {
          font-family: 'JetBrains Mono', monospace;
        }
        .login-title {
          font-family: 'Syne', sans-serif;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridPan {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
        @keyframes scanline {
          0%   { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }

        .card-enter { animation: fadeUp 0.6s ease both; }
        .card-enter-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .card-enter-2 { animation: fadeUp 0.6s 0.2s ease both; }
        .card-enter-3 { animation: fadeUp 0.6s 0.3s ease both; }
        .card-enter-4 { animation: fadeUp 0.6s 0.4s ease both; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridPan 8s linear infinite;
        }

        .scanline {
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }

        .cursor-blink::after {
          content: '|';
          animation: blink 1s step-end infinite;
          margin-left: 1px;
          color: #3b82f6;
        }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          color: #e2e8f0;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.02em;
        }
        .input-field::placeholder { color: rgba(148,163,184,0.4); }
        .input-field:focus {
          border-color: rgba(59,130,246,0.6);
          background: rgba(59,130,246,0.05);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12), inset 0 0 20px rgba(59,130,246,0.03);
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: #1d4ed8;
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(29,78,216,0.4);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-shake { animation: shake 0.4s ease; }

        .label-text {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(148,163,184,0.7);
          font-family: 'JetBrains Mono', monospace;
          display: block;
          margin-bottom: 7px;
        }

        .status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse-ring 2s ease infinite;
          display: inline-block;
        }

        .corner-tl, .corner-tr, .corner-bl, .corner-br {
          position: absolute;
          width: 14px; height: 14px;
          border-color: rgba(59,130,246,0.4);
          border-style: solid;
        }
        .corner-tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
        .corner-tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }
        .corner-br { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        }
      `}</style>

      <main className="login-root flex min-h-screen bg-neutral-950">

        {/* ── Left panel: decorative ── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#080c14] flex-col justify-between p-14">

          {/* Animated grid */}
          <div className="absolute inset-0 grid-bg opacity-60" />

          {/* Scanline effect */}
          <div className="scanline" />

          {/* Radial glow bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%)' }}
          />
          {/* Radial glow top-left */}
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
          />

          {/* Top bar */}
          <div className="relative z-10 card-enter">
            <div className="flex items-center gap-3 mb-14">
              <span className="status-dot" />
              <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase' }}>
                System Online
              </span>
            </div>

            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 16 }}>
                Admin Control Panel
              </p>
              <h2
                className="login-title"
                style={{ fontSize: 44, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, marginBottom: 20 }}
              >
                Restricted<br />
                <span style={{ color: '#3b82f6' }}>Access</span><br />
                Zone
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.5)', lineHeight: 1.7, maxWidth: 320 }}>
                This area is restricted to authorized administrators only. Unauthorized access attempts are logged and monitored.
              </p>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 card-enter-1 space-y-4">
            <div className="divider-line mb-6" />
            {[
              { label: 'Session Timeout',  value: '30 min'    },
              { label: 'Access Level',      value: 'SUPERADMIN' },
              { label: 'Last Login',        value: 'Today' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(100,116,139,0.7)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, letterSpacing: '0.08em', color: 'rgba(148,163,184,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div className="flex flex-1 items-center justify-center px-6 py-16 relative">

          {/* Subtle bg glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(29,78,216,0.06) 0%, transparent 70%)' }}
          />

          <div className="relative w-full max-w-[400px] space-y-8 card-enter-2">

            {/* Card */}
            <div
              className="relative rounded-2xl p-8 space-y-7"
              style={{
                background: 'rgba(15,20,30,0.9)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Corner decorations */}
              <div className="corner-tl" />
              <div className="corner-tr" />
              <div className="corner-bl" />
              <div className="corner-br" />

              {/* Header */}
              <div className="card-enter-2">
                <div className="flex items-center gap-2.5 mb-5">
                  {/* Lock icon */}
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{ width: 36, height: 36, background: 'rgba(29,78,216,0.2)', border: '1px solid rgba(29,78,216,0.3)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)' }}>
                    Admin CMS
                  </span>
                </div>

                <h1
                  className="login-title"
                  style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em', lineHeight: 1.15 }}
                >
                  Masuk ke<br />
                  <span style={{ color: '#3b82f6' }}>Dashboard</span>
                </h1>
                <p style={{ marginTop: 8, fontSize: 12, color: 'rgba(100,116,139,0.8)' }}>
                  default: admin / admin123
                </p>
              </div>

              <div className="divider-line" />

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-5 card-enter-3">
                <div>
                  <label className="label-text">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused(null)}
                    placeholder="masukkan username"
                    className="input-field"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="label-text">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    className="input-field"
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div
                    className="error-shake flex items-center gap-2.5 rounded-lg px-4 py-3"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontSize: 12, color: '#f87171' }}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2.5">
                      Masuk
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <p
              className="card-enter-4 text-center"
              style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(71,85,105,0.6)', textTransform: 'uppercase' }}
            >
              Authorized personnel only · All activity is logged
            </p>
          </div>
        </div>
      </main>
    </>
  );
}