import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import type { DashboardOverview, Experience, Project } from '../../lib/types';

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-neutral-500">{hint}</p>
    </article>
  );
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewData, projectsData, experiencesData] = await Promise.all([
          api.getOverview(),
          api.getProjects(),
          api.getExperiences(),
        ]);
        setOverview(overviewData);
        setProjects(projectsData);
        setExperiences(experiencesData);
      } catch {
        setOverview({ totalProjects: 0, activeProjects: 0, totalExperiences: 0, totalSkills: 0 });
        setProjects([]);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Overview</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Dashboard Admin</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Data langsung ditarik dari backend D1. Jika masih kosong, kamu bisa isi dari halaman CRUD.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/60" />
          ))
        ) : (
          <>
            <StatCard label="Total Project" value={String(overview?.totalProjects ?? 0)} hint={`${overview?.activeProjects ?? 0} project aktif`} />
            <StatCard label="Total Experience" value={String(overview?.totalExperiences ?? 0)} hint="Riwayat kerja profesional" />
            <StatCard label="Total Skills" value={String(overview?.totalSkills ?? 0)} hint="Katalog skill portfolio" />
            <StatCard label="Status" value="Live" hint="Backend API Cloudflare Functions" />
          </>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Project Terbaru</h2>
            <Link to="/admin/projects" className="text-sm text-indigo-400 hover:text-indigo-300">
              Kelola
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="rounded-xl border border-neutral-800 p-3">
                <p className="font-medium text-white">{project.title}</p>
                <p className="mt-1 text-xs text-neutral-400">{project.tags.join(' • ') || 'Tanpa tag'}</p>
              </div>
            ))}
            {!projects.length && <p className="text-sm text-neutral-500">Belum ada data project.</p>}
          </div>
        </article>

        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Experience Terbaru</h2>
            <Link to="/admin/experiences" className="text-sm text-indigo-400 hover:text-indigo-300">
              Kelola
            </Link>
          </div>
          <div className="space-y-3">
            {experiences.slice(0, 4).map((exp) => (
              <div key={exp.id} className="rounded-xl border border-neutral-800 p-3">
                <p className="font-medium text-white">{exp.position}</p>
                <p className="text-xs text-neutral-400">{exp.company} • {exp.location}</p>
              </div>
            ))}
            {!experiences.length && <p className="text-sm text-neutral-500">Belum ada data experience.</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
