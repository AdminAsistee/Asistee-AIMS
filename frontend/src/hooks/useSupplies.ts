import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Supply, PaginatedResponse } from '../types';

const QUERY_KEY = 'supplies';

export function useSupplies() {
  return useQuery<PaginatedResponse<Supply>>({
    queryKey: [QUERY_KEY],
    queryFn: () => api.get('/api/v1/supplies').then(r => r.data),
  });
}

export function useCreateSupply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; ready_stock?: number; in_use_stock?: number; in_maintenance_stock?: number }) =>
      api.post('/api/v1/supplies', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useBuySupply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) =>
      api.put(`/api/v1/supplies/${id}/buy`, { amount }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUseSupply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }: { id: number; amount: number }) =>
      api.put(`/api/v1/supplies/${id}/use`, { amount }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
