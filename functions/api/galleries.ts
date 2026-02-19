// @ts-nocheck
import { badRequest, json, requireAuth, toBool } from '../_shared';

function mapGallery(row: any) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? undefined,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isFeatured: toBool(row.is_featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db
    .prepare('SELECT * FROM galleries ORDER BY is_featured DESC, sort_order ASC, id DESC')
    .all();
  return json((rows.results ?? []).map(mapGallery));
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = await request.json<any>();
  if (!body.title || !body.imageUrl) {
    return badRequest('title dan imageUrl wajib diisi');
  }

  const inserted = await env.portofolio_db
    .prepare(
      `INSERT INTO galleries (title, description, image_url, sort_order, is_featured, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      body.title,
      body.description ?? null,
      body.imageUrl,
      Number(body.sortOrder ?? 0),
      body.isFeatured ? 1 : 0,
    )
    .run();

  const row = await env.portofolio_db
    .prepare('SELECT * FROM galleries WHERE id = ?')
    .bind(inserted.meta.last_row_id)
    .first();

  return json(mapGallery(row), 201);
};
