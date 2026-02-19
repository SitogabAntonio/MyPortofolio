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
    <main
      className="flex min-h-screen items-center justify-center px-4 bg-[#0c0c0c] font-['DM_Mono',monospace]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      <div className="w-full max-w-[360px] animate-[fadeUp_0.65s_ease_both]">

        {/* Heading */}
        <div className="mb-8">
          <p className="font-['Bebas_Neue'] text-[11px] tracking-[0.35em] text-blue-700 uppercase mb-2.5">
            Admin Panel
          </p>
          <h1 className="font-['DM_Serif_Display',serif] text-[clamp(2rem,6vw,2.6rem)] text-neutral-100 leading-[1.1] font-normal">
            Masuk ke<br />
            <em className="text-blue-700">Dashboard</em>
          </h1>
        </div>

        {/* Card */}
        <div className="relative p-6 bg-[#111111] border border-neutral-800 rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">

          {/* Corner brackets */}
          <span className="absolute top-3 left-3 w-[13px] h-[13px] border-t border-l border-blue-700/30" />
          <span className="absolute top-3 right-3 w-[13px] h-[13px] border-t border-r border-blue-700/30" />
          <span className="absolute bottom-3 left-3 w-[13px] h-[13px] border-b border-l border-blue-700/30" />
          <span className="absolute bottom-3 right-3 w-[13px] h-[13px] border-b border-r border-blue-700/30" />

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[9.5px] tracking-[0.2em] uppercase text-neutral-600 mb-1.5">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                autoComplete="username"
                className="
                  w-full bg-white/[0.03] border border-neutral-800 rounded-lg
                  px-3.5 py-3 text-[13px] text-neutral-200 placeholder-neutral-700
                  font-['DM_Mono',monospace] tracking-wide outline-none
                  focus:border-blue-700 focus:bg-blue-700/[0.04] focus:ring-[3px] focus:ring-blue-700/10
                  transition-all duration-200
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[9.5px] tracking-[0.2em] uppercase text-neutral-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="
                  w-full bg-white/[0.03] border border-neutral-800 rounded-lg
                  px-3.5 py-3 text-[13px] text-neutral-200 placeholder-neutral-700
                  font-['DM_Mono',monospace] tracking-wide outline-none
                  focus:border-blue-700 focus:bg-blue-700/[0.04] focus:ring-[3px] focus:ring-blue-700/10
                  transition-all duration-200
                "
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 bg-blue-700/[0.07] border border-blue-700/25 rounded-lg">
                <svg
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-[11.5px] text-blue-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2.5
                  py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-55 disabled:cursor-not-allowed
                  text-white font-['Bebas_Neue'] text-base tracking-[0.22em]
                  rounded-lg border-0 cursor-pointer
                  transition-all duration-200
                  hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(185,28,28,0.3)]
                  active:translate-y-0
                "
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-[9px] tracking-[0.18em] text-neutral-800 uppercase">
          Authorized personnel only · All activity is logged
        </p>
      </div>
    </main>
  );
}