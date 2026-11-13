import { useCallback, useEffect, useState } from 'react';
import type { WebAppItem } from '../types/app';

const APPS_STORAGE_KEY = 'apphub_items_v1';

function readStoredApps(): WebAppItem[] {
  try {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sanitizeApps(input: unknown): WebAppItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Record<string, unknown>).name === 'string' &&
        typeof (item as Record<string, unknown>).url === 'string',
    )
    .map((item, index) => ({
      id:
        typeof item.id === 'string' && item.id
          ? item.id
          : `app-${Date.now()}-${index}`,
      name: String(item.name).trim(),
      url: String(item.url).trim(),
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : '',
      createdAt:
        typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    }));
}

export function useApps() {
  const [apps, setApps] = useState<WebAppItem[]>(readStoredApps);

  // Ensure bright light theme is always active and clear any stale dark class
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('apphub_theme_v1');
  }, []);

  // Load shared apps-data.json on fresh browsers if localStorage has no apps yet
  useEffect(() => {
    const raw = localStorage.getItem(APPS_STORAGE_KEY);
    const hasLocalApps = raw !== null && readStoredApps().length > 0;
    if (hasLocalApps) return;

    let cancelled = false;
    fetch('/apps-data.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        const loaded = sanitizeApps(data);
        if (loaded.length > 0) {
          setApps(loaded);
        }
      })
      .catch(() => {
        // Ignore if apps-data.json is unavailable
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // Ignore storage quota overflow edge cases silently
    }
  }, [apps]);

  const addApp = useCallback(
    (input: Omit<WebAppItem, 'id' | 'createdAt'>) => {
      const next: WebAppItem = {
        ...input,
        id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      setApps((prev) => [next, ...prev]);
    },
    [],
  );

  const updateApp = useCallback(
    (id: string, patch: Partial<Omit<WebAppItem, 'id' | 'createdAt'>>) => {
      setApps((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const deleteApp = useCallback((id: string) => {
    setApps((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const importApps = useCallback((rawJson: unknown): number => {
    const incoming = sanitizeApps(rawJson);
    if (incoming.length === 0) {
      throw new Error('Tệp không có dữ liệu ứng dụng hợp lệ.');
    }
    setApps((prev) => {
      const existingKeys = new Set(
        prev.map((item) => `${item.name.toLowerCase()}|${item.url.toLowerCase()}`),
      );
      const uniqueIncoming = incoming.filter(
        (item) =>
          !existingKeys.has(
            `${item.name.toLowerCase()}|${item.url.toLowerCase()}`,
          ),
      );
      return [...uniqueIncoming, ...prev];
    });
    return incoming.length;
  }, []);

  return {
    apps,
    addApp,
    updateApp,
    deleteApp,
    importApps,
  };
}
