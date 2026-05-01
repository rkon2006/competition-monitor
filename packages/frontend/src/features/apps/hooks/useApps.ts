import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useApps() {
  const { data: apps = [], isLoading, isError } = useQuery({
    queryKey: ['apps'],
    queryFn: api.apps.list,
    refetchInterval: 30_000,
  });

  return { apps, isLoading, isError };
}
