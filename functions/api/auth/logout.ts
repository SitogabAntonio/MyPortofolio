// @ts-nocheck
import { getSessionFromRequest, json } from '../../_shared';

export const onRequestPost: PagesFunction<{ portofolio_db: D1Database }> = async ({ env, request }) => {
  const session = await getSessionFromRequest(env, request);
  if (!session) return json({ success: true });

  await env.portofolio_db.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(session.token).run();
  return json({ success: true });
};
