// src/components/public/Hero.tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Project } from '../lib/types';
import {
  mockContactMessages,
  mockExperiences,
  mockProfile,
  mockProjects,
  mockSkills,
} from '../lib/mockData';

function ensureWordCount(text: string, targetWords = 150) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const words = clean.length ? clean.split(' ') : [];

  const filler = `This project focuses on reliable architecture, maintainable code quality, responsive interface behavior, performance optimization, accessibility standards, testing discipline, and smooth user experience across devices. It also highlights reusable components, scalable structure, secure integration, and clear documentation for future development.`
    .split(' ');

  let i = 0;
  while (words.length < targetWords) {
    words.push(filler[i % filler.length]);
    i += 1;
  }

  return words.slice(0, targetWords).join(' ');
}

function truncateWords(text: string, totalWords = 20) {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  if (words.length <= totalWords) return text;
  return `${words.slice(0, totalWords).join(' ')}...`;
}

function getProjectLongDescription(project: Project) {
  const baseText = project.longDescription ?? project.description;
  return ensureWordCount(baseText, 150);
}

export function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlides, setActiveSlides] = useState<Record<string, number>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const btnGroupRef = useRef<HTMLDivElement>(null);
  const decorLineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroPhotoRef = useRef<HTMLDivElement>(null);
  const mockContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !mockContentRef.current) return;

    gsap.fromTo(
      mockContentRef.current.querySelectorAll('.mock-card'),
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    setActiveSlides(
      mockProjects.reduce<Record<string, number>>((acc, project) => {
        acc[project.id] = 0;
        return acc;
      }, {})
    );

    const interval = window.setInterval(() => {
      setActiveSlides((prev) => {
        const next = { ...prev };
        mockProjects.forEach((project) => {
          const images = project.imageUrls?.length ? project.imageUrls : [project.imageUrl];
          const current = prev[project.id] ?? 0;
          next[project.id] = (current + 1) % images.length;
        });
        return next;
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  const toggleExpand = (projectId: string) => {
    setExpandedCards((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const nextSlide = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) return;
    const images = project.imageUrls?.length ? project.imageUrls : [project.imageUrl];

    setActiveSlides((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) + 1) % images.length,
    }));
  };

  const prevSlide = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) return;
    const images = project.imageUrls?.length ? project.imageUrls : [project.imageUrl];

    setActiveSlides((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] ?? 0) - 1 + images.length) % images.length,
    }));
  };

  useEffect(() => {
    const words = headlineRef.current?.querySelectorAll('.word') ?? [];
    const buttonChildren = btnGroupRef.current?.children ?? [];
    const statChildren = statsRef.current?.children ?? [];

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      labelRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      decorLineRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 1.2 },
      '-=0.4'
    )
    .fromTo(
      words,
      { y: 100, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, stagger: 0.08, duration: 1.2 },
      '-=0.8'
    )
    .fromTo(
      sublineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.6'
    )
    .fromTo(
      buttonChildren,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 },
      '-=0.5'
    )
    .fromTo(
      statChildren,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(
      heroPhotoRef.current,
      { x: 40, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.9 },
      '-=0.8'
    );
  }, []);

  return (
    <>
    <section className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950">
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black opacity-90" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Accent glows */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-neutral-700/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-neutral-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-14 items-center">
        <div className="max-w-4xl space-y-8">
          
          {/* Label + line */}
          <div className="flex items-center gap-4">
            <div 
              ref={labelRef}
              className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500"
            >
              Portfolio — 2026
            </div>
            <div 
              ref={decorLineRef}
              className="h-[1px] flex-1 max-w-xs bg-gradient-to-r from-neutral-700 to-transparent"
            />
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]"
          >
            <span className="word block text-white">Halo, saya</span>
            <span className="word block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500">
              Nio
            </span>
            <span className="word block mt-2 text-neutral-400 text-4xl sm:text-5xl lg:text-6xl font-medium">
              Full-Stack Developer
            </span>
          </h1>

          {/* Subline */}
          <p
            ref={sublineRef}
            className="text-base sm:text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl"
          >
            Crafting fast, elegant, and meaningful digital experiences.
            <span className="block mt-1 text-neutral-500">
              Specialized in React, TypeScript, Tailwind & Cloudflare stack.
            </span>
          </p>

          {/* CTA Buttons */}
          <div ref={btnGroupRef} className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-950 font-semibold overflow-hidden transition-all duration-300 hover:pr-10"
            >
              <span className="relative z-10">View Portfolio</span>
              <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-neutral-700 text-neutral-300 font-semibold hover:border-neutral-500 hover:text-white transition-all duration-300"
            >
              <span>Get in Touch</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap items-center gap-8 pt-6 border-t border-neutral-800/50">
            <div>
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-xs uppercase tracking-wider text-neutral-500">Years Exp</div>
            </div>
            <div className="h-8 w-[1px] bg-neutral-800" />
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs uppercase tracking-wider text-neutral-500">Projects</div>
            </div>
            <div className="h-8 w-[1px] bg-neutral-800" />
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs uppercase tracking-wider text-neutral-500">Satisfaction</div>
            </div>
          </div>
        </div>

        <div ref={heroPhotoRef} className="hidden lg:flex justify-end">
          <div className="relative w-[320px] h-[380px] rounded-2xl overflow-hidden border border-neutral-700/70 bg-neutral-900">
            <img
              src={mockProfile.avatarUrl ?? 'https://picsum.photos/seed/hero-profile/500/650'}
              alt={`${mockProfile.name} portrait`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">Scroll</span>
        <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <section id="projects" ref={mockContentRef} className="relative bg-neutral-950 pb-24 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mock-card rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 mb-3">Profile</p>
          {isLoading ? (
            <div className="animate-pulse grid md:grid-cols-[120px_1fr] gap-5 items-start">
              <div className="h-[120px] w-[120px] rounded-xl bg-neutral-800" />
              <div className="space-y-3">
                <div className="h-6 w-56 bg-neutral-800 rounded" />
                <div className="h-4 w-full bg-neutral-800 rounded" />
                <div className="h-4 w-4/5 bg-neutral-800 rounded" />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-[120px_1fr] gap-5 items-start">
              <img
                src={mockProfile.avatarUrl ?? 'https://picsum.photos/seed/profile-fallback/320/320'}
                alt={`${mockProfile.name} profile`}
                className="h-[120px] w-[120px] rounded-xl object-cover border border-neutral-700"
              />
              <div>
                <h2 className="text-3xl font-bold text-white">{mockProfile.name} — {mockProfile.tagline}</h2>
                <p className="mt-3 text-neutral-300">{mockProfile.bio}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-400">
                  <span>{mockProfile.email}</span>
                  <span>•</span>
                  <span>{mockProfile.location}</span>
                  {mockProfile.phone && (
                    <>
                      <span>•</span>
                      <span>{mockProfile.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">Projects ({mockProjects.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {isLoading
              ? Array.from({ length: mockProjects.length || 4 }, (_, index) => (
                <article key={`project-skeleton-${index}`} className="mock-card rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
                  <div className="animate-pulse space-y-3">
                    <div className="h-40 w-full bg-neutral-800 rounded-lg" />
                    <div className="h-5 w-2/3 bg-neutral-800 rounded" />
                    <div className="h-4 w-full bg-neutral-800 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-800 rounded" />
                    <div className="h-8 w-1/2 bg-neutral-800 rounded" />
                  </div>
                </article>
              ))
              : mockProjects.map((project) => (
              <article key={project.id} className="mock-card rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
                  <div className="relative min-h-[450px] space-y-3">
                    <div className="absolute top-0 right-0 z-20">
                      <button
                        type="button"
                        onClick={() => toggleExpand(project.id)}
                        className="h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900/90 text-white hover:border-neutral-500"
                        title={expandedCards[project.id] ? 'Collapse description' : 'Expand full description'}
                      >
                        {expandedCards[project.id] ? '-' : '+'}
                      </button>
                    </div>

                    <div className="relative">
                      <img
                        src={(project.imageUrls?.length ? project.imageUrls : [project.imageUrl])[activeSlides[project.id] ?? 0]}
                        alt={`${project.title} preview`}
                        className="h-44 w-full object-cover rounded-lg border border-neutral-800"
                      />

                      <button
                        type="button"
                        onClick={() => prevSlide(project.id)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900/80 text-white hover:border-neutral-500"
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => nextSlide(project.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900/80 text-white hover:border-neutral-500"
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </div>

                    <div className="flex justify-center gap-2">
                      {(project.imageUrls?.length ? project.imageUrls : [project.imageUrl]).map((_, index) => (
                        <span
                          key={`${project.id}-dot-${index}`}
                          className={`h-1.5 rounded-full transition-all ${index === (activeSlides[project.id] ?? 0) ? 'w-6 bg-white' : 'w-2 bg-neutral-600'}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300">{project.status}</span>
                    </div>

                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {expandedCards[project.id]
                        ? getProjectLongDescription(project)
                        : truncateWords(getProjectLongDescription(project), 20)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300">{tag}</span>
                      ))}
                    </div>
                  </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="mock-card rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-neutral-800 rounded" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {mockSkills.map((skill) => (
                  <li key={skill.id} className="flex justify-between text-sm text-neutral-300">
                    <span>{skill.name}</span>
                    <span>{skill.proficiency}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mock-card rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="text-xl font-semibold text-white mb-4">Experiences</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-800 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {mockExperiences.map((exp) => (
                  <div key={exp.id} className="border border-neutral-800 rounded-lg p-3">
                    <p className="text-sm text-white font-medium">{exp.position}</p>
                    <p className="text-xs text-neutral-400">{exp.company} • {exp.location}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div id="contact" className="mock-card rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Messages</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-neutral-800 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {mockContactMessages.map((msg) => (
                  <div key={msg.id} className="border border-neutral-800 rounded-lg p-3">
                    <p className="text-sm text-white">{msg.name} — {msg.subject ?? 'No subject'}</p>
                    <p className="text-xs text-neutral-400 line-clamp-2">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Hero;