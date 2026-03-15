import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Booking, PaginatedResponse } from '../types';

const QUERY_KEY = 'bookings';

export function useBookings(page = 1) {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: [QUERY_KEY, page],
    queryFn: () => api.get(`/api/v1/bookings?page=${page}`).then(r => r.data),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Booking>) => api.post('/api/v1/bookings', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUpdateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Booking> & { id: number }) =>
      api.put(`/api/v1/bookings/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/v1/bookings/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
