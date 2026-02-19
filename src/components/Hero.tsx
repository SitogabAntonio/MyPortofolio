import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../lib/api';
import type { Certificate, Experience, Gallery, ProfileInfo, Project, Skill } from '../lib/types';

gsap.registerPlugin(ScrollTrigger);

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="h-40 animate-pulse border-l-2 border-neutral-800 bg-neutral-900/60 rounded-xl pl-4" />
  );
}

/* ─── Section Label ─────────────────────────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="h-px flex-1 bg-neutral-800" />
      <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-['Bebas_Neue']">
        {label}
      </span>
      <span className="h-px w-12 bg-blue-700" />
    </div>
  );
}

/* ─── Tag ───────────────────────────────────────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-neutral-700 px-2 py-0.5 text-[11px] uppercase tracking-widest text-neutral-400 rounded-[4px]">
      {children}
    </span>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
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

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
    const end = endDate
      ? new Date(endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
      : 'Sekarang';
    return `${start} - ${end}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, projectData, skillData, experienceData, galleryData, certificateData] =
          await Promise.all([
            api.getProfile(), api.getProjects(), api.getSkills(),
            api.getExperiences(), api.getGalleries(), api.getCertificates(),
          ]);
        setProfile(profileData); setProjects(projectData); setSkills(skillData);
        setExperiences(experienceData); setGalleries(galleryData); setCertificates(certificateData);
      } catch {
        setProfile(null); setProjects([]); setSkills([]);
        setExperiences([]); setGalleries([]); setCertificates([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

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
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.85, ease: 'power2.out', delay: 0.2 },
    );
    gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
      gsap.fromTo(section, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 82%' },
      });
    });
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const maxYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;
    const animate = (el: HTMLSpanElement | null, val: number) => {
      if (!el) return;
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value: val, duration: 1.6, ease: 'power2.out', snap: { value: 1 },
        onUpdate: () => { el.textContent = String(proxy.value); },
      });
    };
    animate(projectCounterRef.current, projects.length);
    animate(expCounterRef.current, maxYears);
  }, [loading, projects.length, skills]);

  /* show ALL projects, no slice */
  const allProjects = useMemo(() => projects, [projects]);

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

  /* group skills by category */
  const skillsByCategory = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    skills.forEach((s) => {
      const cat = s.category || 'Other';
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  }, [skills]);

  return (
    <div
      ref={containerRef}
      className="bg-[#0c0c0c] text-neutral-200 font-['DM_Mono',monospace]"
    >

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-16 lg:px-24 pt-28 pb-24 animate-section">
        {/* Grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-0 right-0 w-0.5 h-40 bg-blue-700" />
        <div className="absolute top-0 right-0 h-0.5 w-40 bg-blue-700" />

        <div className="relative mx-auto w-full max-w-7xl grid lg:grid-cols-[1fr_300px] gap-14 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="reveal-item flex items-center gap-3">
              <span className="px-3 py-1 border border-blue-700 text-blue-700 text-[11px] tracking-[0.3em] font-['Bebas_Neue'] rounded-[4px]">
                PORTFOLIO
              </span>
              <span className="text-[11px] text-neutral-600">— 2026</span>
            </div>

            {/* ① Title perkecil: clamp max dari 6.5rem → 4rem */}
            <h1 className="reveal-item leading-[1.05] tracking-tight font-['DM_Serif_Display',serif] text-[clamp(2.4rem,5vw,4rem)] text-neutral-100">
              <span className="text-blue-700">Hi,</span>{' '}
              <span>saya</span>{' '}
              <em>{profile?.name ?? 'Developer'}</em>
            </h1>

            <p className="reveal-item max-w-xl leading-relaxed text-[15px] text-neutral-500">
              {profile?.tagline ?? 'Full-Stack Developer — crafting scalable digital solutions'}
            </p>

            <div className="reveal-item flex flex-wrap gap-4">
              <a
                href="#about"
                className="px-7 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-['Bebas_Neue'] text-[0.85rem] tracking-[0.2em] rounded-[6px] transition-all hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(59,130,246,0.3)]"
              >
                Tentang Saya
              </a>
              <a
                href="#projects"
                className="px-7 py-2.5 border border-neutral-700 hover:border-blue-700 text-neutral-400 hover:text-neutral-200 font-['Bebas_Neue'] text-[0.85rem] tracking-[0.2em] rounded-[6px] transition-all"
              >
                Lihat Projects
              </a>
            </div>

            {/* Stats */}
            {!loading && (
              <div className="reveal-item flex gap-6 pt-4 border-t border-neutral-800">
                <div>
                  <p className="font-['Bebas_Neue'] text-[1.9rem] text-neutral-100 leading-none">
                    <span ref={projectCounterRef}>0</span>
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-600 tracking-[0.15em]">PROJECTS</p>
                </div>
                <div className="w-px bg-neutral-800" />
                <div>
                  <p className="font-['Bebas_Neue'] text-[1.9rem] text-neutral-100 leading-none">
                    <span ref={expCounterRef}>0</span>
                    <span className="text-sm text-neutral-600 ml-1">YRS</span>
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-600 tracking-[0.15em]">MAX SKILL EXP</p>
                </div>
                <div className="w-px bg-neutral-800" />
                <div>
                  <p className="font-['Bebas_Neue'] text-[1.9rem] text-neutral-100 leading-none">
                    {skills.length}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral-600 tracking-[0.15em]">SKILLS</p>
                </div>
              </div>
            )}
          </div>

          {/* Right — Avatar */}
          <div className="reveal-item relative">
            <div className="relative overflow-hidden border border-neutral-800 rounded-xl aspect-[4/5]">
              <span className="absolute top-0 left-0 w-6 h-6 z-10 pointer-events-none border-t-2 border-l-2 border-blue-700 rounded-tl-xl" />
              <span className="absolute bottom-0 right-0 w-6 h-6 z-10 pointer-events-none border-b-2 border-r-2 border-blue-700 rounded-br-xl" />
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-neutral-900 text-neutral-600 text-xs tracking-[0.2em]">
                  NO IMAGE
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0c0c0c]/60" />
            </div>
            <div className="absolute -z-10 bottom-[-10px] right-[-10px] w-[55%] h-[55%] border border-neutral-900 rounded-xl" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-9 animate-bounce bg-gradient-to-b from-blue-700 to-transparent" />
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
        <div className="mx-auto max-w-7xl">
          <SectionLabel label="Tentang Saya" />
          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-700 rounded-full" />
            <h2 className="mb-4 font-['DM_Serif_Display',serif] text-[clamp(1.6rem,3vw,2.4rem)] text-neutral-100 font-normal">
              {profile?.name}
            </h2>
            <p className="max-w-3xl leading-relaxed text-[15px] text-neutral-500">
              {profile?.bio ?? 'Developer yang passionate di frontend & backend, suka membangun aplikasi yang scalable dan user-friendly.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-[13px] text-neutral-600 tracking-[0.1em]">
              {profile?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-700">✉</span>
                  {profile.email}
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-700">◎</span>
                  {profile.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS — show ALL ────────────────────────────────────────────── */}
      <section id="projects" className="px-6 md:px-16 lg:px-24 py-20 animate-section">
        <div className="mx-auto max-w-7xl">
          <SectionLabel label="Projects" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !allProjects.length && (
              <p className="text-[15px] text-neutral-600">Belum ada project. Tambahkan dari admin panel.</p>
            )}
            {allProjects.map((project) => {
              const images = getProjectImages(project);
              const current = slideIndex[project.id] ?? 0;
              const isExpanded = expandedProjects[project.id] ?? false;
              return (
                <article
                  key={project.id}
                  className="project-card group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-[170px]">
                    <img
                      src={images[current]}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0c0c0c]/90 via-transparent to-transparent" />

                    {/* Expand / collapse */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        type="button"
                        onClick={() => toggleExpand(project.id)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                        className="w-6 h-6 flex items-center justify-center rounded-md border border-white/20 bg-black/60 text-neutral-300 hover:border-blue-700 hover:bg-blue-700/20 hover:text-white transition-all text-base font-mono backdrop-blur-sm leading-none"
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 px-2 py-0.5 bg-black/55 border border-neutral-700 rounded-md text-white text-lg hover:border-blue-700 transition-colors"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, 1)}
                          className="absolute right-10 top-1/2 -translate-y-1/2 z-10 px-2 py-0.5 bg-black/55 border border-neutral-700 rounded-md text-white text-lg hover:border-blue-700 transition-colors"
                        >
                          ›
                        </button>
                        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSlideIndex((prev) => ({ ...prev, [project.id]: idx }))}
                              aria-label={`Slide ${idx + 1}`}
                              className={`h-1.5 rounded-sm border-0 cursor-pointer p-0 transition-all duration-300 ${
                                idx === current ? 'w-[18px] bg-blue-700' : 'w-1.5 bg-neutral-600'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-['DM_Serif_Display',serif] text-[1.1rem] text-neutral-100 font-normal">
                      {project.title}
                    </h3>
                    <p className={`text-[13px] text-neutral-500 mt-1.5 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
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

            {/* ③ Skills — grouped by category, more breathing room */}
            <div className="reveal-item p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
              <h3 className="mb-6 font-['Bebas_Neue'] text-[11px] tracking-[0.3em] text-blue-700 uppercase">
                Technical Skills
              </h3>
              {loading ? (
                <div className="space-y-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-neutral-800" />
                  ))}
                </div>
              ) : skills.length === 0 ? (
                <p className="text-[13px] text-neutral-600">Belum ada data skill.</p>
              ) : (
                <div className="space-y-8">
                  {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                    <div key={category}>
                      {/* Category header */}
                      <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-600 mb-4 pb-2 border-b border-neutral-800">
                        {category}
                      </p>
                      <div className="space-y-5">
                        {catSkills.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[13.5px] text-neutral-200">{skill.name}</span>
                              <span className="font-['Bebas_Neue'] text-[12px] tracking-[0.1em] text-blue-700 tabular-nums">
                                {skill.yearsOfExperience} YRS
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="h-[3px] bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full transition-all duration-1000"
                                style={{
                                  width: maxSkillYears
                                    ? `${((skill.yearsOfExperience || 0) / maxSkillYears) * 100}%`
                                    : '0%',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="reveal-item p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
              <h3 className="mb-6 font-['Bebas_Neue'] text-[11px] tracking-[0.3em] text-blue-700 uppercase">
                Work Experience
              </h3>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded bg-neutral-800" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {experiences.slice(0, 8).map((exp) => (
                    <div
                      key={exp.id}
                      className="relative pl-5 pb-3 border-l border-neutral-800 hover:border-blue-700 transition-colors
                                 before:content-[''] before:absolute before:left-[-4px] before:top-[7px]
                                 before:w-[7px] before:h-[7px] before:bg-blue-700 before:rounded-[1px]"
                    >
                      <p className="text-[14px] text-neutral-100 font-medium">{exp.position}</p>
                      <p className="text-[12.5px] text-blue-700 mt-0.5">
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      <p className="text-[11.5px] text-neutral-600 mt-0.5">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </p>
                      {exp.technologies.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <Tag key={`${exp.id}-${tech}`}>{tech}</Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {!experiences.length && (
                    <p className="text-[13px] text-neutral-600">Belum ada data experience.</p>
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
              <p className="text-[13px] text-neutral-600">Belum ada data gallery.</p>
            )}
            {galleries.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden border border-neutral-800 bg-neutral-900 rounded-xl"
              >
                <div className="overflow-hidden h-[165px] rounded-t-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-['DM_Serif_Display',serif] text-base text-neutral-100 font-normal">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 leading-relaxed text-[13px] text-neutral-500">{item.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATES — card style: image on top, detail below ────────── */}
      <section id="certificates" className="px-6 md:px-16 lg:px-24 pb-24 animate-section">
        <div className="mx-auto max-w-7xl">
          <SectionLabel label="Certificates" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !certificates.length && (
              <p className="text-[13px] text-neutral-600">Belum ada data certificate.</p>
            )}
            {certificates.slice(0, 9).map((item) => (
              <article
                key={item.id}
                className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-blue-700/50 transition-colors"
              >
                {/* ④ Image on top */}
                <div className="overflow-hidden h-[160px] rounded-t-xl bg-neutral-800">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      {/* Placeholder icon */}
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        <path d="M9 12l-2 8 5-3 5 3-2-8"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Detail below */}
                <div className="p-4">
                  <h3 className="font-['DM_Serif_Display',serif] text-[1rem] text-neutral-100 leading-snug font-normal">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-blue-700 mt-1">{item.issuer}</p>
                  <p className="text-[11.5px] text-neutral-600 mt-0.5">
                    {new Date(item.issueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  </p>
                  {item.description && (
                    <p className="mt-2 leading-relaxed text-[12.5px] text-neutral-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-3 font-['Bebas_Neue'] text-[11px] tracking-[0.15em] text-blue-700 hover:text-blue-500 transition-colors"
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
  );
}