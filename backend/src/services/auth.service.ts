import { query, withTransaction } from '../config/database';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateTokenPair, hashToken, getTokenExpiry, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import { User, RegisterBody, LoginBody, AuthTokens } from '../types';
import { env } from '../config/env';

interface AuthResult {
  user: Omit<User, 'password_hash'>;
  tokens: AuthTokens;
}

// =============================================
// Auth Service
// =============================================

export async function registerUser(body: RegisterBody): Promise<AuthResult> {
  const { email, username, password, display_name } = body;

  // Check uniqueness
  const { rows: existing } = await query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1',
    [email.toLowerCase(), username.toLowerCase()]
  );
  if (existing.length > 0) {
    throw new AppError(409, 'Email or username is already taken');
  }

  const passwordHash = await hashPassword(password);

  const { rows } = await query<User>(
    `INSERT INTO users (email, username, password_hash, display_name, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, username, display_name, bio, avatar_url, theme, is_active, created_at, updated_at`,
    [
      email.toLowerCase(),
      username.toLowerCase(),
      passwordHash,
      display_name ?? null,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    ]
  );

  const user = rows[0];
  const tokens = await createTokenPair(user.id, user.username, user.email);

  return { user, tokens };
}

export async function loginUser(body: LoginBody): Promise<AuthResult> {
  const { email, password } = body;

  const { rows } = await query<User & { password_hash: string }>(
    'SELECT * FROM users WHERE email = $1 AND is_active = true LIMIT 1',
    [email.toLowerCase()]
  );

  if (rows.length === 0) {
    throw new AppError(401, 'Invalid email or password');
  }

  const user = rows[0];
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = await createTokenPair(user.id, user.username, user.email);

  // Omit password_hash from response
  const { password_hash: _ph, ...safeUser } = user;
  return { user: safeUser as Omit<User, 'password_hash'>, tokens };
}

export async function refreshAccessToken(rawRefreshToken: string): Promise<AuthTokens> {
  // Verify JWT signature first
  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const tokenHash = hashToken(rawRefreshToken);

  // Check the token exists, is not revoked, and has not expired
  const { rows } = await query<{ id: string; expires_at: Date; revoked: boolean }>(
    `SELECT id, expires_at, revoked FROM refresh_tokens
     WHERE token_hash = $1 AND user_id = $2`,
    [tokenHash, payload.sub]
  );

  if (rows.length === 0 || rows[0].revoked || new Date(rows[0].expires_at) < new Date()) {
    throw new AppError(401, 'Refresh token is invalid, revoked, or expired');
  }

  // Token rotation: revoke old, issue new pair
  return withTransaction(async (client) => {
    await client.query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [rows[0].id]);
    return createTokenPair(payload.sub, payload.username, payload.email);
  });
}

export async function logoutUser(userId: string, rawRefreshToken?: string): Promise<void> {
  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1 AND user_id = $2', [
      tokenHash,
      userId,
    ]);
  } else {
    // Revoke ALL refresh tokens for this user (logout everywhere)
    await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
  }
}

// =============================================
// Private helpers
// =============================================

async function createTokenPair(userId: string, username: string, email: string): Promise<AuthTokens> {
  const { accessToken, refreshToken } = generateTokenPair({ sub: userId, username, email });
  const tokenHash = hashToken(refreshToken);
  const expiresAt = getTokenExpiry(env.JWT_REFRESH_EXPIRES_IN);

  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  // Parse access token expiry as seconds
  const match = env.JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  const expiresIn = match ? parseInt(match[1], 10) * multipliers[match[2]] : 900;

  return { accessToken, refreshToken, expiresIn };
}
