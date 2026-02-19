// @ts-nocheck
import { badRequest, json, notFound, requireAuth } from '../../_shared';

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

export const onRequestPut: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid certificate id');

  const row = await env.portofolio_db.prepare('SELECT * FROM certificates WHERE id = ?').bind(id).first();
  if (!row) return notFound('Certificate tidak ditemukan');

  const body = await request.json<any>();

  await env.portofolio_db
    .prepare(
      `UPDATE certificates SET
        title = ?, issuer = ?, issue_date = ?, credential_url = ?, image_url = ?, description = ?, updated_at = datetime('now')
       WHERE id = ?`,
    )
    .bind(
      body.title ?? row.title,
      body.issuer ?? row.issuer,
      body.issueDate ?? row.issue_date,
      body.credentialUrl ?? row.credential_url,
      body.imageUrl ?? row.image_url,
      body.description ?? row.description,
      id,
    )
    .run();

  const updated = await env.portofolio_db.prepare('SELECT * FROM certificates WHERE id = ?').bind(id).first();
  return json(mapCertificate(updated));
};

export const onRequestDelete: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, params, request }) => {
  const authError = await requireAuth(env, request);
  if (authError) return authError;

  const id = Number(params.id);
  if (!id) return badRequest('Invalid certificate id');

  await env.portofolio_db.prepare('DELETE FROM certificates WHERE id = ?').bind(id).run();
  return json({ success: true });
};
