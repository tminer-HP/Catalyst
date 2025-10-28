import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  type: 'vertical' | 'project' | 'innovation' | 'ai';
  title: string;
  path: string;
  timestamp: number;
}

const HISTORY_KEY = 'catalyst_search_history';
const MAX_HISTORY_ITEMS = 20;
const HISTORY_UPDATE_EVENT = 'catalyst_history_update';

function getStoredHistory(): HistoryItem[] {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse history:', e);
      return [];
    }
  }
  return [];
}

function saveHistory(history: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATE_EVENT));
}

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(getStoredHistory);

  useEffect(() => {
    const handleUpdate = () => {
      setHistory(getStoredHistory());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) {
        setHistory(getStoredHistory());
      }
    };

    window.addEventListener(HISTORY_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener(HISTORY_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    const current = getStoredHistory();
    const filtered = current.filter(h => h.path !== item.path);
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(updated);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATE_EVENT));
  };

  return { history, addToHistory, clearHistory };
}
