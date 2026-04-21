import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForumSounds } from "../hooks/useForumSounds";

export type HeaderSearchHandle = {
  /** Expands the bar and focuses the input. */
  focusSearch: () => void;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
};

export const HeaderSearch = forwardRef<HeaderSearchHandle, Props>(function HeaderSearch(
  { query, onQueryChange },
  ref,
) {
  const [expanded, setExpanded] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { play } = useForumSounds();
  const inputId = useId();

  const close = useCallback(() => {
    setExpanded(false);
    onQueryChange("");
  }, [onQueryChange]);

  useImperativeHandle(
    ref,
    () => ({
      focusSearch: () => {
        setExpanded(true);
      },
    }),
    [],
  );

  useEffect(() => {
    if (!expanded) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onDocDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        play("tap");
        close();
      }
    };
    document.addEventListener("mousedown", onDocDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded, close, play]);

  const open = () => {
    play("whoosh");
    setExpanded(true);
  };

  return (
    <div ref={wrapRef} className={`header-search ${expanded ? "is-expanded" : ""}`}>
      {!expanded ? (
        <button
          type="button"
          className="header-search-trigger linkish"
          aria-expanded={false}
          aria-label="Open board search"
          onClick={open}
        >
          search
        </button>
      ) : (
        <form
          className="header-search-field"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor={inputId} className="visually-hidden">
            Search boards
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            name="board-search"
            className="header-search-input"
            placeholder="boards…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <button
            type="button"
            className="header-search-close"
            aria-label="Close search"
            onClick={() => {
              play("tap");
              close();
            }}
          >
            ×
          </button>
        </form>
      )}
    </div>
  );
});
