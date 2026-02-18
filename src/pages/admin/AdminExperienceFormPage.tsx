import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { ExperienceFormData } from '../../lib/types';

const emptyForm = (): ExperienceFormData => ({
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

export default function AdminExperienceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ExperienceFormData>(emptyForm());
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const items = await api.getExperiences();
      const found = items.find((item) => item.id === id);
      if (!found) return;
      setForm({
        company: found.company,
        position: found.position,
        location: found.location,
        type: found.type,
        startDate: found.startDate,
        endDate: found.endDate ?? '',
        description: found.description,
        achievements: found.achievements,
        technologies: found.technologies,
      });
    };

    void load().finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (id) await api.updateExperience(id, form);
    else await api.createExperience(form);
    navigate('/admin/experiences');
  };

  if (loading) return <p className="text-sm text-neutral-500">Memuat form...</p>;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{id ? 'Edit Experience' : 'Tambah Experience'}</h2>
        <Link to="/admin/experiences" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
          Kembali ke list
        </Link>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <input value={form.company} onChange={(e) => setForm((v) => ({ ...v, company: e.target.value }))} placeholder="Company" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.position} onChange={(e) => setForm((v) => ({ ...v, position: e.target.value }))} placeholder="Position" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input type="date" value={form.startDate} onChange={(e) => setForm((v) => ({ ...v, startDate: e.target.value }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.technologies.join(', ')} onChange={(e) => setForm((v) => ({ ...v, technologies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) }))} placeholder="Technologies (comma separated)" className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <div className="md:col-span-2 flex gap-2">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">{id ? 'Update' : 'Simpan'}</button>
          <Link to="/admin/experiences" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</Link>
        </div>
      </form>
    </section>
  );
}
