export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-10 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <p className="tracking-[0.04em]">Copyright {new Date().getFullYear()} Nio Portfolio.</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Built with React and Cloudflare Pages</p>
      </div>
    </footer>
  );
}
