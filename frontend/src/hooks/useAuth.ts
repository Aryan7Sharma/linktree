import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/admin');
      toast.success(`Welcome back, ${data.user.display_name ?? data.user.username}!`);
    },
    onError: () => {
      toast.error('Invalid email or password');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      navigate('/admin');
      toast.success('Account created! Welcome to OrangeLink.');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Registration failed');
    },
  });
}

export function useLogout() {
  const { clearAuth, refreshToken } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? undefined),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/');
    },
  });
}
