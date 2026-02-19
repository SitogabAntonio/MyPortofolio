import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../lib/api';
import type { Certificate, Experience, Gallery, ProfileInfo, Project, Skill } from '../lib/types';

gsap.registerPlugin(ScrollTrigger);

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="h-40 animate-pulse border-l-2 border-neutral-800 bg-neutral-900/60 pl-4"
      style={{ borderRadius: 12 }}
    />
  );
}

/* ─── Section Label ─────────────────────────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="h-px flex-1 bg-neutral-800" />
      <span
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.3em', fontSize: '0.75rem' }}
        className="text-neutral-500 uppercase"
      >
        {label}
      </span>
      <span className="h-px w-12 bg-red-700" />
    </div>
  );
}

/* ─── Tag ───────────────────────────────────────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="border border-neutral-700 px-2 py-0.5 text-[11px] uppercase tracking-widest text-neutral-400"
      style={{ borderRadius: 4 }}
    >
      {children}
    </span>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [slideIndex, setSlideIndex] = useState<Record<string, number>>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const projectCounterRef = useRef<HTMLSpanElement>(null);
  const expCounterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ─── Load ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, projectData, skillData, experienceData, galleryData, certificateData] =
          await Promise.all([
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

  /* ─── GSAP ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (loading || !containerRef.current) return;
    ScrollTrigger.getAll().forEach((t) => t.kill());

    gsap.fromTo(
      containerRef.current.querySelectorAll('.reveal-item'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' },
    );

    gsap.fromTo(
      containerRef.current.querySelectorAll('.project-card'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.14, duration: 0.85, ease: 'power2.out', delay: 0.25 },
    );

    gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 82%' },
        },
      );
    });
  }, [loading]);

  /* ─── Counters ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (loading) return;
    const maxYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;
    const animate = (el: HTMLSpanElement | null, val: number) => {
      if (!el) return;
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value: val,
        duration: 1.6,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => { el.textContent = String(proxy.value); },
      });
    };
    animate(projectCounterRef.current, projects.length);
    animate(expCounterRef.current, maxYears);
  }, [loading, projects.length, skills]);

  /* ─── Helpers ───────────────────────────────────────────────────────────── */
  const topProjects = useMemo(() => projects.slice(0, 4), [projects]);

  const getProjectImages = (project: Project) => {
    const imgs = (project.imageUrls ?? []).filter(Boolean);
    if (imgs.length) return imgs.slice(0, 3);
    if (project.imageUrl) return [project.imageUrl];
    return ['https://picsum.photos/seed/project/700/420'];
  };

  const slide = (id: string, total: number, dir: 1 | -1) =>
    setSlideIndex((prev) => {
      const cur = prev[id] ?? 0;
      return { ...prev, [id]: (cur + dir + total) % total };
    });

  const toggleExpand = (id: string) =>
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));

  const maxSkillYears = skills.length
    ? Math.max(...skills.map((s) => s.yearsOfExperience || 0))
    : 0;

  /* ─── Render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        :root {
          --accent: #b91c1c;
          --surface: #111111;
          --surface2: #181818;
          --border: #262626;
          --radius: 12px;
        }

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        .skill-bar {
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), #ef4444);
          border-radius: 2px;
          transition: width 1s ease;
        }

        .nav-dot {
          width: 6px; height: 6px;
          border-radius: 2px;
          background: #404040;
          transition: background 0.2s, width 0.3s;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .nav-dot.active {
          background: var(--accent);
          width: 18px;
        }

        .cert-card {
          border-left: 3px solid var(--accent);
          border-radius: var(--radius);
          transition: background 0.25s;
        }
        .cert-card:hover { background: #1c1c1c; }

        .exp-entry {
          position: relative;
          padding-left: 1.25rem;
          border-left: 1px solid var(--border);
          transition: border-color 0.3s;
        }
        .exp-entry:hover { border-color: var(--accent); }
        .exp-entry::before {
          content: '';
          position: absolute;
          left: -4px; top: 7px;
          width: 7px; height: 7px;
          background: var(--accent);
          border-radius: 1px;
        }

        .expand-btn {
          width: 24px; height: 24px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(0,0,0,0.6);
          color: #d4d4d4;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          font-family: monospace;
          font-weight: 400;
          backdrop-filter: blur(4px);
          flex-shrink: 0;
        }
        .expand-btn:hover {
          border-color: var(--accent);
          background: rgba(185,28,28,0.2);
          color: #fff;
        }
      `}</style>

      <div
        ref={containerRef}
        style={{ background: '#0c0c0c', color: '#e5e5e5', fontFamily: "'DM Mono', monospace" }}
      >
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-16 lg:px-24 pt-28 pb-24">
          {/* Background grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute top-0 right-0 w-1 h-40" style={{ background: 'var(--accent)' }} />
          <div className="absolute top-0 right-0 h-1 w-40" style={{ background: 'var(--accent)' }} />

          <div className="relative mx-auto w-full max-w-7xl grid lg:grid-cols-[1fr_340px] gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div
                className="reveal-item flex items-center gap-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.3em' }}
              >
                <span
                  className="px-3 py-1 border"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: '0.72rem', borderRadius: 4 }}
                >
                  PORTFOLIO
                </span>
                <span style={{ fontSize: '0.72rem', color: '#525252' }}>— 2026</span>
              </div>

              <h1
                className="reveal-item leading-none tracking-tight"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(3.4rem, 8vw, 6.5rem)',
                  color: '#f5f5f5',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>Hi,</span>
                <br />
                <span>saya</span>
                <br />
                <em>{profile?.name ?? 'Developer'}</em>
              </h1>

              <p
                className="reveal-item max-w-xl leading-relaxed"
                style={{ color: '#737373', fontSize: '1rem' }}
              >
                {profile?.tagline ?? 'Full-Stack Developer — crafting scalable digital solutions'}
              </p>

              <div className="reveal-item flex flex-wrap gap-4 pt-2">
                <a
                  href="#about"
                  className="px-8 py-3 font-semibold text-white transition-all"
                  style={{
                    background: 'var(--accent)',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '0.2em',
                    fontSize: '0.9rem',
                    borderRadius: 6,
                  }}
                >
                  Tentang Saya
                </a>
                <a
                  href="#projects"
                  className="px-8 py-3 font-semibold transition-all"
                  style={{
                    border: '1px solid #404040',
                    color: '#a3a3a3',
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '0.2em',
                    fontSize: '0.9rem',
                    borderRadius: 6,
                  }}
                >
                  Lihat Projects
                </a>
              </div>

              {/* Quick stats */}
              {!loading && (
                <div className="reveal-item flex gap-8 pt-4 border-t border-neutral-800">
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: '#f5f5f5', lineHeight: 1 }}>
                      <span ref={projectCounterRef}>0</span>
                    </p>
                    <p className="mt-1" style={{ color: '#525252', letterSpacing: '0.15em', fontSize: '0.72rem' }}>PROJECTS</p>
                  </div>
                  <div style={{ width: 1, background: '#262626' }} />
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: '#f5f5f5', lineHeight: 1 }}>
                      <span ref={expCounterRef}>0</span>
                      <span style={{ fontSize: '1rem', color: '#525252', marginLeft: 4 }}>YRS</span>
                    </p>
                    <p className="mt-1" style={{ color: '#525252', letterSpacing: '0.15em', fontSize: '0.72rem' }}>MAX SKILL EXP</p>
                  </div>
                  <div style={{ width: 1, background: '#262626' }} />
                  <div>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: '#f5f5f5', lineHeight: 1 }}>
                      {skills.length}
                    </p>
                    <p className="mt-1" style={{ color: '#525252', letterSpacing: '0.15em', fontSize: '0.72rem' }}>SKILLS</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Avatar */}
            <div className="reveal-item relative">
              <div
                className="relative overflow-hidden"
                style={{ border: '1px solid #262626', aspectRatio: '4/5', borderRadius: 'var(--radius)' }}
              >
                <span
                  className="absolute top-0 left-0 w-6 h-6 z-10 pointer-events-none"
                  style={{ borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)', borderRadius: '12px 0 0 0' }}
                />
                <span
                  className="absolute bottom-0 right-0 w-6 h-6 z-10 pointer-events-none"
                  style={{ borderBottom: '2px solid var(--accent)', borderRight: '2px solid var(--accent)', borderRadius: '0 0 12px 0' }}
                />
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center"
                    style={{ color: '#525252', background: '#111', minHeight: 340, letterSpacing: '0.2em', fontSize: '0.75rem' }}
                  >
                    NO IMAGE
                  </div>
                )}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(12,12,12,0.6) 100%)' }}
                />
              </div>
              <div
                className="absolute -z-10"
                style={{ bottom: -10, right: -10, width: '55%', height: '55%', border: '1px solid #1e1e1e', borderRadius: 'var(--radius)' }}
              />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-px animate-bounce" style={{ height: 36, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
        <section id="about" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
          <div className="mx-auto max-w-7xl">
            <SectionLabel label="Tentang Saya" />
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0" style={{ width: 3, background: 'var(--accent)', borderRadius: 2 }} />
              <h2
                className="mb-4"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.7rem)', color: '#f5f5f5' }}
              >
                {profile?.name}
              </h2>
              <p className="max-w-3xl leading-relaxed" style={{ color: '#737373', fontSize: '1rem' }}>
                {profile?.bio ?? 'Developer yang passionate di frontend & backend, suka membangun aplikasi yang scalable dan user-friendly.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-6" style={{ color: '#525252', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
                {profile?.email && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>✉</span>
                    {profile.email}
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--accent)' }}>◎</span>
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
        <section id="projects" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
          <div className="mx-auto max-w-7xl">
            <SectionLabel label="Projects" />
            <div className="grid gap-5 md:grid-cols-2">
              {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              {!loading && !topProjects.length && (
                <p style={{ color: '#525252', fontSize: '0.95rem' }}>
                  Belum ada project. Tambahkan dari admin panel.
                </p>
              )}
              {topProjects.map((project) => {
                const images = getProjectImages(project);
                const current = slideIndex[project.id] ?? 0;
                const isExpanded = expandedProjects[project.id] ?? false;
                return (
                  <article
                    key={project.id}
                    className="project-card group"
                    style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Image container */}
                    <div className="relative overflow-hidden" style={{ height: 175 }}>
                      <img
                        src={images[current]}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: 'grayscale(15%)' }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(12,12,12,0.88) 15%, transparent 70%)' }}
                      />

                      {/* Expand / Collapse — top right corner */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <button
                          type="button"
                          className="expand-btn"
                          onClick={() => toggleExpand(project.id)}
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      </div>

                      {/* Slide controls */}
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => slide(project.id, images.length, -1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white px-2 py-0.5"
                            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid #404040', borderRadius: 6, fontSize: '1.1rem' }}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => slide(project.id, images.length, 1)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 z-10 text-white px-2 py-0.5"
                            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid #404040', borderRadius: 6, fontSize: '1.1rem' }}
                          >
                            ›
                          </button>
                          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSlideIndex((prev) => ({ ...prev, [project.id]: idx }))}
                                className={`nav-dot ${idx === current ? 'active' : ''}`}
                                aria-label={`Slide ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#f5f5f5' }}>
                        {project.title}
                      </h3>
                      <p
                        className={isExpanded ? '' : 'line-clamp-2'}
                        style={{ color: '#737373', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.65, transition: 'all 0.3s' }}
                      >
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SKILLS & EXPERIENCE ───────────────────────────────────────────── */}
        <section id="skills" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
          <div className="mx-auto max-w-7xl">
            <SectionLabel label="Skills & Experience" />
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Skills */}
              <div
                className="reveal-item p-5"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              >
                <h3
                  className="mb-5"
                  style={{ color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.3em', fontSize: '0.75rem' }}
                >
                  Technical Skills
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-8 animate-pulse rounded" style={{ background: '#1a1a1a' }} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {skills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span style={{ color: '#e5e5e5', fontSize: '0.9rem' }}>{skill.name}</span>
                            <Tag>{skill.category}</Tag>
                          </div>
                          <span style={{ color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                            {skill.yearsOfExperience} YRS
                          </span>
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-bar-fill"
                            style={{
                              width: maxSkillYears ? `${((skill.yearsOfExperience || 0) / maxSkillYears) * 100}%` : '0%',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {!skills.length && (
                      <p style={{ color: '#525252', fontSize: '0.88rem' }}>Belum ada data skill.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div
                className="reveal-item p-5"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              >
                <h3
                  className="mb-5"
                  style={{ color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.3em', fontSize: '0.75rem' }}
                >
                  Work Experience
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 animate-pulse rounded" style={{ background: '#1a1a1a' }} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {experiences.slice(0, 5).map((exp) => (
                      <div key={exp.id} className="exp-entry pb-3">
                        <p style={{ color: '#f5f5f5', fontSize: '0.92rem', fontWeight: 500 }}>{exp.position}</p>
                        <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: 2 }}>
                          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                        </p>
                        <p style={{ color: '#525252', fontSize: '0.76rem', marginTop: 3 }}>
                          {new Date(exp.startDate).toLocaleDateString('id-ID')} —{' '}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('id-ID') : 'Sekarang'}
                        </p>
                        {exp.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech) => (
                              <Tag key={`${exp.id}-${tech}`}>{tech}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {!experiences.length && (
                      <p style={{ color: '#525252', fontSize: '0.88rem' }}>Belum ada data experience.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ───────────────────────────────────────────────────────── */}
        <section id="gallery" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
          <div className="mx-auto max-w-7xl">
            <SectionLabel label="Gallery" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
              {!loading && !galleries.length && (
                <p style={{ color: '#525252', fontSize: '0.88rem' }}>Belum ada data gallery.</p>
              )}
              {galleries.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}
                >
                  <div className="overflow-hidden" style={{ height: 165, borderRadius: '12px 12px 0 0' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'grayscale(20%)' }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", color: '#f5f5f5', fontSize: '1rem' }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 leading-relaxed" style={{ color: '#737373', fontSize: '0.82rem' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CERTIFICATES ──────────────────────────────────────────────────── */}
        <section id="certificates" className="px-6 md:px-16 lg:px-24 pb-24 animate-section">
          <div className="mx-auto max-w-7xl">
            <SectionLabel label="Certificates" />
            <div className="grid gap-4 md:grid-cols-2">
              {loading && Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              {!loading && !certificates.length && (
                <p style={{ color: '#525252', fontSize: '0.88rem' }}>Belum ada data certificate.</p>
              )}
              {certificates.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="cert-card p-4 flex items-start gap-4"
                  style={{ background: 'var(--surface2)' }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="flex-shrink-0 object-cover"
                      style={{ width: 62, height: 48, filter: 'grayscale(30%)', border: '1px solid var(--border)', borderRadius: 8 }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", color: '#f5f5f5', fontSize: '1rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: 3 }}>{item.issuer}</p>
                    <p style={{ color: '#525252', fontSize: '0.74rem', marginTop: 2 }}>
                      {new Date(item.issueDate).toLocaleDateString('id-ID')}
                    </p>
                    {item.description && (
                      <p className="mt-2 leading-relaxed" style={{ color: '#737373', fontSize: '0.82rem' }}>
                        {item.description}
                      </p>
                    )}
                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-3 transition-colors"
                        style={{ color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.15em', fontSize: '0.72rem' }}
                      >
                        LIHAT CREDENTIAL ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}