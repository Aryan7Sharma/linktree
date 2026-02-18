-- =============================================
-- OrangeLink - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255)  NOT NULL UNIQUE,
  username      VARCHAR(30)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  display_name  VARCHAR(50),
  bio           VARCHAR(280),
  avatar_url    TEXT,
  theme         VARCHAR(20)   NOT NULL DEFAULT 'classic'
                              CHECK (theme IN ('classic', 'dark', 'nature', 'sunset', 'ocean', 'purple')),
  is_active     BOOLEAN       NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);

-- =============================================
-- LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS links (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(100)  NOT NULL,
  url         TEXT          NOT NULL,
  is_active   BOOLEAN       NOT NULL DEFAULT true,
  sort_order  INTEGER       NOT NULL DEFAULT 0,
  click_count INTEGER       NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes for efficient per-user link retrieval
CREATE INDEX IF NOT EXISTS idx_links_user_id    ON links (user_id);
CREATE INDEX IF NOT EXISTS idx_links_sort_order ON links (user_id, sort_order);

-- =============================================
-- LINK ANALYTICS TABLE
-- Stores individual click events for detailed analytics
-- =============================================
CREATE TABLE IF NOT EXISTS link_clicks (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id     UUID          NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  ip_address  INET,
  user_agent  TEXT,
  referer     TEXT,
  country     VARCHAR(2)    -- ISO 3166-1 alpha-2 (future GeoIP support)
);

-- Partition-friendly time-based index
CREATE INDEX IF NOT EXISTS idx_link_clicks_link_id    ON link_clicks (link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks (clicked_at);
CREATE INDEX IF NOT EXISTS idx_link_clicks_user_id    ON link_clicks (user_id);

-- =============================================
-- PROFILE VIEWS TABLE
-- Tracks page views for the public profile
-- =============================================
CREATE TABLE IF NOT EXISTS profile_views (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  ip_address  INET,
  user_agent  TEXT,
  referer     TEXT
);

CREATE INDEX IF NOT EXISTS idx_profile_views_user_id  ON profile_views (user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views (viewed_at);

-- =============================================
-- REFRESH TOKENS TABLE
-- Stores hashed refresh tokens for rotation
-- =============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(64)   NOT NULL UNIQUE, -- SHA-256 hex digest
  expires_at  TIMESTAMPTZ   NOT NULL,
  revoked     BOOLEAN       NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id    ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);

-- =============================================
-- TRIGGER: Auto-update updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================
-- SEED: Demo user (password: Demo1234!)
-- =============================================
INSERT INTO users (email, username, password_hash, display_name, bio, avatar_url, theme)
VALUES (
  'demo@orangelink.io',
  'demo',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewKyQLSomething', -- placeholder hash
  'OrangeLink Demo',
  'Digital Creator | Filmmaker | Coffee Lover',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=OrangeLink',
  'nature'
) ON CONFLICT DO NOTHING;
