// @ts-nocheck
import { badRequest, json, notFound, requireAuth } from '../../_shared';

function mapTag(row: any) {
  return {
    id: String(row.id),
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid tag id');

  const existing = await env.portofolio_db.prepare('SELECT * FROM tags WHERE id = ?').bind(id).first();
  if (!existing) return notFound('Tag tidak ditemukan');

  const body = await request.json<any>();
  const name = String(body.name ?? '').trim();
  if (!name) return badRequest('Nama tag wajib diisi');

  await env.portofolio_db
    .prepare('UPDATE tags SET name = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(name, id)
    .run();

  await env.portofolio_db.prepare('UPDATE project_tags SET tag = ? WHERE tag = ?').bind(name, existing.name).run();

  const updated = await env.portofolio_db.prepare('SELECT * FROM tags WHERE id = ?').bind(id).first();
  return json(mapTag(updated));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid tag id');

  const existing = await env.portofolio_db.prepare('SELECT * FROM tags WHERE id = ?').bind(id).first();
  if (!existing) return notFound('Tag tidak ditemukan');

  await env.portofolio_db.prepare('DELETE FROM tags WHERE id = ?').bind(id).run();
  await env.portofolio_db.prepare('DELETE FROM project_tags WHERE tag = ?').bind(existing.name).run();

  return json({ success: true });
};
