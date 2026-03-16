import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { User, UserType, PaginatedResponse } from '../types';

const QUERY_KEY = 'users';

export function useUsers(page = 1) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: [QUERY_KEY, page],
    queryFn: () => api.get(`/api/v1/users?page=${page}`).then(r => r.data),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; type: UserType }) =>
      api.post('/api/v1/users/admin-create', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<User> & { id: number }) =>
      api.put(`/api/v1/users/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/users/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
