import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { linksApi } from '@/api/links';
import { Link } from '@/types';
import { useAuthStore } from '@/store/authStore';

const LINKS_KEY = ['links'];

export function useLinks() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: LINKS_KEY,
    queryFn: linksApi.getAll,
    enabled: isAuthenticated,
  });
}

export function usePublicLinks(username: string) {
  return useQuery({
    queryKey: ['links', 'public', username],
    queryFn: () => linksApi.getPublic(username),
    enabled: !!username,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linksApi.create,
    onSuccess: (newLink) => {
      queryClient.setQueryData<Link[]>(LINKS_KEY, (old = []) => [newLink, ...old]);
      toast.success('Link added');
    },
    onError: () => toast.error('Failed to add link'),
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof linksApi.update>[1] }) =>
      linksApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Link[]>(LINKS_KEY, (old = []) =>
        old.map((l) => (l.id === updated.id ? updated : l))
      );
    },
    onError: () => toast.error('Failed to update link'),
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linksApi.delete,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Link[]>(LINKS_KEY, (old = []) => old.filter((l) => l.id !== id));
      toast.success('Link removed');
    },
    onError: () => toast.error('Failed to delete link'),
  });
}

export function useReorderLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linksApi.reorder,
    onError: () => {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: LINKS_KEY });
      toast.error('Failed to save order');
    },
  });
}
