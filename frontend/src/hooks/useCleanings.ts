import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Cleaning, PaginatedResponse, User } from '../types';

const QUERY_KEY = 'cleanings';

export function useCleanings(page = 1) {
  return useQuery<PaginatedResponse<Cleaning>>({
    queryKey: [QUERY_KEY, page],
    queryFn: () => api.get(`/api/v1/cleanings?page=${page}`).then(r => r.data),
  });
}

export function useCleanerUsers() {
  return useQuery<User[]>({
    queryKey: ['cleaner-users'],
    queryFn: () => api.get('/api/v1/cleaner-users').then(r => r.data),
  });
}

export function useCreateCleaning() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { location_id: number; cleaning_date: string; cleaner_id?: number }) =>
      api.post('/api/v1/cleanings/create', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useAssignCleaner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { cleaningId: number; cleanerId: number }) =>
      api.put('/api/v1/assign-cleaner', data).then(r => r.data),
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: [QUERY_KEY] });
      if (data?.id) {
        qc.refetchQueries({ queryKey: ['cleaning', data.id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(data.id)] });
      }
    },
  });
}

export function useUnassignCleaner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cleaningId: number) =>
      api.put('/api/v1/unassign-cleaner', { cleaningId }).then(r => r.data),
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: [QUERY_KEY] });
      if (data?.id) {
        qc.refetchQueries({ queryKey: ['cleaning', data.id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(data.id)] });
      }
    },
  });
}

export function useAssignMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cleaningId: number) =>
      api.put('/api/v1/assign-me', { cleaningId }).then(r => r.data),
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: [QUERY_KEY] });
      if (data?.id) {
        qc.refetchQueries({ queryKey: ['cleaning', data.id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(data.id)] });
      }
    },
  });
}
