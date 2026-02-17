// src/components/Navbar.tsx
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/70 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Nio
        </a>
        <div className="hidden md:flex gap-8">
          <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
          <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
        </div>
        {/* Mobile menu button nanti */}
      </div>
    </nav>
  );
}