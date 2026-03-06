import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from '../../components/admin/PaginationControls';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Project } from '../../lib/types';

export default function AdminProjectsListPage() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await api.getProjects());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      projects.filter((item) => {
        const q = search.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.tags.join(' ').toLowerCase().includes(q);
      }),
    [projects, search],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pagedProjects = filtered.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const remove = async (id: string) => {
    try {
      await api.deleteProject(id);
      toast.success('Project berhasil dihapus');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus project');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">List Project</h1>
            <p className="text-sm text-neutral-400">Halaman terpisah untuk daftar project.</p>
          </div>
          <Link to="/admin/projects/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Project
          </Link>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul / tag"
          className="mt-4 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
        />
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800 text-sm">
            <thead>
              <tr className="text-left text-neutral-400">
                <th className="px-3 py-3 font-medium">Project</th>
                <th className="px-3 py-3 font-medium">Tags</th>
                <th className="px-3 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {(loading ? [] : pagedProjects).map((project) => (
                <tr key={project.id} className="text-neutral-200">
                  <td className="px-3 py-3">
                    <p className="font-medium text-white">{project.title}</p>
                    <p className="text-xs text-neutral-500">{project.startDate}</p>
                  </td>
                  <td className="px-3 py-3">{project.tags.join(', ') || '-'}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/projects/${project.id}/edit`} className="rounded-lg border border-neutral-700 px-2.5 py-1 text-xs">
                        Edit
                      </Link>
                      <button onClick={() => void remove(project.id)} className="rounded-lg border border-red-700/60 px-2.5 py-1 text-xs text-red-300">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-neutral-500">Memuat data...</td>
                </tr>
              )}
              {!loading && !filtered.length && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-neutral-500">
                    Tidak ada project yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalItems={filtered.length}
            itemLabel="project"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </section>
    </div>
  );
}
