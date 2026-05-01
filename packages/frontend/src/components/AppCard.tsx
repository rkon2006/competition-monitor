import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type App } from '../api/client';

interface Props {
  app: App;
}

export function AppCard({ app }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.apps.delete(app.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });

  return (
    <div
      style={{
        border: '1px solid #ddd',
        justifyContent: 'space-between',
        borderRadius: 8,
        padding: 16,
        display: 'flex',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <a href={`/apps/${app.id}`}>{app.name}</a>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{app.packageName}</div>
        </div>

        <div style={{ fontSize: 12, color: '#888' }}>
          {app._count.screenshots} screenshot{app._count.screenshots !== 1 ? 's' : ''}
          {app.latestScreenshot && (
            <> · Last: {new Date(app.latestScreenshot.takenAt).toLocaleString()}</>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            if (confirm(`Delete "${app.name}"?`)) deleteMutation.mutate();
          }}
          style={{ color: 'red' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
