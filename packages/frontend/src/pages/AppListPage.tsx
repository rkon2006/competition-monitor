import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import AppCard from '../components/AppCard';

export default function AppListPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [playUrl, setPlayUrl] = useState('');
  const [formError, setFormError] = useState('');

  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: api.apps.list,
    refetchInterval: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: api.apps.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setName('');
      setPlayUrl('');
      setFormError('');
    },
    onError: (err: Error) => setFormError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    createMutation.mutate({ name, play_url: playUrl });
  }

  return (
    <div style={{ maxWidth: 1400, padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Competition Monitor</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 32,
          padding: 16,
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Add App</h2>
        <input
          placeholder="App name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          placeholder="https://play.google.com/store/apps/details?id=com.example.app"
          value={playUrl}
          onChange={(e) => setPlayUrl(e.target.value)}
          required
          style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
        />
        {formError && <div style={{ color: 'red', fontSize: 13 }}>{formError}</div>}
        <button
          type="submit"
          disabled={createMutation.isPending}
          style={{ alignSelf: 'flex-start', padding: '6px 16px' }}
        >
          {createMutation.isPending ? 'Adding...' : 'Add App'}
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {apps?.length === 0 && (
        <div style={{ textAlign: 'center', color: '#888', padding: 48 }}>
          No apps yet. Add your first competitor above.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {apps?.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
