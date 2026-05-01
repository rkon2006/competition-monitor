import { type App } from '../../../../shared/api/client';
import { AppCard } from '../AppCard/AppCard';
import s from './AppList.module.css';
import common from '../../../../shared/styles/common.module.css';

interface Props {
  apps: App[];
  isLoading: boolean;
}

export function AppList({ apps, isLoading }: Props) {
  if (isLoading) return <div>Loading...</div>;

  if (apps.length === 0) {
    return <div className={common.empty}>No apps yet. Add your first competitor above.</div>;
  }

  return (
    <div className={s.list}>
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
