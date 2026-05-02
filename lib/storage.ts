// Type definitions
export interface User {
  email: string;
  name: string;
}

export interface CritiqueIssue {
  severity: 'critical' | 'warning' | 'minor';
  title: string;
  area: string;
  description: string;
  fix: string;
  impact: string;
}

export interface Critique {
  id: string;
  timestamp: number;
  imagePreview: string;
  overall_score: number;
  summary: string;
  dimensions: {
    clarity: number;
    hierarchy: number;
    trust: number;
    conversion: number;
  };
  issues: CritiqueIssue[];
}

interface UserRecord {
  password: string;
  name: string;
  createdAt: number;
}

// Storage keys
const KEYS = {
  users: 'crit:users',
  session: 'crit:session',
  history: 'crit:history',
};

// Helpers — defensive against SSR and missing localStorage
const isClient = () => typeof window !== 'undefined';

const get = <T>(key: string, fallback: T): T => {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const set = <T>(key: string, value: T): void => {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently fail */
  }
};

const remove = (key: string): void => {
  if (!isClient()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

// Auth
export const getUsers = (): Record<string, UserRecord> =>
  get<Record<string, UserRecord>>(KEYS.users, {});

export const setUsers = (users: Record<string, UserRecord>): void =>
  set(KEYS.users, users);

export const getSession = (): User | null => get<User | null>(KEYS.session, null);

export const setSession = (user: User): void => set(KEYS.session, user);

export const clearSession = (): void => remove(KEYS.session);

// History
export const getHistory = (): Critique[] => get<Critique[]>(KEYS.history, []);

export const addToHistory = (critique: Critique): void => {
  const history = getHistory();
  history.unshift(critique);
  set(KEYS.history, history.slice(0, 50));
};

export const clearHistory = (): void => remove(KEYS.history);

// Helper: format a relative time
export const timeAgo = (ts: number): string => {
  const d = Date.now() - ts;
  if (d < 60000) return 'just now';
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
};
