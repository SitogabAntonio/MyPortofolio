export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[var(--surface)]/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Nio Portfolio. Built with React + Cloudflare.</p>
      </div>
    </footer>
  );
}
