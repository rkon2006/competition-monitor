import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useApps() {
  const { data: apps = [], isLoading, isError } = useQuery({
    queryKey: ['apps'],
    queryFn: api.apps.list,
  });

  return { apps, isLoading, isError };
}
