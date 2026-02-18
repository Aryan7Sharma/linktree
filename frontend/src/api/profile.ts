import { apiClient } from './client';
import { ApiResponse, User, UserPublic, ThemeType, AnalyticsSummary } from '@/types';

export const profileApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/profile/me');
    return res.data.data!;
  },

  updateMe: async (data: {
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    theme?: ThemeType;
  }): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>('/profile/me', data);
    return res.data.data!;
  },

  getPublic: async (username: string): Promise<UserPublic> => {
    const res = await apiClient.get<ApiResponse<UserPublic>>(`/public/${username}`);
    return res.data.data!;
  },

  checkUsername: async (username: string): Promise<boolean> => {
    const res = await apiClient.get<ApiResponse<{ available: boolean }>>(
      `/profile/check/${username}`
    );
    return res.data.data!.available;
  },

  getAnalytics: async (): Promise<AnalyticsSummary> => {
    const res = await apiClient.get<ApiResponse<AnalyticsSummary>>('/analytics/summary');
    return res.data.data!;
  },
};
