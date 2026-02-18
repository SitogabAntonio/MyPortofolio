// @ts-nocheck
import { badRequest, json, requireAuth, safeJsonArray, toBool } from '../_shared';

async function listTags(env: any, projectId: number) {
  const tags = await env.portofolio_db
    .prepare('SELECT tag FROM project_tags WHERE project_id = ? ORDER BY id ASC')
    .bind(projectId)
    .all();
  return (tags.results ?? []).map((item: any) => item.tag);
}

async function mapProject(env: any, row: any) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    longDescription: row.long_description ?? undefined,
    imageUrl: row.image_url ?? '',
    imageUrls: safeJsonArray(row.image_urls),
    demoUrl: row.demo_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    category: row.category,
    featured: toBool(row.featured),
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: await listTags(env, row.id),
  };
}

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db
    .prepare('SELECT * FROM projects ORDER BY updated_at DESC, id DESC')
    .all();

  const data = [];
  for (const row of rows.results ?? []) {
    data.push(await mapProject(env, row));
  }
  return json(data);
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = await request.json<any>();

  if (!body.title || !body.description || !body.startDate) {
    return badRequest('title, description, startDate wajib diisi');
  }

  const rawImages = Array.isArray(body.imageUrls) ? body.imageUrls.filter(Boolean) : [];
  if (rawImages.length > 3) {
    return badRequest('Maksimal 3 gambar per project');
  }
  const imageUrls = rawImages.slice(0, 3).map(String);

  const inserted = await env.portofolio_db
    .prepare(
      `INSERT INTO projects (
        title, description, long_description, image_url, image_urls, demo_url, github_url,
        category, featured, status, start_date, end_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      body.title,
      body.description,
      body.longDescription ?? null,
      imageUrls[0] ?? null,
      JSON.stringify(imageUrls),
      body.demoUrl ?? null,
      body.githubUrl ?? null,
      body.category ?? 'web',
      body.featured ? 1 : 0,
      body.status ?? 'in-progress',
      body.startDate,
      body.endDate ?? null,
    )
    .run();

  const projectId = inserted.meta.last_row_id;
  const tags = Array.isArray(body.tags) ? body.tags : [];
  for (const tag of tags) {
    if (!tag) continue;
    await env.portofolio_db
      .prepare('INSERT OR IGNORE INTO tags (name, created_at, updated_at) VALUES (?, datetime(\'now\'), datetime(\'now\'))')
      .bind(String(tag))
      .run();
    await env.portofolio_db
      .prepare('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)')
      .bind(projectId, String(tag))
      .run();
  }

  const row = await env.portofolio_db
    .prepare('SELECT * FROM projects WHERE id = ?')
    .bind(projectId)
    .first();
  return json(await mapProject(env, row), 201);
};
