// @ts-nocheck
import { badRequest, json } from '../_shared';

function mapSkill(row: any) {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    icon: row.icon ?? undefined,
    yearsOfExperience: row.years_of_experience,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db
    .prepare('SELECT * FROM skills ORDER BY years_of_experience DESC, id DESC')
    .all();
  return json((rows.results ?? []).map(mapSkill));
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const body = await request.json<any>();
  if (!body.name) return badRequest('name wajib diisi');

  const inserted = await env.portofolio_db
    .prepare(
      `INSERT INTO skills (name, category, icon, years_of_experience, created_at, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(body.name, body.category ?? 'other', body.icon ?? null, body.yearsOfExperience ?? 1)
    .run();

  const row = await env.portofolio_db
    .prepare('SELECT * FROM skills WHERE id = ?')
    .bind(inserted.meta.last_row_id)
    .first();

  return json(mapSkill(row), 201);
};
