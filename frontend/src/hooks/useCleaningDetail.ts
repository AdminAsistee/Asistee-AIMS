import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Cleaning } from '../types';

export function useCleaningDetail(id: number | string) {
  return useQuery<Cleaning>({
    queryKey: ['cleaning', id],
    queryFn: () => api.get(`/api/v1/cleanings/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useUpdateCleaningDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Cleaning> & { id: number }) =>
      api.put(`/api/v1/cleanings/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.refetchQueries({ queryKey: ['cleaning', String(id)] });
      qc.refetchQueries({ queryKey: ['cleaning', id] });
      qc.invalidateQueries({ queryKey: ['cleanings'] });
    },
  });
}
