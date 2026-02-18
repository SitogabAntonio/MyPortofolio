// @ts-nocheck
import { badRequest, json, requireAuth } from '../_shared';

function mapTag(row: any) {
  return {
    id: String(row.id),
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db.prepare('SELECT * FROM tags ORDER BY name ASC').all();
  return json((rows.results ?? []).map(mapTag));
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = await request.json<any>();
  const name = String(body.name ?? '').trim();
  if (!name) return badRequest('Nama tag wajib diisi');

  const inserted = await env.portofolio_db
    .prepare('INSERT INTO tags (name, created_at, updated_at) VALUES (?, datetime(\'now\'), datetime(\'now\'))')
    .bind(name)
    .run();

  const row = await env.portofolio_db.prepare('SELECT * FROM tags WHERE id = ?').bind(inserted.meta.last_row_id).first();
  return json(mapTag(row), 201);
};
