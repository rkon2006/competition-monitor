import { useApps } from '../../features/apps/hooks/useApps';
import { AddAppForm } from '../../features/apps/components/AddAppForm/AddAppForm';
import { AppList } from '../../features/apps/components/AppList/AppList';
import s from './AppListPage.module.css';

export function AppListPage() {
  const { apps, isLoading } = useApps();

  return (
    <div className={s.root}>
      <h1 className={s.heading}>Apps List</h1>
      <AddAppForm />
      <AppList apps={apps} isLoading={isLoading} />
    </div>
  );
}
