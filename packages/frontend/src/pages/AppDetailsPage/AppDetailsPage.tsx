import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import ScreenshotTimeline from '../../components/ScreenshotTimeline';
import s from './AppDetailsPage.module.css';
import common from '../../styles/common.module.css';

export function AppDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: app, isLoading } = useQuery({
    queryKey: ['apps', id],
    queryFn: () => api.apps.list().then((apps) => apps.find((a) => a.id === id) ?? null),
    enabled: !!id,
  });

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!app) {
    return (
      <div style={{ padding: 24 }}>
        App not found. <button onClick={() => navigate('/')}>Go back</button>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <div className={`${s.breadcrumb} ${common.meta}`}>
        <span className={s.breadcrumbLink} onClick={() => navigate('/')}>
          All Apps
        </span>
        {' / '}
        {app.name}
      </div>

      <div className={s.header}>
        <h1 className={s.headerTitle}>{app.name}</h1>
        <div className={`${s.headerTitle} ${common.meta}`} style={{ marginTop: 4 }}>
          {app.packageName} · {app._count.screenshots} screenshot
          {app._count.screenshots !== 1 ? 's' : ''}
        </div>
        <a href={app.playUrl} target="_blank" rel="noreferrer" className={s.playLink}>
          View on Google Play ↗
        </a>
      </div>

      <ScreenshotTimeline appId={app.id} />
    </div>
  );
}
