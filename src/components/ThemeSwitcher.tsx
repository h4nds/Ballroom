import type { AppTheme } from "../context/ThemeContext";
import { THEMES, useTheme } from "../context/ThemeContext";

const LABELS: Record<AppTheme, string> = {
  night: "Night",
  darkness: "Darkness",
  grey: "Static grey",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <span className="theme-switcher-label" id="theme-switcher-label">
        Theme
      </span>
      <div
        className="theme-switcher-group"
        role="group"
        aria-labelledby="theme-switcher-label"
      >
        {THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className={`theme-chip${theme === id ? " is-active" : ""}`}
            onClick={() => setTheme(id)}
            aria-pressed={theme === id}
          >
            {LABELS[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
