import { AppState, Filters, UserProfile, UserSession } from "@/types";

const KEY = "glowup-v2";

type Persisted = {
  currentUser: UserProfile | null;
  filters: Filters;
  sessions: Record<string, UserSession>;
};

export function loadState(): Partial<AppState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  const toSave: Persisted = {
    currentUser: state.currentUser,
    filters: state.filters,
    sessions: state.sessions,
  };
  localStorage.setItem(KEY, JSON.stringify(toSave));
}
