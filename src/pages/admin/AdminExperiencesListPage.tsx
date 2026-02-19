import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Experience } from '../../lib/types';

export default function AdminExperiencesListPage() {
  const toast = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await api.getExperiences());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat experience');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const removeItem = async (id: string) => {
    try {
      await api.deleteExperience(id);
      toast.success('Experience berhasil dihapus');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus experience');
    }
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
    const end = endDate
      ? new Date(endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
      : 'Sekarang';
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">List Experience</h1>
            <p className="text-sm text-neutral-400">Halaman daftar terpisah untuk pengalaman kerja.</p>
          </div>
          <Link to="/admin/experiences/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Experience
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {loading && <p className="text-sm text-neutral-500">Memuat data...</p>}
        {items.map((experience) => (
          <article key={experience.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{experience.position}</h2>
                <p className="text-sm text-neutral-400">
                  {experience.company} • {experience.location}
                </p>
              </div>
              <span className="w-fit rounded-lg border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300">
                {formatDateRange(experience.startDate, experience.endDate)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-neutral-300">{experience.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span key={tech} className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Link to={`/admin/experiences/${experience.id}/edit`} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
                Edit
              </Link>
              <button onClick={() => void removeItem(experience.id)} className="rounded-lg border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
