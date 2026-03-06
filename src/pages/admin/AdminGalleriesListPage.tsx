import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from '../../components/admin/PaginationControls';
import { useToast } from '../../components/shared/ToastProvider';
import { api } from '../../lib/api';
import type { Gallery } from '../../lib/types';

export default function AdminGalleriesListPage() {
  const toast = useToast();
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await api.getGalleries());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const removeItem = async (id: string) => {
    try {
      await api.deleteGallery(id);
      toast.success('Gallery berhasil dihapus');
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus gallery');
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.title} ${item.description ?? ''}`.toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const start = (page - 1) * pageSize;
  const pagedItems = filteredItems.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">List Gallery</h1>
            <p className="text-sm text-neutral-400">Kelola gambar gallery untuk section hero.</p>
          </div>
          <Link to="/admin/galleries/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            + Tambah Gallery
          </Link>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari judul gallery"
          className="mt-4 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm text-neutral-500">Memuat gallery...</p>}
        {!loading && !filteredItems.length && <p className="text-sm text-neutral-500">Tidak ada gallery yang cocok.</p>}
        {pagedItems.map((item) => (
          <article key={item.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <img src={item.imageUrl} alt={item.title} className="h-40 w-full rounded-lg border border-neutral-800 object-cover" />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-white">{item.title}</h2>
                <p className="text-xs text-neutral-400">Urutan: {item.sortOrder}</p>
              </div>
              {item.isFeatured && <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Featured</span>}
            </div>
            {item.description && <p className="mt-2 text-sm text-neutral-300">{item.description}</p>}
            <div className="mt-4 flex gap-2">
              <Link to={`/admin/galleries/${item.id}/edit`} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300">
                Edit
              </Link>
              <button onClick={() => void removeItem(item.id)} className="rounded-lg border border-red-700/60 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                Hapus
              </button>
            </div>
          </article>
        ))}

        {!loading && filteredItems.length > 0 && (
          <div className="sm:col-span-2 xl:col-span-3">
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalItems={filteredItems.length}
              itemLabel="gallery"
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
}
