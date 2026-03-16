import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { PaginatedResponse } from '../types';

/** Lightweight shape returned by GET /api/v1/locations for the booking picker */
export interface LocationOption {
  id: number;
  building_name: string;
  room_number: number;
  listings: { id: number }[];
}

/**
 * Fetches all locations (up to 100) and returns them as dropdown options.
 * Each location has its linked listing IDs from the eager-loaded `listings` relation.
 */
export function useLocationOptions() {
  return useQuery<PaginatedResponse<LocationOption>>({
    queryKey: ['location-options'],
    queryFn: () =>
      api.get('/api/v1/locations?page=1&per_page=100').then(r => r.data),
    staleTime: 60_000,
  });
}
