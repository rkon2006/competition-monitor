import { useParams, useNavigate } from 'react-router-dom';
import { useAppDetails } from '../../features/apps/hooks/useAppDetails';
import { AppHeader } from '../../features/apps/components/AppHeader/AppHeader';
import { ScreenshotTimeline } from '../../features/apps/components/ScreenshotTimeline/ScreenshotTimeline';
import s from './AppDetailsPage.module.css';
import common from '../../shared/styles/common.module.css';

export function AppDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { app, isLoading } = useAppDetails(id);

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

      <AppHeader app={app} />
      <ScreenshotTimeline appId={app.id} />
    </div>
  );
}
