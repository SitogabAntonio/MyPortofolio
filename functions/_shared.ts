// @ts-nocheck
export interface Env {
  portofolio_db: D1Database;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
  });
}

export function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export function notFound(message = 'Not found'): Response {
  return json({ error: message }, 404);
}

export function toBool(value: unknown): boolean {
  return value === 1 || value === '1' || value === true;
}

export function safeJsonArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);

  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
  } catch {
    return [];
  }
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function ensureDefaultAdmin(env: any) {
  const existing = await env.portofolio_db
    .prepare('SELECT id FROM admin_users WHERE username = ?')
    .bind('admin')
    .first();

  if (existing) return;

  const passwordHash = await sha256('admin123');
  await env.portofolio_db
    .prepare(
      `INSERT INTO admin_users (username, password_hash, created_at, updated_at)
       VALUES (?, ?, datetime('now'), datetime('now'))`,
    )
    .bind('admin', passwordHash)
    .run();
}

export async function getSessionFromRequest(env: any, request: Request) {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;

  const row = await env.portofolio_db
    .prepare(
      `SELECT s.id, s.user_id, s.expires_at, u.username
       FROM auth_sessions s
       INNER JOIN admin_users u ON u.id = s.user_id
       WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')`,
    )
    .bind(token)
    .first<any>();

  if (!row) return null;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    username: row.username,
    expiresAt: row.expires_at,
    token,
  };
}

export async function requireAuth(env: any, request: Request): Promise<Response | null> {
  const session = await getSessionFromRequest(env, request);
  if (!session) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
}
