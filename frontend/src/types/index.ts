// =============================================
// Domain Types — mirrors backend types
// =============================================

export type ThemeType = 'classic' | 'dark' | 'nature' | 'sunset' | 'ocean' | 'purple';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPublic {
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeType;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  is_active: boolean;
  sort_order: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

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
// Auth Types
// =============================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

// =============================================
// API Types
// =============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

// =============================================
// Theme Configuration
// =============================================

export interface ThemeConfig {
  bg: string;
  button: string;
  text: string;
  buttonText: string;
  label: string;
}
