// @ts-nocheck
import { badRequest, json, requireAuth } from '../_shared';

function mapCertificate(row: any) {
  return {
    id: String(row.id),
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialUrl: row.credential_url ?? undefined,
    imageUrl: row.image_url ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const rows = await env.portofolio_db
    .prepare('SELECT * FROM certificates ORDER BY issue_date DESC, id DESC')
    .all();
  return json((rows.results ?? []).map(mapCertificate));
};

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const body = await request.json<any>();
  if (!body.title || !body.issuer || !body.issueDate) {
    return badRequest('title, issuer, issueDate wajib diisi');
  }

  const inserted = await env.portofolio_db
    .prepare(
      `INSERT INTO certificates (
        title, issuer, issue_date, credential_url, image_url, description, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    )
    .bind(
      body.title,
      body.issuer,
      body.issueDate,
      body.credentialUrl ?? null,
      body.imageUrl ?? null,
      body.description ?? null,
    )
    .run();

  const row = await env.portofolio_db
    .prepare('SELECT * FROM certificates WHERE id = ?')
    .bind(inserted.meta.last_row_id)
    .first();

  return json(mapCertificate(row), 201);
};
