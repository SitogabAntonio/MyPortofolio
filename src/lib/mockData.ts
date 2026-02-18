// src/lib/mockData.ts
import type { Experience, ProfileInfo, Project, Skill } from './types';

export const mockProfile: ProfileInfo = {
  name: 'Nio',
  tagline: 'Full-Stack Developer',
  bio: 'Passionate developer with 5+ years of experience building modern web applications. Specialized in React, TypeScript, and cloud technologies. Love creating elegant solutions to complex problems.',
  email: 'nio@example.com',
  phone: '+62 812 3456 7890',
  location: 'Jakarta, Indonesia',
  avatarUrl: 'https://picsum.photos/seed/nio-avatar/320/320',
  resumeUrl: '/resume.pdf',
  socialLinks: {
    github: 'https://github.com/nio',
    linkedin: 'https://linkedin.com/in/nio',
    twitter: 'https://twitter.com/nio',
    website: 'https://nio.dev'
  }
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-featured online shopping platform with payment integration',
    longDescription: 'Built a comprehensive e-commerce solution with product management, cart system, checkout flow, and payment gateway integration. Implemented real-time inventory tracking and order management system.',
    imageUrl: 'https://picsum.photos/seed/project-ecommerce/800/500',
    imageUrls: [
      'https://picsum.photos/seed/project-ecommerce-1/900/560',
      'https://picsum.photos/seed/project-ecommerce-2/900/560',
      'https://picsum.photos/seed/project-ecommerce-3/900/560',
    ],
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/nio/ecommerce',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    category: 'web',
    featured: true,
    status: 'completed',
    startDate: '2023-01-15',
    endDate: '2023-06-30',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-06-30T00:00:00Z'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative project management tool for teams',
    longDescription: 'Developed a Trello-like task management application with drag-and-drop functionality, real-time collaboration, and team workspace features.',
    imageUrl: 'https://picsum.photos/seed/project-task/800/500',
    imageUrls: [
      'https://picsum.photos/seed/project-task-1/900/560',
      'https://picsum.photos/seed/project-task-2/900/560',
      'https://picsum.photos/seed/project-task-3/900/560',
    ],
    demoUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/nio/taskapp',
    tags: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS'],
    category: 'web',
    featured: true,
    status: 'completed',
    startDate: '2023-07-01',
    endDate: '2023-09-15',
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2023-09-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Real-time weather tracking with beautiful visualizations',
    longDescription: 'Created an interactive weather dashboard that displays current conditions, forecasts, and weather patterns using various APIs and chart libraries.',
    imageUrl: 'https://picsum.photos/seed/project-weather/800/500',
    imageUrls: [
      'https://picsum.photos/seed/project-weather-1/900/560',
      'https://picsum.photos/seed/project-weather-2/900/560',
      'https://picsum.photos/seed/project-weather-3/900/560',
    ],
    demoUrl: 'https://weather.example.com',
    githubUrl: 'https://github.com/nio/weather',
    tags: ['React', 'Chart.js', 'OpenWeather API', 'Vite'],
    category: 'web',
    featured: false,
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2023-11-15',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z'
  },
  {
    id: '4',
    title: 'Social Media Dashboard',
    description: 'Analytics platform for social media management',
    longDescription: 'Built a comprehensive social media analytics dashboard with data visualization, scheduled posting, and engagement metrics tracking.',
    imageUrl: 'https://picsum.photos/seed/project-social/800/500',
    imageUrls: [
      'https://picsum.photos/seed/project-social-1/900/560',
      'https://picsum.photos/seed/project-social-2/900/560',
      'https://picsum.photos/seed/project-social-3/900/560',
    ],
    tags: ['Next.js', 'MongoDB', 'D3.js', 'OAuth'],
    category: 'web',
    featured: true,
    status: 'in-progress',
    startDate: '2024-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '5',
    title: 'Portfolio CMS',
    description: 'Content management system for portfolio websites',
    longDescription: 'Developing a modern CMS specifically designed for developers to manage their portfolio content with an elegant admin panel.',
    imageUrl: 'https://picsum.photos/seed/project-portfolio/800/500',
    imageUrls: [
      'https://picsum.photos/seed/project-portfolio-1/900/560',
      'https://picsum.photos/seed/project-portfolio-2/900/560',
      'https://picsum.photos/seed/project-portfolio-3/900/560',
    ],
    githubUrl: 'https://github.com/nio/portfolio-cms',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    category: 'web',
    featured: false,
    status: 'in-progress',
    startDate: '2024-02-01',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-17T00:00:00Z'
  }
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React', category: 'frontend', yearsOfExperience: 4, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'TypeScript', category: 'frontend', yearsOfExperience: 3, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'Next.js', category: 'frontend', yearsOfExperience: 2, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Tailwind CSS', category: 'frontend', yearsOfExperience: 3, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '5', name: 'Node.js', category: 'backend', yearsOfExperience: 4, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '6', name: 'PostgreSQL', category: 'backend', yearsOfExperience: 3, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '7', name: 'MongoDB', category: 'backend', yearsOfExperience: 2, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '8', name: 'Docker', category: 'devops', yearsOfExperience: 2, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '9', name: 'AWS', category: 'devops', yearsOfExperience: 2, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
  { id: '10', name: 'Figma', category: 'design', yearsOfExperience: 3, createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' }
];

export const mockExperiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Startup Inc',
    position: 'Senior Full-Stack Developer',
    location: 'Jakarta, Indonesia',
    type: 'full-time',
    startDate: '2022-01-01',
    description: 'Leading development of core product features and mentoring junior developers.',
    achievements: [
      'Reduced page load time by 40% through optimization',
      'Implemented CI/CD pipeline reducing deployment time by 60%',
      'Mentored 3 junior developers'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    createdAt: '2022-01-01T00:00:00Z'
  },
  {
    id: '2',
    company: 'Digital Agency Co',
    position: 'Frontend Developer',
    location: 'Remote',
    type: 'full-time',
    startDate: '2020-03-01',
    endDate: '2021-12-31',
    description: 'Developed responsive web applications for various clients across different industries.',
    achievements: [
      'Built 15+ client projects from scratch',
      'Improved team workflow with custom tooling',
      'Achieved 98% client satisfaction rate'
    ],
    technologies: ['React', 'Vue.js', 'SCSS', 'Webpack'],
    createdAt: '2020-03-01T00:00:00Z'
  },
  {
    id: '3',
    company: 'Freelance',
    position: 'Full-Stack Developer',
    location: 'Remote',
    type: 'freelance',
    startDate: '2019-01-01',
    endDate: '2020-02-28',
    description: 'Worked with various clients building custom web solutions.',
    achievements: [
      'Completed 20+ projects successfully',
      'Built long-term relationships with 5 recurring clients',
      'Generated consistent revenue stream'
    ],
    technologies: ['React', 'PHP', 'MySQL', 'WordPress'],
    createdAt: '2019-01-01T00:00:00Z'
  }
];
