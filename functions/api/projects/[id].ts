// @ts-nocheck
import { badRequest, json, notFound, requireAuth, safeJsonArray, toBool } from '../../_shared';

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

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid project id');

  const row = await env.portofolio_db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  if (!row) return notFound('Project tidak ditemukan');

  const body = await request.json<any>();
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter(Boolean).slice(0, 3).map(String)
    : safeJsonArray(row.image_urls).slice(0, 3);

  await env.portofolio_db
    .prepare(
      `UPDATE projects SET
        title = ?, description = ?, long_description = ?, image_url = ?, image_urls = ?,
        demo_url = ?, github_url = ?, category = ?, featured = ?, status = ?,
        start_date = ?, end_date = ?, updated_at = datetime('now')
      WHERE id = ?`,
    )
    .bind(
      body.title ?? row.title,
      body.description ?? row.description,
      body.longDescription ?? row.long_description,
      imageUrls[0] ?? null,
      JSON.stringify(imageUrls),
      body.demoUrl ?? row.demo_url,
      body.githubUrl ?? row.github_url,
      body.category ?? row.category,
      body.featured === undefined ? row.featured : body.featured ? 1 : 0,
      body.status ?? row.status,
      body.startDate ?? row.start_date,
      body.endDate ?? row.end_date,
      id,
    )
    .run();

  if (Array.isArray(body.tags)) {
    await env.portofolio_db.prepare('DELETE FROM project_tags WHERE project_id = ?').bind(id).run();
    for (const tag of body.tags) {
      if (!tag) continue;
      await env.portofolio_db
        .prepare('INSERT OR IGNORE INTO tags (name, created_at, updated_at) VALUES (?, datetime(\'now\'), datetime(\'now\'))')
        .bind(String(tag))
        .run();
      await env.portofolio_db
        .prepare('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)')
        .bind(id, String(tag))
        .run();
    }
  }

  const updated = await env.portofolio_db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return json(await mapProject(env, updated));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid project id');

  await env.portofolio_db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return json({ success: true });
};
