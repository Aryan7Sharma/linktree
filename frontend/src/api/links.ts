import { apiClient } from './client';
import { ApiResponse, Link } from '@/types';

export const linksApi = {
  getAll: async (): Promise<Link[]> => {
    const res = await apiClient.get<ApiResponse<Link[]>>('/links');
    return res.data.data!;
  },

  create: async (data: { title: string; url: string }): Promise<Link> => {
    const res = await apiClient.post<ApiResponse<Link>>('/links', data);
    return res.data.data!;
  },

  update: async (
    id: string,
    data: Partial<{ title: string; url: string; is_active: boolean; sort_order: number }>
  ): Promise<Link> => {
    const res = await apiClient.patch<ApiResponse<Link>>(`/links/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/links/${id}`);
  },

  reorder: async (links: Array<{ id: string; sort_order: number }>): Promise<void> => {
    await apiClient.patch('/links/reorder', { links });
  },

  // Public: Get links for a username (no auth)
  getPublic: async (username: string): Promise<Link[]> => {
    const res = await apiClient.get<ApiResponse<Link[]>>(`/public/${username}/links`);
    return res.data.data!;
  },

  // Public: Track a click
  trackClick: async (linkId: string): Promise<void> => {
    await apiClient.post(`/public/click/${linkId}`);
  },
};
