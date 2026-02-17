// src/App.tsx
import Hero from './components/Hero';
import Navbar from './components/Navbar';

function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Placeholder section lain nanti */}
      <section id="about" className="py-24 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Tentang Saya</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            {/* Isi deskripsi singkat tentang dirimu */}
            Saya adalah developer yang passionate di frontend & backend,
            suka membangun aplikasi yang scalable dan user-friendly.
          </p>
        </div>
      </section>

      {/* Tambah section Projects, Skills, Contact nanti */}
    </main>
  );
}

export default App;