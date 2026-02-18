// @ts-nocheck
import { getSessionFromRequest, json } from '../../_shared';

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const session = await getSessionFromRequest(env, request);
  if (!session) return json({ error: 'Unauthorized' }, 401);

  return json({
    id: session.id,
    username: session.username,
    createdAt: new Date().toISOString(),
    expiresAt: session.expiresAt,
  });
};
