import { query } from '../config/database';

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  viewsThisWeek: number;
  clicksThisWeek: number;
  viewsChangePercent: number;
  clicksChangePercent: number;
  topLinks: Array<{ id: string; title: string; clicks: number }>;
}

// =============================================
// Analytics Service
// =============================================

export async function getAnalyticsSummary(userId: string): Promise<AnalyticsSummary> {
  const [views, clicks, weeklyViews, weeklyClicks, topLinks] = await Promise.all([
    getTotalViews(userId),
    getTotalClicks(userId),
    getWeeklyViews(userId),
    getWeeklyClicks(userId),
    getTopLinks(userId, 5),
  ]);

  const ctr = views > 0 ? parseFloat(((clicks / views) * 100).toFixed(1)) : 0;

  // Compute week-over-week change
  const [prevWeekViews, prevWeekClicks] = await Promise.all([
    getPrevWeekViews(userId),
    getPrevWeekClicks(userId),
  ]);

  const viewsChangePercent = prevWeekViews > 0
    ? parseFloat((((weeklyViews - prevWeekViews) / prevWeekViews) * 100).toFixed(1))
    : 0;

  const clicksChangePercent = prevWeekClicks > 0
    ? parseFloat((((weeklyClicks - prevWeekClicks) / prevWeekClicks) * 100).toFixed(1))
    : 0;

  return {
    totalViews: views,
    totalClicks: clicks,
    ctr,
    viewsThisWeek: weeklyViews,
    clicksThisWeek: weeklyClicks,
    viewsChangePercent,
    clicksChangePercent,
    topLinks,
  };
}

// =============================================
// Private Query Helpers
// =============================================

async function getTotalViews(userId: string): Promise<number> {
  const { rows } = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM profile_views WHERE user_id = $1',
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

async function getTotalClicks(userId: string): Promise<number> {
  const { rows } = await query<{ total: string }>(
    'SELECT COALESCE(SUM(click_count), 0) as total FROM links WHERE user_id = $1',
    [userId]
  );
  return parseInt(rows[0].total, 10);
}

async function getWeeklyViews(userId: string): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM profile_views
     WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '7 days'`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

async function getWeeklyClicks(userId: string): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM link_clicks
     WHERE user_id = $1 AND clicked_at >= NOW() - INTERVAL '7 days'`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

async function getPrevWeekViews(userId: string): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM profile_views
     WHERE user_id = $1
       AND viewed_at >= NOW() - INTERVAL '14 days'
       AND viewed_at < NOW() - INTERVAL '7 days'`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

async function getPrevWeekClicks(userId: string): Promise<number> {
  const { rows } = await query<{ count: string }>(
    `SELECT COUNT(*) as count FROM link_clicks
     WHERE user_id = $1
       AND clicked_at >= NOW() - INTERVAL '14 days'
       AND clicked_at < NOW() - INTERVAL '7 days'`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

async function getTopLinks(
  userId: string,
  limit: number
): Promise<Array<{ id: string; title: string; clicks: number }>> {
  const { rows } = await query<{ id: string; title: string; click_count: string }>(
    `SELECT id, title, click_count FROM links
     WHERE user_id = $1
     ORDER BY click_count DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows.map((r) => ({ id: r.id, title: r.title, clicks: parseInt(r.click_count, 10) }));
}
