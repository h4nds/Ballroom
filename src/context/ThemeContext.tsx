import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const THEMES = ["night", "darkness", "grey"] as const;
export type AppTheme = (typeof THEMES)[number];

const STORAGE_THEME = "ballroom_theme";

const THEME_META_COLOR: Record<AppTheme, string> = {
  night: "#09090c",
  darkness: "#000000",
  grey: "#2c2c31",
};

function readStored(): AppTheme {
  try {
    const v = localStorage.getItem(STORAGE_THEME);
    if (v === "night" || v === "darkness" || v === "grey") return v;
  } catch {
    /* ignore */
  }
  return "night";
}

function persist(theme: AppTheme) {
  try {
    localStorage.setItem(STORAGE_THEME, theme);
  } catch {
    /* ignore */
  }
}

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (next: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(readStored);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_META_COLOR[theme]);
  }, [theme]);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    persist(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
