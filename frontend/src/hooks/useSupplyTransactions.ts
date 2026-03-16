import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { SupplyTransaction, PaginatedResponse } from '../types';

const QUERY_KEY = 'supply-transactions';

export function useSupplyTransactions(supplyId?: number) {
  return useQuery<PaginatedResponse<SupplyTransaction>>({
    queryKey: [QUERY_KEY, supplyId],
    queryFn: () => {
      const url = supplyId
        ? `/api/v1/supplies_transactions?supply_id=${supplyId}`
        : '/api/v1/supplies_transactions';
      return api.get(url).then(r => r.data);
    },
    enabled: supplyId !== undefined,
  });
}

export function useCreateSupplyTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { supply_id: number; cleaning_id?: number; type?: string; amount?: number }) =>
      api.post('/api/v1/supplies_transactions', data).then(r => r.data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      // Also refetch the cleaning detail so supply list updates immediately
      if (vars.cleaning_id) {
        qc.refetchQueries({ queryKey: ['cleaning', vars.cleaning_id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(vars.cleaning_id)] });
      }
    },
  });
}

export function useFulfillTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.put(`/api/v1/supplies_transactions/${id}/fulfill`).then(r => r.data),
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: [QUERY_KEY] });
      if (data?.cleaning_id) {
        qc.refetchQueries({ queryKey: ['cleaning', data.cleaning_id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(data.cleaning_id)] });
      }
    },
  });
}

export function useDeliverTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.put(`/api/v1/supplies_transactions/${id}/deliver`).then(r => r.data),
    onSuccess: (data) => {
      qc.refetchQueries({ queryKey: [QUERY_KEY] });
      if (data?.cleaning_id) {
        qc.refetchQueries({ queryKey: ['cleaning', data.cleaning_id] });
        qc.refetchQueries({ queryKey: ['cleaning', String(data.cleaning_id)] });
      }
    },
  });
}
