import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { api } from '../lib/api';
import type { Experience, ProfileInfo, Project, Skill } from '../lib/types';

function SkeletonCard() {
  return <div className="h-52 animate-pulse rounded-xl border border-neutral-800 bg-[var(--surface)]/70" />;
}

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [slideIndex, setSlideIndex] = useState<Record<string, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, projectData, skillData, experienceData] = await Promise.all([
          api.getProfile(),
          api.getProjects(),
          api.getSkills(),
          api.getExperiences(),
        ]);
        setProfile(profileData);
        setProjects(projectData);
        setSkills(skillData);
        setExperiences(experienceData);
      } catch {
        setProfile(null);
        setProjects([]);
        setSkills([]);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (loading || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current.querySelectorAll('.reveal-item'),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.75, ease: 'power3.out' },
    );

    gsap.fromTo(
      containerRef.current.querySelectorAll('.project-card'),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out', delay: 0.2 },
    );
  }, [loading]);

  const topProjects = useMemo(() => projects.slice(0, 4), [projects]);

  const getProjectImages = (project: Project) => {
    const images = (project.imageUrls ?? []).filter(Boolean);
    if (images.length) return images.slice(0, 3);
    if (project.imageUrl) return [project.imageUrl];
    return ['https://picsum.photos/seed/project/700/420'];
  };

  const slide = (projectId: string, total: number, direction: 1 | -1) => {
    setSlideIndex((prev) => {
      const current = prev[projectId] ?? 0;
      return { ...prev, [projectId]: (current + direction + total) % total };
    });
  };

  return (
    <div ref={containerRef} className="text-neutral-100">
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-36 md:px-12 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="reveal-item text-xs uppercase tracking-[0.24em] text-neutral-500">Portfolio — 2026</div>
            <h1 className="reveal-item text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {profile?.name ? `Halo, saya ${profile.name}` : 'Halo, saya Developer'}
            </h1>
            <p className="reveal-item max-w-2xl text-lg text-neutral-300">
              {profile?.tagline ?? 'Full-Stack Developer'}
            </p>
            <div className="reveal-item flex flex-wrap gap-3">
              <a href="#about" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950">
                Tentang Saya
              </a>
              <a href="#projects" className="rounded-xl border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300">
                Lihat Projects
              </a>
            </div>
          </div>

          <div className="reveal-item rounded-2xl border border-neutral-800 bg-[var(--surface)]/70 p-4">
            <div className="h-[360px] overflow-hidden rounded-xl border border-neutral-800 bg-[var(--surface)]/80">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">No avatar</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-neutral-800 bg-[var(--surface)]/60 p-6 md:p-8 reveal-item">
          <h2 className="text-3xl font-semibold text-white">Tentang Saya</h2>
          <p className="mt-4 max-w-3xl text-neutral-300">
            {profile?.bio ??
              'Saya adalah developer yang passionate di frontend & backend, suka membangun aplikasi yang scalable dan user-friendly.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-neutral-400">
            <span>Email: {profile?.email || '-'}</span>
            <span>Lokasi: {profile?.location || '-'}</span>
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-5">
          <h2 className="reveal-item text-2xl font-semibold text-white">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !topProjects.length && (
              <div className="reveal-item rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-5 text-sm text-neutral-500">
                Belum ada project. Tambahkan dari admin panel.
              </div>
            )}
            {topProjects.map((project) => {
              const images = getProjectImages(project);
              const current = slideIndex[project.id] ?? 0;
              return (
                <article key={project.id} className="project-card rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-5">
                  <div className="relative overflow-hidden rounded-lg border border-neutral-800">
                    <img src={images[current]} alt={project.title} className="h-52 w-full object-cover" />
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, -1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/40 px-2 py-1 text-xs text-white"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/40 px-2 py-1 text-xs text-white"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-neutral-300">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <article className="reveal-item rounded-2xl border border-neutral-800 bg-[var(--surface)]/60 p-5">
            <h3 className="mb-3 text-xl font-semibold text-white">Skills</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 animate-pulse rounded bg-neutral-800" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between rounded-lg border border-neutral-800 p-2 text-sm">
                    <span>{skill.name}</span>
                    <span className="text-neutral-400">{skill.yearsOfExperience} thn</span>
                  </div>
                ))}
                {!skills.length && <p className="text-sm text-neutral-500">Belum ada data skill.</p>}
              </div>
            )}
          </article>

          <article className="reveal-item rounded-2xl border border-neutral-800 bg-[var(--surface)]/60 p-5">
            <h3 className="mb-3 text-xl font-semibold text-white">Experiences</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-neutral-800" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {experiences.slice(0, 5).map((exp) => (
                  <div key={exp.id} className="rounded-lg border border-neutral-800 p-3">
                    <p className="font-medium text-white">{exp.position}</p>
                    <p className="text-xs text-neutral-400">{exp.company} • {exp.location}</p>
                  </div>
                ))}
                {!experiences.length && <p className="text-sm text-neutral-500">Belum ada data experience.</p>}
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
