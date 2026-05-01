import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api/client';

export function useCreateApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.apps.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}
