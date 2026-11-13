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

export function useApps() {
  const [apps, setApps] = useState<WebAppItem[]>(readStoredApps);

  // Ensure bright light theme is always active and clear any stale dark class
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('apphub_theme_v1');
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

  return {
    apps,
    addApp,
    updateApp,
    deleteApp,
  };
}
