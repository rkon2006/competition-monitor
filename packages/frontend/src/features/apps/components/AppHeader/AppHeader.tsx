import { type App } from '../../../../shared/api/client';
import s from './AppHeader.module.css';
import common from '../../../../shared/styles/common.module.css';

interface Props {
  app: App;
}

export function AppHeader({ app }: Props) {
  return (
    <div className={s.root}>
      <h1 className={s.title}>{app.name}</h1>
      <div className={common.meta} style={{ marginTop: 4 }}>
        {app.packageName} · {app._count.screenshots} screenshot
        {app._count.screenshots !== 1 ? 's' : ''}
      </div>
      <a href={app.playUrl} target="_blank" rel="noreferrer" className={s.playLink}>
        View on Google Play ↗
      </a>
    </div>
  );
}
