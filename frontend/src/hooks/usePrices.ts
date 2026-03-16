import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Price } from '../types';

export function useListPrices() {
  return useQuery<Price[]>({
    queryKey: ['prices'],
    queryFn: () => api.get('/api/v1/prices').then(r => r.data),
  });
}

export function usePrice(id: number | null) {
  return useQuery<Price>({
    queryKey: ['price', id],
    queryFn: () => api.get(`/api/v1/prices/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { total?: number; percentage?: boolean; description?: string; parent_id?: number }) =>
      api.post('/api/v1/prices/create', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['price'] });
      qc.invalidateQueries({ queryKey: ['prices'] });
    },
  });
}

export function useUpdatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; description?: string; total?: number; percentage?: boolean }) =>
      api.put(`/api/v1/prices/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prices'] }),
  });
}

export function useDeletePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/v1/prices/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prices'] }),
  });
}
