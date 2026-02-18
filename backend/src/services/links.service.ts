import { query, withTransaction } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { Link, CreateLinkBody, UpdateLinkBody, ReorderLinksBody } from '../types';
import { PoolClient } from 'pg';

// =============================================
// Links Service
// =============================================

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  const { rows } = await query<Link>(
    `SELECT id, user_id, title, url, is_active, sort_order, click_count, created_at, updated_at
     FROM links
     WHERE user_id = $1
     ORDER BY sort_order ASC, created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getPublicLinksByUsername(username: string): Promise<Link[]> {
  const { rows } = await query<Link>(
    `SELECT l.id, l.user_id, l.title, l.url, l.is_active, l.sort_order, l.click_count, l.created_at, l.updated_at
     FROM links l
     JOIN users u ON u.id = l.user_id
     WHERE u.username = $1 AND l.is_active = true AND u.is_active = true
     ORDER BY l.sort_order ASC, l.created_at DESC`,
    [username.toLowerCase()]
  );
  return rows;
}

export async function createLink(userId: string, body: CreateLinkBody): Promise<Link> {
  // Get the max sort_order for this user to append at end
  const { rows: maxRows } = await query<{ max: number | null }>(
    'SELECT MAX(sort_order) as max FROM links WHERE user_id = $1',
    [userId]
  );
  const nextOrder = (maxRows[0].max ?? -1) + 1;

  const { rows } = await query<Link>(
    `INSERT INTO links (user_id, title, url, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, url, is_active, sort_order, click_count, created_at, updated_at`,
    [userId, body.title, body.url, nextOrder]
  );
  return rows[0];
}

export async function updateLink(
  linkId: string,
  userId: string,
  body: UpdateLinkBody
): Promise<Link> {
  // Verify ownership
  await assertLinkOwnership(linkId, userId);

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (body.title !== undefined) { fields.push(`title = $${i++}`); values.push(body.title); }
  if (body.url !== undefined) { fields.push(`url = $${i++}`); values.push(body.url); }
  if (body.is_active !== undefined) { fields.push(`is_active = $${i++}`); values.push(body.is_active); }
  if (body.sort_order !== undefined) { fields.push(`sort_order = $${i++}`); values.push(body.sort_order); }

  if (fields.length === 0) throw new AppError(400, 'No fields to update');

  values.push(linkId);
  const { rows } = await query<Link>(
    `UPDATE links SET ${fields.join(', ')} WHERE id = $${i}
     RETURNING id, user_id, title, url, is_active, sort_order, click_count, created_at, updated_at`,
    values
  );
  return rows[0];
}

export async function deleteLink(linkId: string, userId: string): Promise<void> {
  await assertLinkOwnership(linkId, userId);
  await query('DELETE FROM links WHERE id = $1', [linkId]);
}

export async function reorderLinks(userId: string, body: ReorderLinksBody): Promise<void> {
  // Validate that all provided link IDs belong to this user
  const ids = body.links.map((l) => l.id);
  const { rows } = await query<{ id: string }>(
    `SELECT id FROM links WHERE id = ANY($1::uuid[]) AND user_id = $2`,
    [ids, userId]
  );
  if (rows.length !== ids.length) {
    throw new AppError(403, 'One or more links do not belong to you');
  }

  // Batch update sort orders in a transaction
  await withTransaction(async (client: PoolClient) => {
    for (const { id, sort_order } of body.links) {
      await client.query('UPDATE links SET sort_order = $1 WHERE id = $2 AND user_id = $3', [
        sort_order,
        id,
        userId,
      ]);
    }
  });
}

export async function recordLinkClick(
  linkId: string,
  meta: { ipAddress?: string; userAgent?: string; referer?: string }
): Promise<void> {
  // Get the user_id for this link
  const { rows } = await query<{ user_id: string }>(
    'SELECT user_id FROM links WHERE id = $1',
    [linkId]
  );
  if (rows.length === 0) return;

  const userId = rows[0].user_id;

  // Increment atomic counter on the link
  await query('UPDATE links SET click_count = click_count + 1 WHERE id = $1', [linkId]);

  // Insert click event for detailed analytics
  await query(
    `INSERT INTO link_clicks (link_id, user_id, ip_address, user_agent, referer)
     VALUES ($1, $2, $3, $4, $5)`,
    [linkId, userId, meta.ipAddress ?? null, meta.userAgent ?? null, meta.referer ?? null]
  );
}

// =============================================
// Private Helpers
// =============================================

async function assertLinkOwnership(linkId: string, userId: string): Promise<void> {
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM links WHERE id = $1 AND user_id = $2',
    [linkId, userId]
  );
  if (rows.length === 0) {
    throw new AppError(404, 'Link not found');
  }
}
