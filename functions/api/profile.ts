// @ts-nocheck
import { badRequest, json, requireAuth } from '../_shared';

type ProfilePayload = {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
};

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const row = await env.portofolio_db.prepare('SELECT * FROM profile WHERE id = 1').first<any>();

  if (!row) {
    return json({
      id: '1',
      name: '',
      tagline: '',
      bio: '',
      email: '',
      location: '',
      socialLinks: {},
    });
  }

  return json({
    id: '1',
    name: row.name,
    tagline: row.tagline,
    bio: row.bio,
    email: row.email,
    phone: row.phone ?? undefined,
    location: row.location,
    avatarUrl: row.avatar_url ?? undefined,
    resumeUrl: row.resume_url ?? undefined,
    socialLinks: {
      github: row.github_url ?? undefined,
      linkedin: row.linkedin_url ?? undefined,
      twitter: row.twitter_url ?? undefined,
      website: row.website_url ?? undefined,
    },
  });
};

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = (await request.json()) as ProfilePayload;

  if (!body.name || !body.tagline || !body.email || !body.location || !body.bio) {
    return badRequest('name, tagline, bio, email, location wajib diisi');
  }

  await env.portofolio_db
    .prepare(
      `UPDATE profile SET
        name = ?, tagline = ?, bio = ?, email = ?, phone = ?, location = ?,
        avatar_url = ?, resume_url = ?,
        github_url = ?, linkedin_url = ?, twitter_url = ?, website_url = ?,
        updated_at = datetime('now')
      WHERE id = 1`,
    )
    .bind(
      body.name,
      body.tagline,
      body.bio,
      body.email,
      body.phone ?? null,
      body.location,
      body.avatarUrl ?? null,
      body.resumeUrl ?? null,
      body.socialLinks?.github ?? null,
      body.socialLinks?.linkedin ?? null,
      body.socialLinks?.twitter ?? null,
      body.socialLinks?.website ?? null,
    )
    .run();

  const updated = await env.portofolio_db.prepare('SELECT * FROM profile WHERE id = 1').first<any>();

  return json({
    id: '1',
    name: updated?.name ?? body.name,
    tagline: updated?.tagline ?? body.tagline,
    bio: updated?.bio ?? body.bio,
    email: updated?.email ?? body.email,
    phone: updated?.phone ?? body.phone,
    location: updated?.location ?? body.location,
    avatarUrl: updated?.avatar_url ?? body.avatarUrl,
    resumeUrl: updated?.resume_url ?? body.resumeUrl,
    socialLinks: {
      github: updated?.github_url ?? body.socialLinks?.github,
      linkedin: updated?.linkedin_url ?? body.socialLinks?.linkedin,
      twitter: updated?.twitter_url ?? body.socialLinks?.twitter,
      website: updated?.website_url ?? body.socialLinks?.website,
    },
  });
};
