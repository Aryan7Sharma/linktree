import { Request } from 'express';

// =============================================
// Domain Types
// =============================================

export type ThemeType =
  | 'classic'
  | 'dark'
  | 'nature'
  | 'sunset'
  | 'ocean'
  | 'purple';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme: ThemeType;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface LinkAnalytics {
  id: string;
  link_id: string;
  clicked_at: Date;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  country: string | null;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked: boolean;
  created_at: Date;
}

// =============================================
// Auth Types
// =============================================

export interface JwtPayload {
  sub: string; // user id
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens extends TokenPair {
  expiresIn: number;
}

// =============================================
// Request Types (Express augmentation)
// =============================================

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

// =============================================
// API Response Types
// =============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
  pagination?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// =============================================
// Request Body Types
// =============================================

export interface RegisterBody {
  email: string;
  username: string;
  password: string;
  display_name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RefreshTokenBody {
  refreshToken: string;
}

export interface CreateLinkBody {
  title: string;
  url: string;
}

export interface UpdateLinkBody {
  title?: string;
  url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ReorderLinksBody {
  links: Array<{ id: string; sort_order: number }>;
}

export interface UpdateProfileBody {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: ThemeType;
}
