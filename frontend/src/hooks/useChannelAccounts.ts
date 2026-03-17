import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { ChannelAccount, SyncResult } from '../types';

// ─── Fetch all channel accounts ───────────────────────────────────────────────
export function useChannelAccounts() {
  return useQuery<ChannelAccount[]>({
    queryKey: ['channel-accounts'],
    queryFn: async () => {
      const res = await api.get('/api/v1/channel-accounts');
      return res.data;
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────
export function useCreateChannelAccount() {
  const qc = useQueryClient();
  return useMutation<ChannelAccount, Error, Partial<ChannelAccount>>({
    mutationFn: (data) => api.post('/api/v1/channel-accounts', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channel-accounts'] }),
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export function useUpdateChannelAccount() {
  const qc = useQueryClient();
  return useMutation<ChannelAccount, Error, { id: number } & Partial<ChannelAccount>>({
    mutationFn: ({ id, ...data }) => api.put(`/api/v1/channel-accounts/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channel-accounts'] }),
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export function useDeleteChannelAccount() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/api/v1/channel-accounts/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['channel-accounts'] }),
  });
}

// ─── Sync a listing via iCal ──────────────────────────────────────────────────
export function useSyncListing() {
  const qc = useQueryClient();
  return useMutation<SyncResult, Error, number>({
    mutationFn: (listingId) =>
      api.post(`/api/v1/channel-sync/${listingId}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['cleanings'] });
      qc.invalidateQueries({ queryKey: ['locations'] });
    },
  });
}
