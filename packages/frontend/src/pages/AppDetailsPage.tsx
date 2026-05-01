import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import ScreenshotTimeline from '../components/ScreenshotTimeline';

export function AppDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: app, isLoading } = useQuery({
    queryKey: ['apps', id],
    queryFn: () => api.apps.list().then((apps) => apps.find((a) => a.id === id) ?? null),
    enabled: !!id,
  });

  if (isLoading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!app)
    return (
      <div style={{ padding: 24 }}>
        App not found. <button onClick={() => navigate('/')}>Go back</button>
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/')}
        >
          All Apps
        </span>
        {' / '}
        {app.name}
      </div>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>{app.name}</h1>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          {app.packageName} · {app._count.screenshots} screenshot
          {app._count.screenshots !== 1 ? 's' : ''}
        </div>
        <a
          href={app.playUrl}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 13, color: '#007bff' }}
        >
          View on Google Play ↗
        </a>
      </div>

      <ScreenshotTimeline appId={app.id} />
    </div>
  );
}
