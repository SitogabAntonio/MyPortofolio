import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { ProfileInfo } from '../../lib/types';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setProfile(await api.getProfile());
    };
    void load();
  }, []);

  const update = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile(await api.updateProfile(profile));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">Pengaturan umum profil portfolio dan preferensi panel.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-lg font-semibold text-white">Profile Info</h2>
          {!profile && <p className="mt-3 text-sm text-neutral-500">Memuat profile...</p>}
          <div className="mt-4 space-y-3 text-sm text-neutral-300">
            <div>
              <p className="text-neutral-500">Nama</p>
              <input value={profile?.name ?? ''} onChange={(e) => setProfile((v) => (v ? { ...v, name: e.target.value } : v))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2" />
            </div>
            <div>
              <p className="text-neutral-500">Tagline</p>
              <input value={profile?.tagline ?? ''} onChange={(e) => setProfile((v) => (v ? { ...v, tagline: e.target.value } : v))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2" />
            </div>
            <div>
              <p className="text-neutral-500">Email</p>
              <input value={profile?.email ?? ''} onChange={(e) => setProfile((v) => (v ? { ...v, email: e.target.value } : v))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2" />
            </div>
            <div>
              <p className="text-neutral-500">Lokasi</p>
              <input value={profile?.location ?? ''} onChange={(e) => setProfile((v) => (v ? { ...v, location: e.target.value } : v))} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2" />
            </div>
          </div>

          <button onClick={() => void update()} className="mt-5 rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white">
            {saving ? 'Menyimpan...' : 'Simpan Profile'}
          </button>
        </article>

        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-lg font-semibold text-white">Panel Preferences</h2>
          <div className="mt-4 space-y-3 text-sm text-neutral-300">
            <label className="flex items-center justify-between rounded-lg border border-neutral-800 p-3">
              <span>Tampilkan notifikasi desktop</span>
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-neutral-800 p-3">
              <span>Highlight item terbaru</span>
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-neutral-800 p-3">
              <span>Mode compact tabel</span>
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" />
            </label>
          </div>

          <button onClick={() => void update()} className="mt-5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200">
            Simpan Preferences
          </button>
        </article>
      </section>
    </div>
  );
}
