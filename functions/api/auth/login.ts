// @ts-nocheck
import { badRequest, ensureDefaultAdmin, json, sha256 } from '../../_shared';

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  await ensureDefaultAdmin(env);

  const body = await request.json<any>();
  if (!body.username || !body.password) {
    return badRequest('username dan password wajib diisi');
  }

  const user = await env.portofolio_db
    .prepare('SELECT * FROM admin_users WHERE username = ?')
    .bind(String(body.username))
    .first<any>();

  if (!user) return json({ error: 'Username atau password salah' }, 401);

  const passwordHash = await sha256(String(body.password));
  if (passwordHash !== user.password_hash) {
    return json({ error: 'Username atau password salah' }, 401);
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

  await env.portofolio_db
    .prepare('INSERT INTO auth_sessions (user_id, token, expires_at, created_at) VALUES (?, ?, ?, datetime(\'now\'))')
    .bind(user.id, token, expiresAt)
    .run();

  return json({
    token,
    user: {
      id: String(user.id),
      username: user.username,
      createdAt: user.created_at,
      expiresAt,
    },
  });
};
