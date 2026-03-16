import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Booking } from '../types';

export function useBookingDetail(id: number | string) {
  return useQuery<Booking>({
    queryKey: ['booking', id],
    queryFn: () => api.get(`/api/v1/bookings/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useUpdateBookingDetail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Booking> & { id: number }) =>
      api.put(`/api/v1/bookings/${id}`, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['booking', String(id)] });
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
