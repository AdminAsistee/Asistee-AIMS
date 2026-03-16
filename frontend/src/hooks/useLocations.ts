import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Location, PaginatedResponse } from '../types';

const QUERY_KEY = 'locations';

export function useLocations(page = 1) {
  return useQuery<PaginatedResponse<Location>>({
    queryKey: [QUERY_KEY, page],
    queryFn: () => api.get(`/api/v1/locations?page=${page}`).then(r => r.data),
  });
}

export function useLocationDetail(id: number | null) {
  return useQuery<Location>({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => api.get(`/api/v1/locations/${id}`).then(r => r.data),
    enabled: id !== null,
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Location, 'id' | 'owner' | 'photos' | 'listings' | 'created_at' | 'updated_at'>) =>
      api.post('/api/v1/locations/create', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUploadPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ locationId, file }: { locationId: number; file: File }) => {
      const form = new FormData();
      form.append('photo', file);
      return api.post(`/api/v1/locations-photo/${locationId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(r => r.data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Location> & { id: number }) =>
      api.put(`/api/v1/locations/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/v1/locations/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId: number) =>
      api.delete(`/api/v1/locations-photo/${photoId}`).then(r => r.data),
    onSuccess: () => {
      // Invalidate location queries (drawer refreshes)
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      // Also invalidate cleaning queries — CleaningDetail embeds location.photos
      qc.invalidateQueries({ queryKey: ['cleaning'] });
      qc.invalidateQueries({ queryKey: ['cleanings'] });
    },
  });
}
