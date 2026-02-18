// @ts-nocheck
import { json } from '../_shared';

export const onRequestGet: PagesFunction<{ portofolio_db: D1Database }> = async ({ env }) => {
  const totalProjects = await env.portofolio_db
    .prepare('SELECT COUNT(*) as count FROM projects')
    .first<{ count: number }>();
  const activeProjects = await env.portofolio_db
    .prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'in-progress'")
    .first<{ count: number }>();
  const totalExperiences = await env.portofolio_db
    .prepare('SELECT COUNT(*) as count FROM experiences')
    .first<{ count: number }>();
  const totalSkills = await env.portofolio_db
    .prepare('SELECT COUNT(*) as count FROM skills')
    .first<{ count: number }>();

  return json({
    totalProjects: totalProjects?.count ?? 0,
    activeProjects: activeProjects?.count ?? 0,
    totalExperiences: totalExperiences?.count ?? 0,
    totalSkills: totalSkills?.count ?? 0,
  });
};
