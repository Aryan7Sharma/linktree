import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileApi } from '@/api/profile';
import { useAuthStore } from '@/store/authStore';
import { ThemeType } from '@/types';

export function useMyProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getMe,
    enabled: isAuthenticated,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ['profile', 'public', username],
    queryFn: () => profileApi.getPublic(username),
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.updateMe,
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.setQueryData(['profile', 'me'], updated);
      toast.success('Profile saved');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}

export function useUpdateTheme() {
  const { mutate } = useUpdateProfile();
  return (theme: ThemeType) => mutate({ theme });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: profileApi.getAnalytics,
  });
}
