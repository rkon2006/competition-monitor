import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.apps.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}
