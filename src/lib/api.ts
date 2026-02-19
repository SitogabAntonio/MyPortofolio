import type {
  Certificate,
  CertificateFormData,
  DashboardOverview,
  Experience,
  ExperienceFormData,
  Gallery,
  GalleryFormData,
  ProfileInfo,
  Project,
  ProjectFormData,
  Skill,
  SkillFormData,
  Tag,
  UserSession,
} from './types';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(path: string, method: ApiMethod = 'GET', body?: unknown): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const parsed = JSON.parse(text) as { error?: string; message?: string };
      message = parsed.error || parsed.message || text;
    } catch {
      // keep fallback text message
    }
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ ok: boolean }>('/health'),

  login: (username: string, password: string) =>
    request<{ token: string; user: UserSession }>('/auth/login', 'POST', { username, password }),
  getMe: () => request<UserSession>('/auth/me'),
  logout: () => request<{ success: boolean }>('/auth/logout', 'POST'),

  getOverview: () => request<DashboardOverview>('/overview'),

  getProfile: () => request<ProfileInfo>('/profile'),
  updateProfile: (payload: ProfileInfo) => request<ProfileInfo>('/profile', 'PUT', payload),

  getProjects: () => request<Project[]>('/projects'),
  createProject: (payload: ProjectFormData) => request<Project>('/projects', 'POST', payload),
  updateProject: (id: string, payload: Partial<ProjectFormData>) =>
    request<Project>(`/projects/${id}`, 'PUT', payload),
  deleteProject: (id: string) => request<{ success: boolean }>(`/projects/${id}`, 'DELETE'),

  getTags: () => request<Tag[]>('/tags'),
  createTag: (name: string) => request<Tag>('/tags', 'POST', { name }),
  updateTag: (id: string, name: string) => request<Tag>(`/tags/${id}`, 'PUT', { name }),
  deleteTag: (id: string) => request<{ success: boolean }>(`/tags/${id}`, 'DELETE'),

  getExperiences: () => request<Experience[]>('/experiences'),
  createExperience: (payload: ExperienceFormData) =>
    request<Experience>('/experiences', 'POST', payload),
  updateExperience: (id: string, payload: Partial<ExperienceFormData>) =>
    request<Experience>(`/experiences/${id}`, 'PUT', payload),
  deleteExperience: (id: string) => request<{ success: boolean }>(`/experiences/${id}`, 'DELETE'),

  getSkills: () => request<Skill[]>('/skills'),
  createSkill: (payload: SkillFormData) => request<Skill>('/skills', 'POST', payload),
  updateSkill: (id: string, payload: Partial<SkillFormData>) =>
    request<Skill>(`/skills/${id}`, 'PUT', payload),
  deleteSkill: (id: string) => request<{ success: boolean }>(`/skills/${id}`, 'DELETE'),

  getGalleries: () => request<Gallery[]>('/galleries'),
  createGallery: (payload: GalleryFormData) => request<Gallery>('/galleries', 'POST', payload),
  updateGallery: (id: string, payload: Partial<GalleryFormData>) =>
    request<Gallery>(`/galleries/${id}`, 'PUT', payload),
  deleteGallery: (id: string) => request<{ success: boolean }>(`/galleries/${id}`, 'DELETE'),

  getCertificates: () => request<Certificate[]>('/certificates'),
  createCertificate: (payload: CertificateFormData) =>
    request<Certificate>('/certificates', 'POST', payload),
  updateCertificate: (id: string, payload: Partial<CertificateFormData>) =>
    request<Certificate>(`/certificates/${id}`, 'PUT', payload),
  deleteCertificate: (id: string) =>
    request<{ success: boolean }>(`/certificates/${id}`, 'DELETE'),
};
