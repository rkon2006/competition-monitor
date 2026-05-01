import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type App } from '../../../../shared/api/client';
import s from './AppCard.module.css';
import common from '../../../../shared/styles/common.module.css';

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
    <div className={`${common.card} ${s.root}`}>
      <div className={s.info}>
        <div>
          <a href={`/apps/${app.id}`}>{app.name}</a>
          <div className={s.packageName}>{app.packageName}</div>
        </div>
        <div className={common.meta}>
          {app._count.screenshots} screenshot{app._count.screenshots !== 1 ? 's' : ''}
          {app.latestScreenshot && (
            <> · Last: {new Date(app.latestScreenshot.takenAt).toLocaleString()}</>
          )}
        </div>
      </div>

      <button
        className={s.deleteBtn}
        onClick={() => {
          if (confirm(`Delete "${app.name}"?`)) deleteMutation.mutate();
        }}
      >
        Delete
      </button>
    </div>
  );
}
