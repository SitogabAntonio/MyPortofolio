// @ts-nocheck
import { badRequest, json, notFound } from '../../_shared';

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

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const id = Number(params.id);
  if (!id) return badRequest('Invalid skill id');

  const row = await env.portofolio_db.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first();
  if (!row) return notFound('Skill tidak ditemukan');

  const body = await request.json<any>();

  await env.portofolio_db
    .prepare(
      `UPDATE skills SET
        name = ?, category = ?, icon = ?, years_of_experience = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      body.name ?? row.name,
      body.category ?? row.category,
      body.icon ?? row.icon,
      body.yearsOfExperience ?? row.years_of_experience,
      id,
    )
    .run();

  const updated = await env.portofolio_db.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first();
  return json(mapSkill(updated));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!id) return badRequest('Invalid skill id');

  await env.portofolio_db.prepare('DELETE FROM skills WHERE id = ?').bind(id).run();
  return json({ success: true });
};
