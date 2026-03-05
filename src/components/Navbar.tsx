import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/15 bg-slate-950/55 px-5 py-3 text-slate-100 shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <Link to="/" className="font-['Fraunces',serif] text-2xl leading-none text-cyan-100">
          Nio
        </Link>

        <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] md:flex">
          <a href="#about" className="text-slate-200/90 transition hover:text-cyan-200">About</a>
          <a href="#projects" className="text-slate-200/90 transition hover:text-cyan-200">Projects</a>
          <a href="#skills" className="text-slate-200/90 transition hover:text-cyan-200">Skills</a>
          <a href="#gallery" className="text-slate-200/90 transition hover:text-cyan-200">Gallery</a>
          <Link to="/admin/dashboard" className="rounded-full border border-white/20 px-3 py-1.5 text-slate-100 transition hover:border-cyan-200 hover:text-cyan-100">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
