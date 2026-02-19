// @ts-nocheck
import { badRequest, json, notFound, requireAuth, toBool } from '../../_shared';

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

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid gallery id');

  const row = await env.portofolio_db.prepare('SELECT * FROM galleries WHERE id = ?').bind(id).first();
  if (!row) return notFound('Gallery tidak ditemukan');

  const body = await request.json<any>();

  await env.portofolio_db
    .prepare(
      `UPDATE galleries SET
        title = ?, description = ?, image_url = ?, sort_order = ?, is_featured = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      body.title ?? row.title,
      body.description ?? row.description,
      body.imageUrl ?? row.image_url,
      body.sortOrder ?? row.sort_order,
      body.isFeatured === undefined ? row.is_featured : body.isFeatured ? 1 : 0,
      id,
    )
    .run();

  const updated = await env.portofolio_db.prepare('SELECT * FROM galleries WHERE id = ?').bind(id).first();
  return json(mapGallery(updated));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid gallery id');

  await env.portofolio_db.prepare('DELETE FROM galleries WHERE id = ?').bind(id).run();
  return json({ success: true });
};
