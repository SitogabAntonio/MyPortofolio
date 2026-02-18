// src/components/Navbar.tsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800/60 bg-neutral-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Nio
        </Link>
        <div className="hidden md:flex gap-8">
          <a href="#about" className="hover:text-[var(--accent)] transition-colors">About</a>
          <a href="#projects" className="hover:text-[var(--accent)] transition-colors">Projects</a>
          <a href="#skills" className="hover:text-[var(--accent)] transition-colors">Skills</a>
          <Link to="/admin/dashboard" className="hover:text-[var(--accent)] transition-colors">Admin</Link>
        </div>
        {/* Mobile menu button nanti */}
      </div>
    </nav>
  );
}