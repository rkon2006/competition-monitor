import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/client';

export function useDeleteApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.apps.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });
}
