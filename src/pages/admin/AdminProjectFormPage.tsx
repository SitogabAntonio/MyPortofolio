import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ProjectFormData, Tag } from '../../lib/types';

const emptyForm = (): ProjectFormData => ({
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

export default function AdminProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ProjectFormData>(emptyForm());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    const load = async () => {
      const tags = await api.getTags();
      setAllTags(tags);

      if (!id) return;

      const projects = await api.getProjects();
      const project = projects.find((item) => item.id === id);
      if (!project) return;

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
      setLoading(false);
    };

    void load().finally(() => setLoading(false));
  }, [id]);

  const filteredTags = useMemo(() => {
    const q = tagQuery.toLowerCase();
    return allTags.filter((tag) => tag.name.toLowerCase().includes(q));
  }, [allTags, tagQuery]);

  const addTag = (value: string) => {
    const tag = value.trim();
    if (!tag) return;
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }));
    setTagQuery('');
  };

  const removeTag = (value: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== value) }));
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const existing = form.imageUrls ?? [];
    const remaining = Math.max(0, 3 - existing.length);
    const selected = files.slice(0, remaining);
    const converted = await Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result ?? ''));
            reader.onerror = () => reject(new Error('Gagal membaca gambar'));
            reader.readAsDataURL(file);
          }),
      ),
    );

    setForm((prev) => {
      const imageUrls = [...(prev.imageUrls ?? []), ...converted].slice(0, 3);
      return {
        ...prev,
        imageUrls,
        imageUrl: imageUrls[0] ?? '',
      };
    });

    event.target.value = '';
  };

  const removeImage = (index: number) => {
    setForm((prev) => {
      const imageUrls = (prev.imageUrls ?? []).filter((_, idx) => idx !== index);
      return { ...prev, imageUrls, imageUrl: imageUrls[0] ?? '' };
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload: ProjectFormData = {
        ...form,
        imageUrls: (form.imageUrls ?? []).slice(0, 3),
        imageUrl: (form.imageUrls ?? [])[0] ?? '',
      };
      if (id) await api.updateProject(id, payload);
      else await api.createProject(payload);
      navigate('/admin/projects');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-neutral-500">Memuat form...</p>;
  }

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{isEdit ? 'Edit Project' : 'Tambah Project'}</h1>
        <Link to="/admin/projects" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
          Kembali ke list
        </Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder="Title" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.startDate} onChange={(e) => setForm((v) => ({ ...v, startDate: e.target.value }))} type="date" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />

        <select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value as ProjectFormData['category'] }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2">
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="desktop">Desktop</option>
          <option value="other">Other</option>
        </select>

        <select value={form.status} onChange={(e) => setForm((v) => ({ ...v, status: e.target.value as ProjectFormData['status'] }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2">
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />

        <div className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-neutral-500">Tags (multiple + search + ketik manual)</p>
          <div className="relative">
            <input
              value={tagQuery}
              onFocus={() => setShowTagDropdown(true)}
              onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
              onChange={(e) => setTagQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(tagQuery);
                }
              }}
              placeholder="Cari tag atau tekan Enter untuk tambah query"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
            />

            {showTagDropdown && (
              <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-neutral-700 bg-neutral-900 p-1">
                {filteredTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onMouseDown={() => addTag(tag.name)}
                    className="block w-full rounded px-2 py-1.5 text-left text-sm text-neutral-300 hover:bg-neutral-800"
                  >
                    {tag.name}
                  </button>
                ))}
                {!filteredTags.length && (
                  <p className="px-2 py-1.5 text-xs text-neutral-500">Tidak ada tag cocok. Tekan Enter untuk pakai query ini.</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <button key={tag} type="button" onClick={() => removeTag(tag)} className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200">
                {tag} ×
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-neutral-500">Upload gambar lokal (max 3)</p>
          <input type="file" accept="image/*" multiple onChange={onImageChange} className="text-sm text-neutral-300" />
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(form.imageUrls ?? []).map((url, index) => (
              <div key={`${url.slice(0, 20)}-${index}`} className="rounded-lg border border-neutral-700 p-2">
                <img src={url} alt={`Preview ${index + 1}`} className="h-24 w-full rounded object-cover" />
                <button type="button" onClick={() => removeImage(index)} className="mt-2 w-full rounded border border-red-700/60 px-2 py-1 text-xs text-red-300">
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <input value={form.demoUrl ?? ''} onChange={(e) => setForm((v) => ({ ...v, demoUrl: e.target.value }))} placeholder="Demo URL" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.githubUrl ?? ''} onChange={(e) => setForm((v) => ({ ...v, githubUrl: e.target.value }))} placeholder="Github URL" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />

        <div className="md:col-span-2 flex gap-2">
          <button disabled={saving} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            {saving ? 'Menyimpan...' : isEdit ? 'Update' : 'Simpan'}
          </button>
          <Link to="/admin/projects" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">
            Batal
          </Link>
        </div>
      </form>
    </section>
  );
}
