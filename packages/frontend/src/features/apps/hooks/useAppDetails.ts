import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useAppDetails(id: string | undefined) {
  const { data: app, isLoading } = useQuery({
    queryKey: ['apps', id],
    queryFn: () => api.apps.get(id!),
    enabled: !!id,
  });

  return { app, isLoading };
}
