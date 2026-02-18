import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { ProfileInfo } from '../../lib/types';
import { appThemes } from '../../lib/themes';

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('app_theme') || 'neutral');

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

  const changeTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem('app_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  const onAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const encoded = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Gagal membaca file avatar'));
      reader.readAsDataURL(file);
    });

    setProfile((prev) => (prev ? { ...prev, avatarUrl: encoded } : prev));
    event.target.value = '';
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
            <div>
              <p className="text-neutral-500">Foto Profile (untuk public view)</p>
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="mt-1 block w-full text-sm text-neutral-300"
              />
              {profile?.avatarUrl && (
                <img src={profile.avatarUrl} alt="Avatar preview" className="mt-2 h-24 w-24 rounded-lg border border-neutral-700 object-cover" />
              )}
            </div>
          </div>

          <button onClick={() => void update()} className="mt-5 rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white">
            {saving ? 'Menyimpan...' : 'Simpan Profile'}
          </button>
        </article>

        <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
          <h2 className="text-lg font-semibold text-white">Panel Preferences</h2>
          <p className="mt-1 text-sm text-neutral-400">Pilihan tema diambil dari tailwind.config.js (appThemes).</p>
          <div className="mt-4 grid gap-2">
            {appThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => changeTheme(theme.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                  selectedTheme === theme.id
                    ? 'border-[var(--accent)] bg-neutral-800 text-white'
                    : 'border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span className="font-medium">{theme.label}</span>
                <span className="ml-2 text-xs text-neutral-500">({theme.accent})</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-neutral-500">Tema aktif: {selectedTheme}</p>
        </article>
      </section>
    </div>
  );
}
