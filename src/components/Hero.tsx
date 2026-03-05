import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { api } from '../lib/api';
import type { Certificate, Experience, Gallery, ProfileInfo, Project, Skill } from '../lib/types';

gsap.registerPlugin(ScrollTrigger);

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-white/10" />
      <span className="font-['Space_Grotesk',sans-serif] text-[11px] uppercase tracking-[0.35em] text-cyan-300/85">
        {label}
      </span>
      <span className="h-px w-14 bg-cyan-400/70" />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300">
      {children}
    </span>
  );
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-700/35 ${className}`} />;
}

function formatMonthYear(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
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
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const projectCounterRef = useRef<HTMLSpanElement>(null);
  const expCounterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const publicGithubUrl = 'https://github.com/SitogabAntonio';
  const publicLinkedinUrl = 'https://www.linkedin.com/in/sitogab-antonio/';

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

  useEffect(() => {
    if (loading || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
      );

      gsap.utils.toArray<HTMLElement>('.section-block').forEach((section) => {
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
              start: 'top 84%',
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const maxYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;

    const animateCounter = (el: HTMLSpanElement | null, value: number) => {
      if (!el) return;
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value,
        duration: 1.4,
        ease: 'power2.out',
        snap: { value: 1 },
        onUpdate: () => {
          el.textContent = String(proxy.value);
        },
      });
    };

    animateCounter(projectCounterRef.current, projects.length);
    animateCounter(expCounterRef.current, maxYears);
  }, [loading, projects.length, skills]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)),
    [projects],
  );

  const maxSkillYears = skills.length ? Math.max(...skills.map((s) => s.yearsOfExperience || 0)) : 0;

  const skillsByCategory = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      const category = skill.category || 'other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill);
    });
    return groups;
  }, [skills]);

  const topSkills = useMemo(
    () =>
      [...skills]
        .filter((skill) => skill.category === 'frontend' || skill.category === 'backend')
        .sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0))
        .slice(0, 6),
    [skills],
  );

  const getProjectImages = (project: Project) => {
    const imageList = (project.imageUrls ?? []).filter(Boolean);
    if (imageList.length > 0) return imageList.slice(0, 4);
    if (project.imageUrl) return [project.imageUrl];
    return ['https://picsum.photos/seed/project-fallback/960/540'];
  };

  const slide = (id: string, total: number, direction: 1 | -1) => {
    setSlideIndex((prev) => {
      const current = prev[id] ?? 0;
      return { ...prev, [id]: (current + direction + total) % total };
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div ref={containerRef} className="public-page relative overflow-hidden bg-[#07131d] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-[-120px] h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute right-[-140px] top-[35%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/15 blur-[150px]" />
        <div className="absolute bottom-[-80px] left-[35%] h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />
      </div>

      <section className="section-block relative px-6 pb-16 pt-32 md:px-16 lg:px-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="reveal inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-cyan-100">
              Portfolio 2026
            </p>
            <h1 className="reveal mt-6 font-['Fraunces',serif] text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] text-slate-50">
              Halo, saya Sitogab Antonio.
            </h1>
            <p className="reveal mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-300/90">
              {profile?.tagline ?? 'Full-stack developer focused on practical performance and strong product details.'}
            </p>

            <div className="reveal mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-cyan-400 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-cyan-300"
              >
                Explore Work
              </a>
              <a
                href="#about"
                className="rounded-full border border-white/25 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                About Me
              </a>
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-slate-100 transition hover:border-white/35 hover:bg-white/10"
                >
                  Resume
                </a>
              )}
            </div>

            {!loading && (
              <div className="reveal mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/12 bg-slate-900/45 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Projects</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    <span ref={projectCounterRef}>0</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-slate-900/45 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Max Skill Exp</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    <span ref={expCounterRef}>0</span>
                    <span className="ml-1 text-base text-slate-400">yrs</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-slate-900/45 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Skills</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{skills.length}</p>
                </div>
              </div>
            )}
          </div>

          <div className="reveal space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900/50 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/60">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="h-[360px] w-full object-cover" />
                ) : (
                  <div className="flex h-[360px] items-center justify-center text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    No Avatar
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/90">{profile?.name ?? 'Portfolio Owner'}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {profile?.location || 'Remote'}
                  {profile?.email ? ` • ${profile.email}` : ''}
                </p>
              </div>
            </div>

            {topSkills.length > 0 && (
              <div className="rounded-2xl border border-white/12 bg-slate-900/45 p-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/80">Core Stack (FE and BE)</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300"
                    >
                      {skill.icon && (
                        <img
                          src={skill.icon}
                          alt={`${skill.name} icon`}
                          className="h-3.5 w-3.5 rounded-sm object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="section-block px-6 py-14 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow label="About" />
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
            <article className="rounded-3xl border border-white/12 bg-slate-900/50 p-7 backdrop-blur-sm">
              <h2 className="font-['Fraunces',serif] text-3xl text-slate-50">{profile?.name ?? 'Developer'}</h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-300/90">
                {profile?.bio ?? 'I build maintainable web experiences with clear architecture, reliable backend flows, and measurable impact.'}
              </p>
            </article>
            <article className="rounded-3xl border border-white/12 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-7">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/80">Connect</p>
              <div className="mt-4 space-y-2 text-sm text-slate-200">
                {profile?.email && <p>{profile.email}</p>}
                {profile?.location && <p>{profile.location}</p>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-slate-100 hover:border-cyan-300"
                  href={publicGithubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
                <a
                  className="rounded-full border border-white/20 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-slate-100 hover:border-cyan-300"
                  href={publicLinkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Linkedin
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="projects" className="section-block px-6 py-14 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow label="Selected Projects" />
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[310px]" />
              ))}
            </div>
          )}

          {!loading && !sortedProjects.length && (
            <p className="rounded-2xl border border-white/12 bg-slate-900/40 p-5 text-sm text-slate-300">
              Belum ada project. Tambahkan dari admin panel.
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedProjects.map((project) => {
              const images = getProjectImages(project);
              const currentImage = slideIndex[project.id] ?? 0;
              const isExpanded = expandedProjects[project.id] ?? false;

              return (
                <article key={project.id} className="group overflow-hidden rounded-3xl border border-white/12 bg-slate-900/50 backdrop-blur-sm transition hover:border-cyan-300/45">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={images[currentImage]}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                      {project.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpand(project.id)}
                      className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/45 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-100 hover:border-cyan-300"
                    >
                      {isExpanded ? 'less' : 'more'}
                    </button>
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, -1)}
                          className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 text-lg text-white"
                        >
                          {'<'}
                        </button>
                        <button
                          type="button"
                          onClick={() => slide(project.id, images.length, 1)}
                          className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 text-lg text-white"
                        >
                          {'>'}
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Fraunces',serif] text-xl text-slate-50">{project.title}</h3>
                    <p className={`mt-3 text-sm leading-relaxed text-slate-300/90 ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Tag key={`${project.id}-${tag}`}>{tag}</Tag>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.18em]">
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-cyan-100">
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="section-block px-6 py-14 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow label="Skills And Experience" />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/12 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/85">Skill Groups</h3>
              {loading && (
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-10" />
                  ))}
                </div>
              )}
              {!loading && skills.length === 0 && <p className="mt-4 text-sm text-slate-400">Belum ada data skill.</p>}
              {!loading && skills.length > 0 && (
                <div className="mt-5 space-y-7">
                  {Object.entries(skillsByCategory).map(([category, group]) => (
                    <div key={category}>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{category}</p>
                      <div className="mt-3 space-y-4">
                        {group.map((skill) => {
                          const width = maxSkillYears
                            ? `${((skill.yearsOfExperience || 0) / maxSkillYears) * 100}%`
                            : '0%';
                          return (
                            <div key={skill.id}>
                              <div className="mb-2 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  {skill.icon && (
                                    <img
                                      src={skill.icon}
                                      alt={`${skill.name} icon`}
                                      className="h-4 w-4 rounded-sm object-contain"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                      onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <p className="text-sm text-slate-100">{skill.name}</p>
                                </div>
                                <p className="whitespace-nowrap text-xs uppercase tracking-[0.14em] text-cyan-200">
                                  {skill.yearsOfExperience} yrs
                                </p>
                              </div>
                              <div className="h-2 rounded-full bg-slate-700/60">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400"
                                  style={{ width }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="rounded-3xl border border-white/12 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/85">Experience Timeline</h3>
              {loading && (
                <div className="mt-5 space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-[76px]" />
                  ))}
                </div>
              )}
              {!loading && experiences.length === 0 && (
                <p className="mt-4 text-sm text-slate-400">Belum ada data experience.</p>
              )}
              {!loading && experiences.length > 0 && (
                <div className="mt-5 space-y-5">
                  {experiences.slice(0, 8).map((exp) => (
                    <div key={exp.id} className="relative rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <div className="absolute left-4 top-0 h-full w-px bg-white/10" />
                      <div className="relative pl-5">
                        <span className="absolute left-[-1px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <p className="text-sm font-medium text-slate-100">{exp.position}</p>
                        <p className="mt-0.5 text-[13px] text-cyan-200/90">
                          {exp.company}
                          {exp.location ? ` • ${exp.location}` : ''}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatMonthYear(exp.startDate)} - {exp.endDate ? formatMonthYear(exp.endDate) : 'Sekarang'}
                        </p>
                        {exp.technologies.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {exp.technologies.map((tech) => (
                              <Tag key={`${exp.id}-${tech}`}>{tech}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <section id="gallery" className="section-block px-6 py-14 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow label="Gallery" />
          {loading && (
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-44" />
              ))}
            </div>
          )}
          {!loading && galleries.length === 0 && (
            <p className="rounded-2xl border border-white/12 bg-slate-900/40 p-5 text-sm text-slate-300">
              Belum ada data gallery.
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleries.slice(0, 6).map((item, index) => (
              <article
                key={item.id}
                className={`overflow-hidden rounded-3xl border border-white/12 bg-slate-900/40 ${index === 0 ? 'xl:col-span-2' : ''}`}
              >
                <div className={`overflow-hidden ${index === 0 ? 'h-72' : 'h-52'}`}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-['Fraunces',serif] text-xl text-slate-50">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-slate-300/90">{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="section-block px-6 pb-24 pt-14 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <SectionEyebrow label="Certificates" />
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-[290px]" />
              ))}
            </div>
          )}
          {!loading && certificates.length === 0 && (
            <p className="rounded-2xl border border-white/12 bg-slate-900/40 p-5 text-sm text-slate-300">
              Belum ada data certificate.
            </p>
          )}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certificates.slice(0, 9).map((item) => (
              <article key={item.id} className="overflow-hidden rounded-3xl border border-white/12 bg-slate-900/45 transition hover:border-cyan-300/50">
                <div className="h-44 overflow-hidden bg-slate-950/60">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-['Fraunces',serif] text-lg text-slate-50">{item.title}</h3>
                  <p className="mt-1 text-sm text-cyan-200/90">{item.issuer}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatMonthYear(item.issueDate)}</p>
                  {item.description && <p className="mt-3 line-clamp-2 text-sm text-slate-300/90">{item.description}</p>}
                  {item.credentialUrl && (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-[11px] uppercase tracking-[0.18em] text-cyan-200 hover:text-cyan-100"
                    >
                      View Credential
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
