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
import { apiFetch, refreshApiSession } from "../lib/api";
import { updatePassword as submitPasswordChange } from "../lib/mePasswordApi";

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
  authPending: boolean;
  login: (input: {
    mode: "join" | "signin";
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    patch: Partial<Omit<UserProfile, "username">>,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  updatePassword: (input: {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  clearNewDay: () => void;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authPending, setAuthPending] = useState(false);
  const [visitInfo, setVisitInfo] = useState<VisitInfo | null>(null);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiFetch("/api/me");
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as { user: UserProfile };
      setUser({ ...data.user, bio: data.user.bio ?? "" });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

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

  const login = useCallback(
    async (input: {
      mode: "join" | "signin";
      username: string;
      password: string;
      displayName?: string;
    }) => {
      setAuthPending(true);
      try {
        const endpoint = input.mode === "join" ? "/api/auth/sign_up" : "/api/auth/sign_in";
        const payload: Record<string, unknown> = {
          username: input.username,
          password: input.password,
        };
        if (input.mode === "join") {
          payload.display_name = input.displayName?.trim() || input.username.trim();
          payload.password_confirmation = input.password;
        }

        const res = await apiFetch(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { user?: UserProfile; error?: string };
        if (!res.ok || !data.user) {
          return { ok: false as const, error: data.error || "authentication failed" };
        }

        setUser({ ...data.user, bio: data.user.bio ?? "" });
        localStorage.setItem(STORAGE_LAST_USERNAME, data.user.username);
        await refreshApiSession();
        return { ok: true as const };
      } catch {
        return { ok: false as const, error: "network error — check API server and retry" };
      } finally {
        setAuthPending(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      if (user?.username) localStorage.setItem(STORAGE_LAST_USERNAME, user.username);
    } catch {
      /* ignore */
    }

    setAuthPending(true);
    try {
      await apiFetch("/api/auth/sign_out", { method: "DELETE" });
      await refreshApiSession();
    } catch {
      /* ignore network errors on logout */
    }
    setUser(null);
    setAuthPending(false);
  }, [user?.username]);

  const updateProfile = useCallback(async (patch: Partial<Omit<UserProfile, "username">>) => {
    if (!user) return { ok: false as const, error: "not signed in" };

    setAuthPending(true);
    try {
      const payload: Record<string, unknown> = {};
      if (patch.displayName != null) payload.display_name = patch.displayName;
      if (patch.discipline != null) payload.discipline = patch.discipline;
      if (patch.accent != null) payload.accent = patch.accent;
      if (patch.soundsEnabled != null) payload.sounds_enabled = patch.soundsEnabled;
      if (patch.bio != null) payload.bio = patch.bio;

      const res = await apiFetch("/api/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { user?: UserProfile; error?: string };
      if (!res.ok || !data.user) {
        return { ok: false as const, error: data.error || "unable to save profile" };
      }

      setUser({ ...data.user, bio: data.user.bio ?? "" });
      return { ok: true as const };
    } catch {
      return { ok: false as const, error: "network error — profile was not saved" };
    } finally {
      setAuthPending(false);
    }
  }, [user]);

  const updatePassword = useCallback(
    async (input: {
      currentPassword: string;
      password: string;
      passwordConfirmation: string;
    }) => {
      if (!user) return { ok: false as const, error: "not signed in" };

      setAuthPending(true);
      try {
        const result = await submitPasswordChange({
          currentPassword: input.currentPassword,
          password: input.password,
          passwordConfirmation: input.passwordConfirmation,
        });
        return result;
      } finally {
        setAuthPending(false);
      }
    },
    [user],
  );

  const clearNewDay = useCallback(() => {
    setVisitInfo((v) => (v ? { ...v, isNewDay: false } : v));
  }, []);

  const value = useMemo(
    () => ({
      user,
      visitInfo,
      authPending,
      login,
      logout,
      updateProfile,
      updatePassword,
      clearNewDay,
    }),
    [user, visitInfo, authPending, login, logout, updateProfile, updatePassword, clearNewDay],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

export { initialsFrom };
