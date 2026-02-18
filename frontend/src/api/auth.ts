import { apiClient } from './client';
import { ApiResponse, AuthResult, AuthTokens } from '@/types';

export const authApi = {
  register: async (data: {
    email: string;
    username: string;
    password: string;
    display_name?: string;
  }): Promise<AuthResult> => {
    const res = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResult> => {
    const res = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', data);
    return res.data.data!;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const res = await apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    return res.data.data!;
  },

  logout: async (refreshToken?: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
