import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useUser } from "./UserContext";

const STORAGE_SOUNDS = "ballroom_sounds_enabled";

function readStored(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_SOUNDS);
    if (v === null) return true;
    return v === "true";
  } catch {
    return true;
  }
}

function persist(next: boolean) {
  try {
    localStorage.setItem(STORAGE_SOUNDS, String(next));
  } catch {
    /* ignore */
  }
}

type SoundsContextValue = {
  soundsEnabled: boolean;
  setSoundsEnabled: (next: boolean) => void;
};

const SoundsContext = createContext<SoundsContextValue | null>(null);

export function SoundsProvider({ children }: { children: ReactNode }) {
  const { user, updateProfile } = useUser();
  const [soundsEnabled, setSoundsEnabledState] = useState(readStored);

  useEffect(() => {
    if (!user) return;
    setSoundsEnabledState(user.soundsEnabled);
    persist(user.soundsEnabled);
  }, [user?.username, user?.soundsEnabled]);

  const setSoundsEnabled = useCallback(
    (next: boolean) => {
      setSoundsEnabledState(next);
      persist(next);
      if (user) void updateProfile({ soundsEnabled: next });
    },
    [user, updateProfile],
  );

  const value = useMemo(
    () => ({ soundsEnabled, setSoundsEnabled }),
    [soundsEnabled, setSoundsEnabled],
  );

  return <SoundsContext.Provider value={value}>{children}</SoundsContext.Provider>;
}

export function useSounds() {
  const ctx = useContext(SoundsContext);
  if (!ctx) throw new Error("useSounds must be used within SoundsProvider");
  return ctx;
}
