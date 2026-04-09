import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "../types";

const STORAGE_USER = "ballroom_user";

/** Remembered after sign-out so “Sign in” can suggest the last handle on this device. */
export const STORAGE_LAST_USERNAME = "ballroom_last_username";

function visitsKey(username: string) {
  return `ballroom_visits_${username}`;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "??";
}

export interface VisitInfo {
  streak: number;
  totalVisits: number;
  isNewDay: boolean;
}

interface UserContextValue {
  user: UserProfile | null;
  visitInfo: VisitInfo | null;
  login: (username: string, displayName?: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Omit<UserProfile, "username">>) => void;
  clearNewDay: () => void;
}

const defaultProfile = (username: string, displayName?: string): UserProfile => ({
  username: username.trim().toLowerCase().replace(/\s+/g, "_"),
  displayName: (displayName?.trim() || username.trim()) || "dancer",
  discipline: "general",
  accent: "purple",
  soundsEnabled: true,
});

const UserContext = createContext<UserContextValue | null>(null);

function readVisits(username: string): { last: string; streak: number; total: number } {
  try {
    const raw = localStorage.getItem(visitsKey(username));
    if (!raw) return { last: "", streak: 0, total: 0 };
    return JSON.parse(raw) as { last: string; streak: number; total: number };
  } catch {
    return { last: "", streak: 0, total: 0 };
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (!raw) return null;
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  });

  const [visitInfo, setVisitInfo] = useState<VisitInfo | null>(null);

  useEffect(() => {
    if (!user) {
      setVisitInfo(null);
      return;
    }
    const key = todayKey();
    const v = readVisits(user.username);

    if (v.last === key) {
      setVisitInfo({
        streak: v.streak,
        totalVisits: v.total,
        isNewDay: false,
      });
      return;
    }

    let streak = 1;
    if (v.last === yesterdayKey()) streak = v.streak + 1;
    else if (v.last !== "") streak = 1;

    const daysVisited = v.total + 1;
    localStorage.setItem(
      visitsKey(user.username),
      JSON.stringify({ last: key, streak, total: daysVisited }),
    );
    setVisitInfo({
      streak,
      totalVisits: daysVisited,
      isNewDay: true,
    });
  }, [user?.username]);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  const login = useCallback((username: string, displayName?: string) => {
    const u = username.trim();
    if (!u) return;
    setUser(defaultProfile(u, displayName));
  }, []);

  const logout = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) {
        const u = JSON.parse(raw) as UserProfile;
        localStorage.setItem(STORAGE_LAST_USERNAME, u.username);
      }
    } catch {
      /* ignore */
    }
    setUser(null);
    localStorage.removeItem(STORAGE_USER);
  }, []);

  const updateProfile = useCallback((patch: Partial<Omit<UserProfile, "username">>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const clearNewDay = useCallback(() => {
    setVisitInfo((v) => (v ? { ...v, isNewDay: false } : v));
  }, []);

  const value = useMemo(
    () => ({
      user,
      visitInfo,
      login,
      logout,
      updateProfile,
      clearNewDay,
    }),
    [user, visitInfo, login, logout, updateProfile, clearNewDay],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

export { initialsFrom };
