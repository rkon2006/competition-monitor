import { Link } from 'react-router-dom';
import { type App } from '../../../../shared/api/client';
import { useDeleteApp } from '../../hooks/useDeleteApp';
import s from './AppCard.module.css';
import common from '../../../../shared/styles/common.module.css';

interface Props {
  app: App;
}

export function AppCard({ app }: Props) {
  const deleteMutation = useDeleteApp();

  return (
    <div className={`${common.card} ${s.root}`}>
      <div className={s.info}>
        <div>
          <Link to={`/apps/${app.id}`}>{app.name}</Link>
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
          if (confirm(`Delete "${app.name}"?`)) deleteMutation.mutate(app.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
