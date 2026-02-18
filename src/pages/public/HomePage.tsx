import Hero from '../../components/Hero';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="about" className="bg-neutral-900/50 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-8 text-4xl font-bold md:text-5xl">Tentang Saya</h2>
          <p className="mx-auto max-w-3xl text-lg text-neutral-300">
            Saya adalah developer yang passionate di frontend & backend, suka membangun
            aplikasi yang scalable dan user-friendly.
          </p>
        </div>
      </section>
    </>
  );
}
