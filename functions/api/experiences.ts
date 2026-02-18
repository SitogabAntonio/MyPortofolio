// @ts-nocheck
import { badRequest, json, requireAuth, safeJsonArray } from '../_shared';

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

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db
    .prepare('SELECT * FROM experiences ORDER BY start_date DESC, id DESC')
    .all();

  const data = [];
  for (const row of rows.results ?? []) {
    data.push(mapExperience(row, await listTech(env, row.id)));
  }
  return json(data);
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = await request.json<any>();

  if (!body.company || !body.position || !body.location || !body.startDate || !body.description) {
    return badRequest('company, position, location, startDate, description wajib diisi');
  }

  const inserted = await env.portofolio_db
    .prepare(
      `INSERT INTO experiences (
        company, position, location, type, start_date, end_date, description, achievements, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      body.company,
      body.position,
      body.location,
      body.type ?? 'full-time',
      body.startDate,
      body.endDate ?? null,
      body.description,
      JSON.stringify(body.achievements ?? []),
    )
    .run();

  const id = inserted.meta.last_row_id;
  for (const tech of body.technologies ?? []) {
    if (!tech) continue;
    await env.portofolio_db
      .prepare('INSERT INTO experience_technologies (experience_id, technology) VALUES (?, ?)')
      .bind(id, String(tech))
      .run();
  }

  const row = await env.portofolio_db.prepare('SELECT * FROM experiences WHERE id = ?').bind(id).first();
  return json(mapExperience(row, await listTech(env, id)), 201);
};
