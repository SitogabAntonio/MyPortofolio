import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from '../../components/admin/PaginationControls';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Skill } from '../../lib/types';

const categories = ['all', 'frontend', 'backend', 'devops', 'design', 'other'] as const;

export default function AdminSkillsListPage() {
  const toast = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const loadData = async () => {
    setLoading(true);
    try {
      setSkills(await api.getSkills());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat skill');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => {
        const categoryMatch = category === 'all' ? true : skill.category === category;
        const q = search.trim().toLowerCase();
        const searchMatch = q ? `${skill.name} ${skill.category}`.toLowerCase().includes(q) : true;
        return categoryMatch && searchMatch;
      }),
    [category, search, skills],
  );

  const totalPages = Math.max(1, Math.ceil(filteredSkills.length / pageSize));
  const start = (page - 1) * pageSize;
  const pagedSkills = filteredSkills.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [category, search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const deleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id);
      toast.success('Skill berhasil dihapus');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus skill');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">List Skills</h1>
            <p className="text-sm text-neutral-400">Halaman daftar skill terpisah.</p>
          </div>

          <Link to="/admin/skills/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Skill
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
                category === item
                  ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-white'
                  : 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama skill"
          className="mt-4 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm text-neutral-500">Memuat skill...</p>}
        {!loading && !filteredSkills.length && <p className="text-sm text-neutral-500">Tidak ada skill yang cocok.</p>}
        {pagedSkills.map((skill) => (
          <article key={skill.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {skill.icon && (
                    <img
                      src={skill.icon}
                      alt={`${skill.name} icon`}
                      className="h-5 w-5 rounded object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <h2 className="text-lg font-semibold text-white">{skill.name}</h2>
                </div>
                <p className="text-xs capitalize text-neutral-400">{skill.category}</p>
              </div>
              <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                {skill.yearsOfExperience} thn
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link to={`/admin/skills/${skill.id}/edit`} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
                Edit
              </Link>
              <button onClick={() => void deleteSkill(skill.id)} className="rounded-lg border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                Hapus
              </button>
            </div>
          </article>
        ))}

        {!loading && filteredSkills.length > 0 && (
          <div className="sm:col-span-2 xl:col-span-3">
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalItems={filteredSkills.length}
              itemLabel="skill"
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
