import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { AppCard } from '../../components/AppCard';
import s from './AppListPage.module.css';
import common from '../styles/common.module.css';

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
    <div className={s.root}>
      <h1 className={s.heading}>Competition Monitor</h1>

      <form onSubmit={handleSubmit} className={`${common.card} ${s.form}`}>
        <h2 className={s.formTitle}>Add App</h2>
        <input
          className={common.input}
          placeholder="App name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={common.input}
          placeholder="https://play.google.com/store/apps/details?id=com.example.app"
          value={playUrl}
          onChange={(e) => setPlayUrl(e.target.value)}
          required
        />
        {formError && <div className={common.errorText}>{formError}</div>}
        <button type="submit" disabled={createMutation.isPending} className={s.submitBtn}>
          {createMutation.isPending ? 'Adding...' : 'Add App'}
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {apps?.length === 0 && (
        <div className={common.empty}>No apps yet. Add your first competitor above.</div>
      )}
      <div className={s.list}>
        {apps?.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
