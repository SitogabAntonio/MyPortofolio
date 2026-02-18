import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import type { SkillFormData } from '../../lib/types';

export default function AdminSkillFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<SkillFormData>({
    name: '',
    category: 'frontend',
    yearsOfExperience: 1,
    icon: '',
  });
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const skills = await api.getSkills();
      const skill = skills.find((item) => item.id === id);
      if (!skill) return;
      setForm({
        name: skill.name,
        category: skill.category,
        yearsOfExperience: skill.yearsOfExperience,
        icon: skill.icon ?? '',
      });
    };

    void load().finally(() => setLoading(false));
  }, [id]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (id) await api.updateSkill(id, form);
    else await api.createSkill(form);
    navigate('/admin/skills');
  };

  if (loading) return <p className="text-sm text-neutral-500">Memuat form...</p>;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{id ? 'Edit Skill' : 'Tambah Skill'}</h2>
        <Link to="/admin/skills" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
          Kembali ke list
        </Link>
      </div>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Skill Name" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value as SkillFormData['category'] }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2">
          {['frontend', 'backend', 'devops', 'design', 'other'].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <input type="number" min={0} value={form.yearsOfExperience} onChange={(e) => setForm((v) => ({ ...v, yearsOfExperience: Number(e.target.value) }))} placeholder="Years of Experience" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <input value={form.icon ?? ''} onChange={(e) => setForm((v) => ({ ...v, icon: e.target.value }))} placeholder="Icon URL (optional)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        <div className="md:col-span-2 flex gap-2">
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">{id ? 'Update' : 'Simpan'}</button>
          <Link to="/admin/skills" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</Link>
        </div>
      </form>
    </section>
  );
}
