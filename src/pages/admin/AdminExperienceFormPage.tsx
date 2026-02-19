import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { ExperienceFormData, Tag } from '../../lib/types';

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
  const toast = useToast();
  const [form, setForm] = useState<ExperienceFormData>(emptyForm());
  const [loading, setLoading] = useState(Boolean(id));
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setAllTags(await api.getTags());
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
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat experience');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, toast]);

  const filteredTags = allTags.filter(
    (tag) => tag.name.toLowerCase().includes(tagQuery.toLowerCase()) && !form.technologies.includes(tag.name),
  );

  const addTech = (value: string) => {
    const tag = value.trim();
    if (!tag) return;
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tag) ? prev.technologies : [...prev.technologies, tag],
    }));
    setTagQuery('');
  };

  const removeTech = (value: string) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((item) => item !== value) }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (id) {
        await api.updateExperience(id, form);
        toast.success('Experience berhasil diperbarui');
      } else {
        await api.createExperience(form);
        toast.success('Experience berhasil ditambahkan');
      }
      navigate('/admin/experiences');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan experience');
    }
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
        <div className="md:col-span-2 rounded-xl border border-neutral-700 bg-neutral-950 p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-neutral-500">Technologies (pakai tags)</p>
          <div className="relative">
            <input
              value={tagQuery}
              onFocus={() => setShowTagDropdown(true)}
              onBlur={() => setTimeout(() => setShowTagDropdown(false), 150)}
              onChange={(e) => setTagQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTech(tagQuery);
                }
              }}
              placeholder="Cari tags atau tekan Enter"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
            />
            {showTagDropdown && (
              <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-neutral-700 bg-neutral-900 p-1">
                {filteredTags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onMouseDown={() => addTech(tag.name)}
                    className="block w-full rounded px-2 py-1.5 text-left text-sm text-neutral-300 hover:bg-neutral-800"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.technologies.map((tech) => (
              <button key={tech} type="button" onClick={() => removeTech(tech)} className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-200">
                {tech} ×
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">{id ? 'Update' : 'Simpan'}</button>
          <Link to="/admin/experiences" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</Link>
        </div>
      </form>
    </section>
  );
}
