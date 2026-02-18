// @ts-nocheck
import { badRequest, json, notFound, safeJsonArray } from '../../_shared';

function mapExperience(row: any, technologies: string[]) {
  return {
    id: String(row.id),
    company: row.company,
    position: row.position,
    location: row.location,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    description: row.description,
    achievements: safeJsonArray(row.achievements),
    technologies,
    createdAt: row.created_at,
  };
}

async function listTech(env: any, experienceId: number) {
  const rows = await env.portofolio_db
    .prepare('SELECT technology FROM experience_technologies WHERE experience_id = ? ORDER BY id ASC')
    .bind(experienceId)
    .all();
  return (rows.results ?? []).map((item: any) => item.technology);
}

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const id = Number(params.id);
  if (!id) return badRequest('Invalid experience id');

  const row = await env.portofolio_db.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first();
  if (!row) return notFound('Experience tidak ditemukan');

  const body = await request.json<any>();

  await env.portofolio_db
    .prepare(
      `UPDATE experiences SET
        company = ?, position = ?, location = ?, type = ?, start_date = ?, end_date = ?,
        description = ?, achievements = ?, updated_at = datetime('now')
      WHERE id = ?`,
    )
    .bind(
      body.company ?? row.company,
      body.position ?? row.position,
      body.location ?? row.location,
      body.type ?? row.type,
      body.startDate ?? row.start_date,
      body.endDate ?? row.end_date,
      body.description ?? row.description,
      JSON.stringify(body.achievements ?? safeJsonArray(row.achievements)),
      id,
    )
    .run();

  if (Array.isArray(body.technologies)) {
    await env.portofolio_db
      .prepare('DELETE FROM experience_technologies WHERE experience_id = ?')
      .bind(id)
      .run();
    for (const tech of body.technologies) {
      if (!tech) continue;
      await env.portofolio_db
        .prepare('INSERT INTO experience_technologies (experience_id, technology) VALUES (?, ?)')
        .bind(id, String(tech))
        .run();
    }
  }

  const updated = await env.portofolio_db.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first();
  return json(mapExperience(updated, await listTech(env, id)));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!id) return badRequest('Invalid experience id');

  await env.portofolio_db.prepare('DELETE FROM experiences WHERE id = ?').bind(id).run();
  return json({ success: true });
};
