import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import type { Project, ProjectFormData } from '../../lib/types';

const statusStyle: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'in-progress': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  archived: 'bg-neutral-500/15 text-neutral-300 border-neutral-500/30',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'archived'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    imageUrls: [],
    demoUrl: '',
    githubUrl: '',
    tags: [],
    category: 'web',
    featured: false,
    status: 'in-progress',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      setProjects(await api.getProjects());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchSearch =
          project.title.toLowerCase().includes(search.toLowerCase()) ||
          project.tags.join(' ').toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : project.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [projects, search, statusFilter],
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      longDescription: '',
      imageUrl: '',
      imageUrls: [],
      demoUrl: '',
      githubUrl: '',
      tags: [],
      category: 'web',
      featured: false,
      status: 'in-progress',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload: ProjectFormData = {
        ...form,
        tags: form.tags,
        imageUrls: form.imageUrls,
      };
      if (editingId) {
        await api.updateProject(editingId, payload);
      } else {
        await api.createProject(payload);
      }
      await loadProjects();
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription ?? '',
      imageUrl: project.imageUrl,
      imageUrls: project.imageUrls ?? [],
      demoUrl: project.demoUrl ?? '',
      githubUrl: project.githubUrl ?? '',
      tags: project.tags,
      category: project.category,
      featured: project.featured,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate ?? '',
    });
  };

  const removeProject = async (id: string) => {
    await api.deleteProject(id);
    await loadProjects();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Manajemen Projects</h1>
            <p className="text-sm text-neutral-400">Kelola daftar project portfolio (frontend mock view).</p>
          </div>

          <button onClick={resetForm} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Project
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari berdasarkan judul atau tags..."
            className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 outline-none ring-indigo-500/40 placeholder:text-neutral-500 focus:ring"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none ring-indigo-500/40 focus:ring"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">{editingId ? 'Edit Project' : 'Tambah Project'}</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.startDate} onChange={(e) => setForm((v) => ({ ...v, startDate: e.target.value }))} type="date" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.imageUrl} onChange={(e) => setForm((v) => ({ ...v, imageUrl: e.target.value }))} placeholder="Image URL" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value as ProjectFormData['category'] }))} placeholder="Category" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.tags.join(', ')} onChange={(e) => setForm((v) => ({ ...v, tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} placeholder="Tags (comma separated)" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <div className="md:col-span-2 flex gap-2">
            <button disabled={saving} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
              {saving ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800 text-sm">
            <thead>
              <tr className="text-left text-neutral-400">
                <th className="px-3 py-3 font-medium">Project</th>
                <th className="px-3 py-3 font-medium">Kategori</th>
                <th className="px-3 py-3 font-medium">Tags</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {(loading ? [] : filteredProjects).map((project) => (
                <tr key={project.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium text-white">{project.title}</p>
                    <p className="text-xs text-neutral-500">{project.startDate}</p>
                  </td>
                  <td className="px-3 py-3 capitalize">{project.category}</td>
                  <td className="px-3 py-3">
                    <div className="flex max-w-xs flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-lg border px-2 py-1 text-xs ${statusStyle[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => editProject(project)} className="rounded-lg border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white">
                        Edit
                      </button>
                      <button onClick={() => void removeProject(project.id)} className="rounded-lg border border-red-700/60 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/10">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-neutral-500">Memuat data...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
