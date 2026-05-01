import { useState } from 'react';
import { useCreateApp } from '../../hooks/useCreateApp';

export const useAddAppForm = () => {
  const [name, setName] = useState('');
  const [playUrl, setPlayUrl] = useState('');
  const [error, setError] = useState('');

  const mutation = useCreateApp();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    mutation.mutate(
      { name, play_url: playUrl },
      {
        onSuccess: () => {
          setName('');
          setPlayUrl('');
          setError('');
        },
        onError: (err: Error) => setError(err.message),
      },
    );
  }

  return {
    name,
    setName,
    playUrl,
    setPlayUrl,
    error,
    handleSubmit,
    isMutationPending: mutation.isPending,
  };
};
