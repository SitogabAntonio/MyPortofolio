import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { api } from '../lib/api';
import type { Experience, ProfileInfo, Project, Skill } from '../lib/types';

function SkeletonCard() {
  return <div className="h-40 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/60" />;
}

export default function Hero() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

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
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' },
    );
  }, [loading]);

  const topProjects = useMemo(() => projects.slice(0, 4), [projects]);

  return (
    <div ref={containerRef} className="bg-neutral-950 text-neutral-100">
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-36 md:px-12 lg:px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="reveal-item text-xs uppercase tracking-[0.24em] text-neutral-500">Portfolio — 2026</div>
            <h1 className="reveal-item text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {profile?.name ? `Halo, saya ${profile.name}` : 'Halo, saya Developer'}
            </h1>
            <p className="reveal-item max-w-2xl text-lg text-neutral-400">
              {profile?.tagline ?? 'Full-Stack Developer'}
              <span className="mt-2 block text-neutral-500">
                {profile?.bio ?? 'Menyiapkan pengalaman digital yang cepat, modern, dan scalable.'}
              </span>
            </p>
            <div className="reveal-item flex flex-wrap gap-3">
              <a href="#projects" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
                Lihat Projects
              </a>
              <a href="#skills" className="rounded-xl border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white">
                Lihat Skills
              </a>
            </div>
          </div>

          <div className="reveal-item rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="h-[360px] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500">No avatar</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-5">
          <h2 className="reveal-item text-2xl font-semibold text-white">Projects</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            {!loading && !topProjects.length && (
              <div className="reveal-item rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm text-neutral-500">
                Belum ada project. Tambahkan dari admin panel.
              </div>
            )}
            {topProjects.map((project) => (
              <article
                key={project.id}
                className="reveal-item rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:-translate-y-0.5 hover:border-neutral-600"
              >
                <div className="overflow-hidden rounded-lg border border-neutral-800">
                  <img
                    src={project.imageUrl || project.imageUrls?.[0] || 'https://picsum.photos/seed/project/700/420'}
                    alt={project.title}
                    className="h-44 w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <article className="reveal-item rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
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

          <article className="reveal-item rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
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
