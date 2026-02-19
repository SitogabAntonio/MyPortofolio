import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { GalleryFormData } from '../../lib/types';

export default function AdminGalleryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<GalleryFormData>({
    title: '',
    description: '',
    imageUrl: '',
    sortOrder: 0,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const encoded = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
        reader.readAsDataURL(file);
      });
      setForm((prev) => ({ ...prev, imageUrl: encoded }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal upload gambar');
    } finally {
      event.target.value = '';
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const items = await api.getGalleries();
        const found = items.find((item) => item.id === id);
        if (!found) return;
        setForm({
          title: found.title,
          description: found.description ?? '',
          imageUrl: found.imageUrl,
          sortOrder: found.sortOrder,
          isFeatured: found.isFeatured,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat gallery');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, toast]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.updateGallery(id, form);
        toast.success('Gallery berhasil diperbarui');
      } else {
        await api.createGallery(form);
        toast.success('Gallery berhasil ditambahkan');
      }
      navigate('/admin/galleries');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan gallery');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-neutral-500">Memuat form...</p>;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{id ? 'Edit Gallery' : 'Tambah Gallery'}</h2>
        <Link to="/admin/galleries" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
          Kembali ke list
        </Link>
      </div>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-neutral-300">
          <span>Judul</span>
          <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>

        <div className="space-y-1 text-sm text-neutral-300 md:col-span-2">
          <span>Upload Gambar (dari file lokal)</span>
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-500">
            Choose Files
            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
          </label>
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview gallery" className="mt-2 h-40 w-full max-w-sm rounded-lg border border-neutral-800 object-cover" />
          ) : (
            <p className="mt-2 text-xs text-neutral-500">Belum ada gambar dipilih.</p>
          )}
        </div>

        <label className="space-y-1 text-sm text-neutral-300">
          <span>Urutan</span>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm((v) => ({ ...v, sortOrder: Number(e.target.value) }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-300 md:pt-7">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((v) => ({ ...v, isFeatured: e.target.checked }))} />
          Featured
        </label>
        <label className="space-y-1 text-sm text-neutral-300 md:col-span-2">
          <span>Deskripsi (opsional)</span>
          <textarea value={form.description ?? ''} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" rows={3} />
        </label>

        <div className="md:col-span-2 flex gap-2">
          <button disabled={saving} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            {saving ? 'Menyimpan...' : id ? 'Update' : 'Simpan'}
          </button>
          <Link to="/admin/galleries" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</Link>
        </div>
      </form>
    </section>
  );
}
