export interface App {
  id: string;
  name: string;
  playUrl: string;
  packageName: string;
  createdAt: string;
  updatedAt: string;
  _count: { screenshots: number };
  latestScreenshot: {
    id: string;
    takenAt: string;
  } | null;
}

export interface Screenshot {
  id: string;
  appId: string;
  takenAt: string;
  imageUrl: string;
}

export interface ScreenshotsResponse {
  data: Screenshot[];
  total: number;
  page: number;
  totalPages: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  apps: {
    list: () => request<App[]>('/api/apps'),
    get: (id: string) => request<App>(`/api/apps/${id}`),
    create: (body: { name: string; play_url: string }) =>
      request<App>('/api/apps', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: { name?: string }) =>
      request<App>(`/api/apps/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/api/apps/${id}`, { method: 'DELETE' }),
  },
  screenshots: {
    list: (appId: string, page = 1, limit = 20) =>
      request<ScreenshotsResponse>(`/api/apps/${appId}/screenshots?page=${page}&limit=${limit}`),
  },
};
