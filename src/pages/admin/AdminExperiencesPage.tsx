import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { Experience, ExperienceFormData } from '../../lib/types';

export default function AdminExperiencesPage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceFormData>({
    company: '',
    position: '',
    location: '',
    type: 'full-time',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    description: '',
    achievements: [],
    technologies: [],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await api.getExperiences());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm({
      company: '',
      position: '',
      location: '',
      type: 'full-time',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      description: '',
      achievements: [],
      technologies: [],
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) await api.updateExperience(editingId, form);
    else await api.createExperience(form);
    await loadData();
    reset();
  };

  const editItem = (item: Experience) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      position: item.position,
      location: item.location,
      type: item.type,
      startDate: item.startDate,
      endDate: item.endDate ?? '',
      description: item.description,
      achievements: item.achievements,
      technologies: item.technologies,
    });
  };

  const removeItem = async (id: string) => {
    await api.deleteExperience(id);
    await loadData();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Manajemen Experience</h1>
            <p className="text-sm text-neutral-400">Kelola riwayat kerja dan pengalaman profesional.</p>
          </div>
          <button onClick={reset} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Experience
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">{editingId ? 'Edit Experience' : 'Tambah Experience'}</h2>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input value={form.company} onChange={(e) => setForm((v) => ({ ...v, company: e.target.value }))} placeholder="Company" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.position} onChange={(e) => setForm((v) => ({ ...v, position: e.target.value }))} placeholder="Position" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input type="date" value={form.startDate} onChange={(e) => setForm((v) => ({ ...v, startDate: e.target.value }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.technologies.join(', ')} onChange={(e) => setForm((v) => ({ ...v, technologies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} placeholder="Technologies (comma separated)" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <div className="md:col-span-2 flex gap-2">
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">{editingId ? 'Update' : 'Simpan'}</button>
            {editingId && <button type="button" onClick={reset} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</button>}
          </div>
        </form>
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
                {experience.startDate} - {experience.endDate ?? 'Sekarang'}
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
              <button onClick={() => editItem(experience)} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white">
                Edit
              </button>
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
