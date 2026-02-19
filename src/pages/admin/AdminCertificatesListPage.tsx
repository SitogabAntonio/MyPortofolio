import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Certificate } from '../../lib/types';

export default function AdminCertificatesListPage() {
  const toast = useToast();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await api.getCertificates());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat certificate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const removeItem = async (id: string) => {
    try {
      await api.deleteCertificate(id);
      toast.success('Certificate berhasil dihapus');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus certificate');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">List Certificate</h1>
            <p className="text-sm text-neutral-400">Kelola sertifikat untuk ditampilkan di hero.</p>
          </div>
          <Link to="/admin/certificates/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Certificate
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {loading && <p className="text-sm text-neutral-500">Memuat certificate...</p>}
        {!loading && !items.length && <p className="text-sm text-neutral-500">Belum ada data certificate.</p>}
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="text-sm text-neutral-400">{item.issuer}</p>
                <p className="text-xs text-neutral-500">Terbit: {new Date(item.issueDate).toLocaleDateString('id-ID')}</p>
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="h-20 w-28 rounded-lg border border-neutral-800 object-cover" />
              )}
            </div>
            {item.description && <p className="mt-3 text-sm text-neutral-300">{item.description}</p>}
            <div className="mt-4 flex gap-2">
              <Link to={`/admin/certificates/${item.id}/edit`} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
                Edit
              </Link>
              <button onClick={() => void removeItem(item.id)} className="rounded-lg border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                Hapus
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
