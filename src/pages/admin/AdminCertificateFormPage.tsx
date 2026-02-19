import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { CertificateFormData } from '../../lib/types';

export default function AdminCertificateFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<CertificateFormData>({
    title: '',
    issuer: '',
    issueDate: new Date().toISOString().slice(0, 10),
    credentialUrl: '',
    imageUrl: '',
    description: '',
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
        const items = await api.getCertificates();
        const found = items.find((item) => item.id === id);
        if (!found) return;
        setForm({
          title: found.title,
          issuer: found.issuer,
          issueDate: found.issueDate,
          credentialUrl: found.credentialUrl ?? '',
          imageUrl: found.imageUrl ?? '',
          description: found.description ?? '',
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat certificate');
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
        await api.updateCertificate(id, form);
        toast.success('Certificate berhasil diperbarui');
      } else {
        await api.createCertificate(form);
        toast.success('Certificate berhasil ditambahkan');
      }
      navigate('/admin/certificates');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan certificate');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-neutral-500">Memuat form...</p>;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{id ? 'Edit Certificate' : 'Tambah Certificate'}</h2>
        <Link to="/admin/certificates" className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
          Kembali ke list
        </Link>
      </div>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-neutral-300">
          <span>Judul</span>
          <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm text-neutral-300">
          <span>Issuer</span>
          <input value={form.issuer} onChange={(e) => setForm((v) => ({ ...v, issuer: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm text-neutral-300">
          <span>Tanggal Terbit</span>
          <input type="date" value={form.issueDate} onChange={(e) => setForm((v) => ({ ...v, issueDate: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>
        <label className="space-y-1 text-sm text-neutral-300">
          <span>Credential URL (opsional)</span>
          <input value={form.credentialUrl ?? ''} onChange={(e) => setForm((v) => ({ ...v, credentialUrl: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" />
        </label>
        <div className="space-y-1 text-sm text-neutral-300 md:col-span-2">
          <span>Upload Gambar Sertifikat (file lokal, opsional)</span>
          <label className="mt-1 inline-flex cursor-pointer items-center rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-500">
            Choose Files
            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
          </label>
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Preview certificate" className="mt-2 h-40 w-full max-w-sm rounded-lg border border-neutral-800 object-cover" />
          ) : (
            <p className="mt-2 text-xs text-neutral-500">Belum ada gambar dipilih.</p>
          )}
        </div>
        <label className="space-y-1 text-sm text-neutral-300 md:col-span-2">
          <span>Deskripsi (opsional)</span>
          <textarea value={form.description ?? ''} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2" rows={4} />
        </label>
        <div className="md:col-span-2 flex gap-2">
          <button disabled={saving} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            {saving ? 'Menyimpan...' : id ? 'Update' : 'Simpan'}
          </button>
          <Link to="/admin/certificates" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm">Batal</Link>
        </div>
      </form>
    </section>
  );
}
