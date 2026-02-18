import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { User, UserPublic, UpdateProfileBody } from '../types';

// =============================================
// Profile Service
// =============================================

export async function getProfileByUsername(username: string): Promise<UserPublic> {
  const { rows } = await query<UserPublic>(
    `SELECT username, display_name, bio, avatar_url, theme
     FROM users
     WHERE username = $1 AND is_active = true`,
    [username.toLowerCase()]
  );
  if (rows.length === 0) {
    throw new AppError(404, `Profile @${username} not found`);
  }
  return rows[0];
}

export async function getMyProfile(userId: string): Promise<Omit<User, 'password_hash'>> {
  const { rows } = await query<Omit<User, 'password_hash'>>(
    `SELECT id, email, username, display_name, bio, avatar_url, theme, is_active, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );
  if (rows.length === 0) {
    throw new AppError(404, 'User not found');
  }
  return rows[0];
}

export async function updateProfile(
  userId: string,
  body: UpdateProfileBody
): Promise<Omit<User, 'password_hash'>> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (body.display_name !== undefined) { fields.push(`display_name = $${i++}`); values.push(body.display_name); }
  if (body.bio !== undefined) { fields.push(`bio = $${i++}`); values.push(body.bio); }
  if (body.avatar_url !== undefined) { fields.push(`avatar_url = $${i++}`); values.push(body.avatar_url); }
  if (body.theme !== undefined) { fields.push(`theme = $${i++}`); values.push(body.theme); }

  if (fields.length === 0) throw new AppError(400, 'No fields to update');

  values.push(userId);
  const { rows } = await query<Omit<User, 'password_hash'>>(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${i}
     RETURNING id, email, username, display_name, bio, avatar_url, theme, is_active, created_at, updated_at`,
    values
  );
  return rows[0];
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { rows } = await query<{ id: string }>(
    'SELECT id FROM users WHERE username = $1',
    [username.toLowerCase()]
  );
  return rows.length === 0;
}

export async function recordProfileView(
  userId: string,
  meta: { ipAddress?: string; userAgent?: string; referer?: string }
): Promise<void> {
  await query(
    `INSERT INTO profile_views (user_id, ip_address, user_agent, referer)
     VALUES ($1, $2, $3, $4)`,
    [userId, meta.ipAddress ?? null, meta.userAgent ?? null, meta.referer ?? null]
  );
}
