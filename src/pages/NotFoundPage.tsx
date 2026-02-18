import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-neutral-100">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Halaman Tidak Ditemukan</h1>
        <p className="mt-3 text-sm text-neutral-400">
          URL yang kamu akses belum tersedia. Kembali ke halaman utama atau masuk ke admin panel.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
          >
            Ke Beranda
          </Link>
          <Link
            to="/admin/dashboard"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white"
          >
            Ke Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
