import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../lib/api';
import type { Certificate, Experience, Gallery, ProfileInfo, Project, Skill } from '../lib/types';

gsap.registerPlugin(ScrollTrigger);

function SkeletonCard() {
  return <div className="h-52 animate-pulse rounded-xl border border-neutral-800 bg-[var(--surface)]/70" />;
}

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [slideIndex, setSlideIndex] = useState<Record<string, number>>({});
  const projectCounterRef = useRef<HTMLSpanElement>(null);
  const expCounterRef = useRef<HTMLSpanElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, projectData, skillData, experienceData, galleryData, certificateData] = await Promise.all([
          api.getProfile(),
          api.getProjects(),
          api.getSkills(),
          api.getExperiences(),
          api.getGalleries(),
          api.getCertificates(),
        ]);
        setProfile(profileData);
        setProjects(projectData);
        setSkills(skillData);
        setExperiences(experienceData);
        setGalleries(galleryData);
        setCertificates(certificateData);
      } catch {
        setProfile(null);
        setProjects([]);
        setSkills([]);
        setExperiences([]);
        setGalleries([]);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (loading || !containerRef.current) return;

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

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

    gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
      gsap.fromTo(
        section,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        },
      );
    });
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const maxYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;

    const animateCounter = (target: HTMLSpanElement | null, value: number) => {
      if (!target) return;
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value,
        duration: 1.4,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
          target.textContent = String(proxy.value);
        },
      });
    };

    animateCounter(projectCounterRef.current, projects.length);
    animateCounter(expCounterRef.current, maxYears);
  }, [loading, projects.length, skills]);

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

  const maxSkillYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;

  return (
    <div ref={containerRef} className="text-neutral-100">
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-36 md:px-12 lg:px-16 animate-section">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="reveal-item text-xs uppercase tracking-[0.24em] text-neutral-500">Portfolio — 2026</div>
            <h1 className="reveal-item text-5xl font-bold tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
              {profile?.name ? `Hi, saya ${profile.name}` : 'Halo, saya Developer'}
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

      <section id="about" className="px-6 pb-10 md:px-12 lg:px-16 animate-section">
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

      <section className="px-6 pb-24 md:px-12 lg:px-16 animate-section">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-neutral-800 bg-[var(--surface)]/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Total Projects</p>
            <p className="mt-3 text-4xl font-bold text-white">
              <span ref={projectCounterRef}>0</span>
            </p>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-[var(--surface)]/60 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Pengalaman Terlama (Skill)</p>
            <p className="mt-3 text-4xl font-bold text-white">
              <span ref={expCounterRef}>0</span>
              <span className="ml-2 text-base font-medium text-neutral-400">tahun</span>
            </p>
            <p className="mt-2 text-xs text-neutral-500">Skill dengan pengalaman tertinggi: {maxSkillYears} tahun</p>
          </article>
        </div>
      </section>

      <section id="projects" className="px-6 pb-24 md:px-12 lg:px-16 animate-section">
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/40 px-2.5 py-1 text-sm text-white"
                        >
                          &lt;
                        </button>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-black/40 px-2.5 py-1 text-sm text-white"
                        >
                          &gt;
                        </button>
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSlideIndex((prev) => ({ ...prev, [project.id]: idx }))}
                              className={`h-1.5 w-1.5 rounded-full ${idx === current ? 'bg-white' : 'bg-white/40'}`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
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

      <section id="skills" className="px-6 pb-24 md:px-12 lg:px-16 animate-section">
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
                  <div key={skill.id} className="rounded-lg border border-neutral-800 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{skill.name}</span>
                      <span className="text-neutral-400">{skill.yearsOfExperience} thn</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-400">
                      <span className="rounded-full bg-neutral-800 px-2 py-1 capitalize">{skill.category}</span>
                      <span className="rounded-full bg-neutral-800 px-2 py-1">Dibuat: {new Date(skill.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
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
                    <p className="mt-1 text-xs text-neutral-500">
                      {new Date(exp.startDate).toLocaleDateString('id-ID')} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('id-ID') : 'Sekarang'}
                    </p>
                    {!!exp.technologies.length && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span key={`${exp.id}-${tech}`} className="rounded-full bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!experiences.length && <p className="text-sm text-neutral-500">Belum ada data experience.</p>}
              </div>
            )}
          </article>
        </div>
      </section>

      <section id="gallery" className="px-6 pb-24 md:px-12 lg:px-16 animate-section">
        <div className="mx-auto max-w-7xl space-y-5">
          <h2 className="reveal-item text-2xl font-semibold text-white">Gallery</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !galleries.length && (
              <div className="reveal-item rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-5 text-sm text-neutral-500">
                Belum ada data gallery.
              </div>
            )}
            {galleries.slice(0, 6).map((item) => (
              <article key={item.id} className="rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-4">
                <img src={item.imageUrl} alt={item.title} className="h-44 w-full rounded-lg border border-neutral-800 object-cover" />
                <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
                {item.description && <p className="mt-1 text-sm text-neutral-300">{item.description}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="px-6 pb-24 md:px-12 lg:px-16 animate-section">
        <div className="mx-auto max-w-7xl space-y-5">
          <h2 className="reveal-item text-2xl font-semibold text-white">Certificates</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {loading && Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !certificates.length && (
              <div className="reveal-item rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-5 text-sm text-neutral-500">
                Belum ada data certificate.
              </div>
            )}
            {certificates.slice(0, 6).map((item) => (
              <article key={item.id} className="rounded-xl border border-neutral-800 bg-[var(--surface)]/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-neutral-400">{item.issuer}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {new Date(item.issueDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="h-16 w-24 rounded-lg border border-neutral-800 object-cover" />
                  )}
                </div>
                {item.description && <p className="mt-3 text-sm text-neutral-300">{item.description}</p>}
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-indigo-300 hover:text-indigo-200">
                    Lihat Credential
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
