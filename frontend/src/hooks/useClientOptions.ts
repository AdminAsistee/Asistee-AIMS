import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface ClientOption {
  id: number;
  name: string;
  email: string;
}

export function useClientOptions() {
  return useQuery<ClientOption[]>({
    queryKey: ['client-options'],
    queryFn: () =>
      api.get('/api/v1/users?type=client&per_page=200').then(r =>
        (r.data?.data ?? r.data ?? []).filter((u: any) => u.type === 'client')
      ),
    staleTime: 60_000,
  });
}
