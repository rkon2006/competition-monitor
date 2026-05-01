import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

interface Props {
  appId: string;
}

export default function ScreenshotTimeline({ appId }: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['screenshots', appId, page],
    queryFn: () => api.screenshots.list(appId, page),
    refetchInterval: 30_000,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data || data.data.length === 0)
    return <div style={{ color: '#888', padding: 32, textAlign: 'center' }}>No screenshots yet.</div>;

  return (
    <div>
      {data.data.map((s) => (
        <div
          key={s.id}
          style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}
        >
          <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
            {new Date(s.takenAt).toLocaleString()}
          </div>
          <img
            src={s.imageUrl}
            alt={`Screenshot ${new Date(s.takenAt).toLocaleString()}`}
            style={{ width: '100%', borderRadius: 4, cursor: 'pointer', display: 'block' }}
            onClick={() => window.open(s.imageUrl, '_blank')}
          />
        </div>
      ))}

      {data.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: 16 }}>
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Previous</button>
          <span style={{ fontSize: 13, color: '#555' }}>
            Page {page} of {data.totalPages} ({data.total} total)
          </span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === data.totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}
