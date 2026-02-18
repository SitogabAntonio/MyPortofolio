import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import type { Skill, SkillFormData } from '../../lib/types';

const categories = ['all', 'frontend', 'backend', 'devops', 'design', 'other'] as const;

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormData>({
    name: '',
    category: 'frontend',
    yearsOfExperience: 1,
    icon: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      setSkills(await api.getSkills());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredSkills = useMemo(
    () => skills.filter((skill) => (category === 'all' ? true : skill.category === category)),
    [category, skills],
  );

  const reset = () => {
    setEditingId(null);
    setForm({ name: '', category: 'frontend', yearsOfExperience: 1, icon: '' });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingId) await api.updateSkill(editingId, form);
    else await api.createSkill(form);
    await loadData();
    reset();
  };

  const editSkill = (skill: Skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      yearsOfExperience: skill.yearsOfExperience,
      icon: skill.icon ?? '',
    });
  };

  const deleteSkill = async (id: string) => {
    await api.deleteSkill(id);
    await loadData();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Manajemen Skills</h1>
            <p className="text-sm text-neutral-400">Atur daftar skill dan pengalaman tahun.</p>
          </div>

          <button onClick={reset} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Skill
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
                category === item
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200'
                  : 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">{editingId ? 'Edit Skill' : 'Tambah Skill'}</h2>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} placeholder="Skill Name" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value as SkillFormData['category'] }))} className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2">
            {categories.filter((v) => v !== 'all').map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <input type="number" min={0} value={form.yearsOfExperience} onChange={(e) => setForm((v) => ({ ...v, yearsOfExperience: Number(e.target.value) }))} placeholder="Years of Experience" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <input value={form.icon ?? ''} onChange={(e) => setForm((v) => ({ ...v, icon: e.target.value }))} placeholder="Icon URL (optional)" className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
          <div className="md:col-span-2 flex gap-2">
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">{editingId ? 'Update' : 'Simpan'}</button>
            {editingId && <button type="button" onClick={reset} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</button>}
          </div>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm text-neutral-500">Memuat skill...</p>}
        {filteredSkills.map((skill) => (
          <article key={skill.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{skill.name}</h2>
                <p className="text-xs capitalize text-neutral-400">{skill.category}</p>
              </div>
              <span className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                {skill.yearsOfExperience} thn
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => editSkill(skill)} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white">
                Edit
              </button>
              <button onClick={() => void deleteSkill(skill.id)} className="rounded-lg border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
