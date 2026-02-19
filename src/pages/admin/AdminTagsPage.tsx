import { useEffect, useState } from 'react';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Tag } from '../../lib/types';

export default function AdminTagsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Tag | null>(null);

  const load = async () => {
    try {
      setItems(await api.getTags());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat tags');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      if (editing) {
        await api.updateTag(editing.id, name.trim());
        toast.success('Tag berhasil diperbarui');
      } else {
        await api.createTag(name.trim());
        toast.success('Tag berhasil ditambahkan');
      }
      setName('');
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan tag');
    }
  };

  const onEdit = (tag: Tag) => {
    setEditing(tag);
    setName(tag.name);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h1 className="text-xl font-semibold text-white">Manajemen Tag</h1>
        <p className="text-sm text-neutral-400">Tambah, edit, dan hapus tag project dari satu menu.</p>

        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama tag"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950">
            {editing ? 'Update' : 'Tambah'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName('');
              }}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-sm"
            >
              Batal
            </button>
          )}
        </form>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((tag) => (
          <article key={tag.id} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <p className="font-medium text-white">{tag.name}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onEdit(tag)} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs">
                Edit
              </button>
              <button
                onClick={() => {
                  void api
                    .deleteTag(tag.id)
                    .then(async () => {
                      toast.success('Tag berhasil dihapus');
                      await load();
                    })
                    .catch((err: unknown) => {
                      toast.error(err instanceof Error ? err.message : 'Gagal menghapus tag');
                    });
                }}
                className="rounded-lg border border-red-700/60 px-3 py-1 text-xs text-red-300"
              >
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
