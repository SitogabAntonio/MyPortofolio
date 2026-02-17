// src/lib/types.ts

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  imageUrls?: string[];
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  category: 'web' | 'mobile' | 'desktop' | 'other';
  featured: boolean;
  status: 'completed' | 'in-progress' | 'archived';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'design' | 'other';
  proficiency: number; // 0-100
  icon?: string;
  yearsOfExperience: number;
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  startDate: string;
  endDate?: string; // null means current
  description: string;
  achievements: string[];
  technologies: string[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
  repliedAt?: string;
}

export interface ProfileInfo {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Form types
export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type SkillFormData = Omit<Skill, 'id' | 'createdAt'>;
export type ExperienceFormData = Omit<Experience, 'id' | 'createdAt'>;